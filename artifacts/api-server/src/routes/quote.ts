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
    ]),
  });
}

const HOOK_ABI = [
  { type: "function", name: "previewFee", inputs: [{ name: "trader", type: "address" }], outputs: [{ name: "fee", type: "uint24" }, { name: "tier", type: "uint8" }, { name: "hasPassport", type: "bool" }], stateMutability: "view" },
] as const;

const TIER_LABELS: Record<number, string> = { 0: "neutral", 1: "trusted", 2: "toxic" };

router.get("/quote", async (req, res): Promise<void> => {
  const rawAmount = (req.query.amountIn as string) ?? "0";
  const trader = req.query.trader as string | undefined;
  const inputDecimals = 18;

  let amountInBaseUnits: bigint;
  try {
    if (rawAmount.includes(".")) {
      const parsed = parseFloat(rawAmount);
      amountInBaseUnits = BigInt(Math.floor(parsed * 10 ** inputDecimals));
    } else {
      amountInBaseUnits = BigInt(rawAmount);
    }
  } catch {
    res.status(400).json({ error: "Invalid amountIn — provide a decimal like 0.001 or base units like 1000000000000000" });
    return;
  }

  const inputAmountHuman = (Number(amountInBaseUnits) / 10 ** inputDecimals).toFixed(6);

  // Default neutral fee
  let feePips = 3000;
  let tierNum = 0;
  let resolverType = "estimated";

  const hookAddr = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  if (hookAddr && trader && isAddress(trader)) {
    try {
      const client = makePublicClient();
      const result = await client.readContract({
        address: hookAddr as `0x${string}`,
        abi: HOOK_ABI,
        functionName: "previewFee",
        args: [trader as `0x${string}`],
      }) as [number, number, boolean];
      feePips = Number(result[0]);
      tierNum = Number(result[1]);
      resolverType = "live-hook";
    } catch { /* fallback */ }
  }

  const feeBps = feePips / 100;
  const feeMultiplier = 1 - feeBps / 10000;

  // Approximate output using 1 ETH = 2000 TOKEN (rough)
  const ethPriceApprox = 2000;
  const outputFloat = parseFloat(inputAmountHuman) * ethPriceApprox * feeMultiplier;
  const isUSDC = Boolean(process.env.NEXT_PUBLIC_USDC_ADDRESS);
  const outputDecimals = isUSDC ? 6 : 18;
  const outputAmountBaseUnits = BigInt(Math.floor(outputFloat * 10 ** outputDecimals));

  res.json({
    inputAmountHuman,
    inputAmountBaseUnits: amountInBaseUnits.toString(),
    outputAmountHuman: outputFloat.toFixed(4),
    outputAmountBaseUnits: outputAmountBaseUnits.toString(),
    outputToken: isUSDC ? "USDC" : "TEST",
    feeBps,
    feePips,
    tier: TIER_LABELS[tierNum] ?? "neutral",
    mode: resolverType,
    pipsConversion: `${feePips} pips = ${feeBps} bps = ${(feeBps / 100).toFixed(2)}%`,
    disclaimer: "Estimated output — not a binding quote. Real output depends on pool liquidity.",
  });
});

export default router;
