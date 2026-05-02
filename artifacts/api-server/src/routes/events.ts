import { Router } from "express";
import type { IRouter } from "express";
import { createPublicClient, http, fallback, parseAbiItem } from "viem";
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

const SWAP_FEE_APPLIED_EVENT = parseAbiItem(
  "event SwapFeeApplied(bytes32 indexed poolId, address indexed trader, uint8 tier, uint24 appliedFee, int128 amountSpecified, bool hadPassport, uint256 blockNumber)"
);

const TRIGGER_THRESHOLD_BPS = 3000; // 30% toxic share triggers defense

router.get("/events", async (req, res): Promise<void> => {
  const hookAddr = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  if (!hookAddr) {
    res.json({
      events: [],
      summary: {
        totalEvents: 0,
        toxicEvents: 0,
        trustedEvents: 0,
        neutralEvents: 0,
        computedToxicShareBps: 0,
        triggerThresholdBps: TRIGGER_THRESHOLD_BPS,
        thresholdExceeded: false,
      },
      error: "ToxicFlowHook not configured",
    });
    return;
  }

  const limit = Math.min(100, parseInt((req.query.limit as string) ?? "20", 10));
  const trader = req.query.trader as string | undefined;

  try {
    const client = makePublicClient();
    const latestBlock = await client.getBlockNumber();
    const fromBlock = latestBlock > 10000n ? latestBlock - 10000n : 0n;

    const logs = await client.getLogs({
      address: hookAddr as `0x${string}`,
      event: SWAP_FEE_APPLIED_EVENT,
      fromBlock,
      toBlock: "latest",
    });

    const filtered = trader
      ? logs.filter(l => l.args.trader?.toLowerCase() === trader.toLowerCase())
      : logs;

    const sliced = filtered.slice(-limit).reverse();

    const events = sliced.map(log => ({
      txHash: log.transactionHash ?? "",
      poolId: log.args.poolId ?? "",
      trader: log.args.trader ?? "",
      tier: Number(log.args.tier ?? 0),
      appliedFeePips: Number(log.args.appliedFee ?? 3000),
      appliedFeeBps: Number(log.args.appliedFee ?? 3000) / 100,
      amountSpecified: String(log.args.amountSpecified ?? 0),
      hadPassport: Boolean(log.args.hadPassport),
      blockNumber: String(log.blockNumber ?? 0),
      hookAddress: hookAddr,
      chainId: 11155111,
      timestampMs: null,
    }));

    const totalEvents = filtered.length;
    const toxicEvents = filtered.filter(l => Number(l.args.tier) === 2).length;
    const trustedEvents = filtered.filter(l => Number(l.args.tier) === 1).length;
    const neutralEvents = filtered.filter(l => Number(l.args.tier) === 0).length;
    const computedToxicShareBps = totalEvents > 0 ? Math.round((toxicEvents / totalEvents) * 10000) : 0;
    const thresholdExceeded = computedToxicShareBps > TRIGGER_THRESHOLD_BPS;

    res.json({
      events,
      summary: {
        totalEvents,
        toxicEvents,
        trustedEvents,
        neutralEvents,
        computedToxicShareBps,
        triggerThresholdBps: TRIGGER_THRESHOLD_BPS,
        thresholdExceeded,
      },
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Events fetch failed");
    res.status(500).json({ error: "Failed to fetch events", details: String(err) });
  }
});

export default router;
