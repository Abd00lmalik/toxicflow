import { createWalletClient, createPublicClient, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';

const ABI = parseAbi(['function resumeSwaps() external']);

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'Method not allowed' })); return; }

  const apiKey = process.env.KEEPERHUB_API_KEY;
  const auth = (req.headers?.authorization ?? req.headers?.Authorization ?? '') as string;
  if (!apiKey || auth !== `Bearer ${apiKey}`) { res.statusCode = 401; res.end(JSON.stringify({ resumed: false, error: 'Unauthorized' })); return; }

  const hookAddress = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  const privateKey  = process.env.DEPLOYER_PRIVATE_KEY;
  const rpcUrl      = process.env.SEPOLIA_RPC_URL;

  if (!hookAddress || !privateKey || !rpcUrl) { res.statusCode = 503; res.end(JSON.stringify({ resumed: false, error: 'Not configured' })); return; }

  try {
    const { privateKeyToAccount } = await import('viem/accounts');
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ chain: sepolia, transport });
    const walletClient = createWalletClient({ chain: sepolia, transport, account });
    const hash = await walletClient.writeContract({ address: hookAddress as `0x${string}`, abi: ABI, functionName: 'resumeSwaps', args: [] });
    await publicClient.waitForTransactionReceipt({ hash });
    res.statusCode = 200;
    res.end(JSON.stringify({ resumed: true, txHash: hash }));
  } catch (err: unknown) {
    res.statusCode = 500;
    res.end(JSON.stringify({ resumed: false, error: String(err) }));
  }
}
