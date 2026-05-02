import { Router } from "express";
import type { IRouter } from "express";
import { createPublicClient, http, fallback, isAddress } from "viem";
import { sepolia } from "viem/chains";

const router: IRouter = Router();

function makePublicClient() {
  return createPublicClient({
    chain: sepolia,
    transport: fallback([
      http(process.env.SEPOLIA_RPC_URL ?? ""),
      http("https://ethereum-sepolia-rpc.publicnode.com"),
      http("https://rpc.sepolia.org"),
    ]),
  });
}

const PASSPORT_REGISTRY_ABI = [
  { type: "function", name: "getTier", inputs: [{ name: "trader", type: "address" }], outputs: [{ name: "", type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "hasPassport", inputs: [{ name: "trader", type: "address" }], outputs: [{ name: "", type: "bool" }], stateMutability: "view" },
] as const;

const HOOK_ABI = [
  { type: "function", name: "previewFee", inputs: [{ name: "trader", type: "address" }], outputs: [{ name: "fee", type: "uint24" }, { name: "tier", type: "uint8" }, { name: "hasPassport", type: "bool" }], stateMutability: "view" },
] as const;

const TIER_LABELS: Record<number, string> = { 0: "neutral", 1: "trusted", 2: "toxic" };

router.get("/resolver", async (req, res): Promise<void> => {
  const trader = req.query.trader as string;
  if (!trader || !isAddress(trader)) {
    res.status(400).json({ error: "Invalid or missing trader address" });
    return;
  }

  const registryAddr = process.env.NEXT_PUBLIC_PASSPORT_REGISTRY;
  const hookAddr = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;

  if (!registryAddr) {
    res.json({
      trader,
      tier: 0,
      tierLabel: "neutral",
      hasActivePassport: false,
      feeBps: 30,
      feePips: 3000,
      resolverType: "not-configured",
      error: "PassportRegistry not deployed — configure NEXT_PUBLIC_PASSPORT_REGISTRY",
      contracts: { registry: null, hook: hookAddr ?? null },
    });
    return;
  }

  try {
    const client = makePublicClient();
    const [tier, hasPassport] = await Promise.all([
      client.readContract({ address: registryAddr as `0x${string}`, abi: PASSPORT_REGISTRY_ABI, functionName: "getTier", args: [trader as `0x${string}`] }),
      client.readContract({ address: registryAddr as `0x${string}`, abi: PASSPORT_REGISTRY_ABI, functionName: "hasPassport", args: [trader as `0x${string}`] }),
    ]);

    let feePips: number = tier === 1 ? 1000 : tier === 2 ? 8000 : 3000;
    if (hookAddr) {
      try {
        const [fp] = await client.readContract({ address: hookAddr as `0x${string}`, abi: HOOK_ABI, functionName: "previewFee", args: [trader as `0x${string}`] }) as [number, number, boolean];
        feePips = fp;
      } catch { /* fallback to registry value */ }
    }

    res.json({
      trader,
      tier: Number(tier),
      tierLabel: TIER_LABELS[Number(tier)] ?? "neutral",
      hasActivePassport: Boolean(hasPassport),
      feeBps: feePips / 100,
      feePips,
      resolverType: "on-chain",
      contracts: { registry: registryAddr, hook: hookAddr ?? null },
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Resolver read failed");
    res.status(500).json({ error: "Chain read failed", details: String(err) });
  }
});

export default router;
