import { createWalletClient, createPublicClient, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';

const ABI = parseAbi(['function pauseSwaps(bytes32 reason) external']);

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'Method not allowed' })); return; }

  const apiKey = process.env.KEEPERHUB_API_KEY;
  const auth = (req.headers?.authorization ?? req.headers?.Authorization ?? '') as string;
  if (!apiKey || auth !== `Bearer ${apiKey}`) { res.statusCode = 401; res.end(JSON.stringify({ paused: false, error: 'Unauthorized' })); return; }

  const hookAddress = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  const privateKey  = process.env.DEPLOYER_PRIVATE_KEY;
  const rpcUrl      = process.env.SEPOLIA_RPC_URL;

  if (!hookAddress || !privateKey || !rpcUrl) {
    res.statusCode = 503;
    res.end(JSON.stringify({ paused: false, error: 'Circuit breaker not configured', note: 'Requires NEXT_PUBLIC_TOXIC_FLOW_HOOK (V2), DEPLOYER_PRIVATE_KEY, SEPOLIA_RPC_URL' }));
    return;
  }

  let body = req.body ?? {};
  if (typeof body !== 'object') { try { body = JSON.parse(String(body)); } catch { body = {}; } }
  const reason = typeof (body as any).reason === 'string' ? (body as any).reason : 'TOXIC_THRESHOLD_EXCEEDED';

  try {
    const { privateKeyToAccount } = await import('viem/accounts');
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ chain: sepolia, transport });
    const walletClient = createWalletClient({ chain: sepolia, transport, account });
    const buf = Buffer.alloc(32); Buffer.from(reason.slice(0, 31), 'utf8').copy(buf);
    const reasonBytes32 = `0x${buf.toString('hex')}` as `0x${string}`;
    const hash = await walletClient.writeContract({ address: hookAddress as `0x${string}`, abi: ABI, functionName: 'pauseSwaps', args: [reasonBytes32] });
    await publicClient.waitForTransactionReceipt({ hash });
    res.statusCode = 200;
    res.end(JSON.stringify({ paused: true, txHash: hash, reason, pausedAt: new Date().toISOString() }));
  } catch (err: unknown) {
    const msg = String(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ paused: false, error: msg, note: msg.includes('function') || msg.includes('revert') ? 'Current hook (V1) does not support pauseSwaps — deploy ToxicFlowHookV2' : 'Transaction failed' }));
  }
}
