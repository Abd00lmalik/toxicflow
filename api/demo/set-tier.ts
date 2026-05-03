import { createWalletClient, createPublicClient, http, fallback, isAddress, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';

const REGISTRY_ABI = parseAbi([
  'function setTier(address trader, uint8 tier) external',
]);

const TIER_LABELS: Record<number, string> = { 0: 'neutral', 1: 'trusted', 2: 'toxic' };

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    return;
  }

  let body = req.body;
  if (!body || typeof body !== 'object') {
    try {
      const raw: string = await new Promise((resolve, reject) => {
        let s = '';
        req.on('data', (c: Buffer) => { s += c.toString(); });
        req.on('end', () => resolve(s));
        req.on('error', reject);
      });
      body = raw ? JSON.parse(raw) : {};
    } catch { body = {}; }
  }

  const { trader, tier } = body as { trader?: string; tier?: unknown };

  if (!trader || !isAddress(trader)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ success: false, error: 'Invalid or missing wallet address' }));
    return;
  }

  const tierNum = Number(tier);
  if (!Number.isInteger(tierNum) || tierNum < 0 || tierNum > 2) {
    res.statusCode = 400;
    res.end(JSON.stringify({ success: false, error: 'Invalid tier — must be 0 (Neutral), 1 (Trusted), or 2 (Toxic)' }));
    return;
  }

  const scorerKey = process.env.SCORER_PRIVATE_KEY ?? process.env.DEPLOYER_PRIVATE_KEY;
  if (!scorerKey) {
    res.statusCode = 503;
    res.end(JSON.stringify({
      success: false,
      error: 'Demo activation not configured: scorer private key missing',
      missingEnvVar: 'SCORER_PRIVATE_KEY',
      fix: 'Add SCORER_PRIVATE_KEY (or DEPLOYER_PRIVATE_KEY) in your Vercel project Environment Variables',
    }));
    return;
  }

  const registryAddr = process.env.NEXT_PUBLIC_PASSPORT_REGISTRY;
  if (!registryAddr || !isAddress(registryAddr)) {
    res.statusCode = 503;
    res.end(JSON.stringify({
      success: false,
      error: 'Demo activation not configured: passport registry address missing',
      missingEnvVar: 'NEXT_PUBLIC_PASSPORT_REGISTRY',
      fix: 'Add NEXT_PUBLIC_PASSPORT_REGISTRY=0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e in Vercel Environment Variables',
    }));
    return;
  }

  try {
    const { privateKeyToAccount } = await import('viem/accounts');
    const account = privateKeyToAccount(scorerKey as `0x${string}`);

    const transport = fallback([
      http(process.env.SEPOLIA_RPC_URL ?? ''),
      http('https://ethereum-sepolia-rpc.publicnode.com'),
      http('https://rpc.sepolia.org'),
    ]);

    const publicClient = createPublicClient({ account, chain: sepolia, transport });
    const walletClient = createWalletClient({ account, chain: sepolia, transport });

    const { request } = await publicClient.simulateContract({
      address: registryAddr as `0x${string}`,
      abi: REGISTRY_ABI,
      functionName: 'setTier',
      args: [trader as `0x${string}`, tierNum],
      account,
    });

    const txHash = await walletClient.writeContract(request);

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      txHash,
      trader,
      tier: tierNum,
      tierLabel: TIER_LABELS[tierNum],
      message: `Tier set to ${TIER_LABELS[tierNum]} on-chain`,
    }));
  } catch (err: unknown) {
    const msg = String(err);
    const isRevert = msg.includes('revert') || msg.includes('NotScorer') || msg.includes('Unauthorized');
    res.statusCode = isRevert ? 403 : 500;
    res.end(JSON.stringify({
      success: false,
      error: isRevert
        ? 'Transaction reverted — scorer wallet may not have setTier permission on the registry'
        : `Transaction failed: ${msg}`,
      details: msg,
    }));
  }
}
