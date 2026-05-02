import { Router } from "express";
import type { IRouter } from "express";
import { createWalletClient, createPublicClient, http, fallback, isAddress, parseAbi } from "viem";
import { sepolia } from "viem/chains";

const router: IRouter = Router();

const REGISTRY_ABI = parseAbi([
  "function setTier(address trader, uint8 tier) external",
]);

router.post("/demo/set-tier", async (req, res): Promise<void> => {
  const { trader, tier } = req.body as { trader?: string; tier?: unknown };

  if (!trader || !isAddress(trader)) {
    res.status(400).json({ success: false, error: "Invalid address" });
    return;
  }

  const tierNum = Number(tier);
  if (!Number.isInteger(tierNum) || tierNum < 0 || tierNum > 2) {
    res.status(400).json({ success: false, error: "Invalid tier — must be 0, 1, or 2" });
    return;
  }

  const scorerKey = process.env.SCORER_PRIVATE_KEY ?? process.env.DEPLOYER_PRIVATE_KEY;
  if (!scorerKey) {
    res.status(503).json({ success: false, error: "Scorer key not configured (SCORER_PRIVATE_KEY)" });
    return;
  }

  const registryAddr = process.env.NEXT_PUBLIC_PASSPORT_REGISTRY;
  if (!registryAddr || !isAddress(registryAddr)) {
    res.status(503).json({ success: false, error: "Registry not configured (NEXT_PUBLIC_PASSPORT_REGISTRY)" });
    return;
  }

  try {
    const { privateKeyToAccount } = await import("viem/accounts");
    const account = privateKeyToAccount(scorerKey as `0x${string}`);

    const transport = fallback([
      http(process.env.SEPOLIA_RPC_URL ?? ""),
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ]);

    const walletClient = createWalletClient({ account, chain: sepolia, transport });
    const publicClient = createPublicClient({ chain: sepolia, transport });

    const { request } = await publicClient.simulateContract({
      address: registryAddr as `0x${string}`,
      abi: REGISTRY_ABI,
      functionName: "setTier",
      args: [trader as `0x${string}`, tierNum],
      account,
    });

    const txHash = await walletClient.writeContract(request);

    const TIER_LABELS: Record<number, string> = { 0: "neutral", 1: "trusted", 2: "toxic" };
    res.json({
      success: true,
      txHash,
      trader,
      tier: tierNum,
      tierLabel: TIER_LABELS[tierNum],
    });
  } catch (err: unknown) {
    req.log.error({ err }, "set-tier failed");
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
