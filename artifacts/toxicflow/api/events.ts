import { createPublicClient, http, fallback, parseAbiItem } from 'viem';
import { sepolia } from 'viem/chains';

const SWAP_FEE_APPLIED_EVENT = parseAbiItem(
  'event SwapFeeApplied(bytes32 indexed poolId, address indexed trader, uint8 tier, uint24 appliedFee, int128 amountSpecified, bool hadPassport, uint256 blockNumber)'
);

const TRIGGER_THRESHOLD_BPS = 3000;

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  const hookAddr = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  const empty = { events: [], summary: { totalEvents: 0, toxicEvents: 0, trustedEvents: 0, neutralEvents: 0, computedToxicShareBps: 0, triggerThresholdBps: TRIGGER_THRESHOLD_BPS, thresholdExceeded: false } };

  if (!hookAddr) {
    res.statusCode = 200;
    res.end(JSON.stringify({ ...empty, error: 'ToxicFlowHook not configured' }));
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') ?? (req.query?.limit as string) ?? '20', 10));
  const trader = url.searchParams.get('trader') ?? (req.query?.trader as string);

  try {
    const client = createPublicClient({
      chain: sepolia,
      transport: fallback([http(process.env.SEPOLIA_RPC_URL ?? ''), http('https://ethereum-sepolia-rpc.publicnode.com')]),
    });

    const latestBlock = await client.getBlockNumber();
    const fromBlock = latestBlock > 10000n ? latestBlock - 10000n : 0n;

    const logs = await client.getLogs({ address: hookAddr as `0x${string}`, event: SWAP_FEE_APPLIED_EVENT, fromBlock, toBlock: 'latest' });

    const filtered = trader ? logs.filter(l => l.args.trader?.toLowerCase() === trader.toLowerCase()) : logs;
    const sliced = filtered.slice(-limit).reverse();

    const events = sliced.map(log => ({
      txHash: log.transactionHash ?? '',
      poolId: log.args.poolId ?? '',
      trader: log.args.trader ?? '',
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
    const toxicEvents   = filtered.filter(l => Number(l.args.tier) === 2).length;
    const trustedEvents = filtered.filter(l => Number(l.args.tier) === 1).length;
    const neutralEvents = filtered.filter(l => Number(l.args.tier) === 0).length;
    const computedToxicShareBps = totalEvents > 0 ? Math.round((toxicEvents / totalEvents) * 10000) : 0;

    res.statusCode = 200;
    res.end(JSON.stringify({ events, summary: { totalEvents, toxicEvents, trustedEvents, neutralEvents, computedToxicShareBps, triggerThresholdBps: TRIGGER_THRESHOLD_BPS, thresholdExceeded: computedToxicShareBps > TRIGGER_THRESHOLD_BPS } }));
  } catch (err: unknown) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ...empty, error: 'Failed to fetch events', details: String(err) }));
  }
}
