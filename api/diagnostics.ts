export default async function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (_req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  const env = process.env;

  const scorerKey     = env.SCORER_PRIVATE_KEY ?? env.DEPLOYER_PRIVATE_KEY;
  const rpcUrl        = env.SEPOLIA_RPC_URL;
  const registry      = env.NEXT_PUBLIC_PASSPORT_REGISTRY;
  const hook          = env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  const poolId        = env.NEXT_PUBLIC_POOL_ID;
  const poolSwapTest  = env.NEXT_PUBLIC_POOL_SWAP_TEST;
  const usdcAddress   = env.NEXT_PUBLIC_USDC_ADDRESS;
  const zgStorageUrl  = env.NEXT_PUBLIC_ZG_STORAGE_URL;
  const signerKey     = env.ZG_SIGNER_PRIVATE_KEY;
  const keeperUrl     = env.KEEPERHUB_API_URL;
  const keeperKey     = env.KEEPERHUB_API_KEY;

  const missing: string[] = [];
  if (!scorerKey)    missing.push('SCORER_PRIVATE_KEY (or DEPLOYER_PRIVATE_KEY)');
  if (!rpcUrl)       missing.push('SEPOLIA_RPC_URL');
  if (!registry)     missing.push('NEXT_PUBLIC_PASSPORT_REGISTRY');

  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'ok',
    apiRuntime: 'vercel-function',
    timestamp: new Date().toISOString(),
    demoModeEnabled: Boolean(scorerKey && registry),
    deployerKeyConfigured: Boolean(scorerKey),
    rpcConfigured: Boolean(rpcUrl),
    passportRegistryConfigured: Boolean(registry),
    hookConfigured: Boolean(hook),
    poolConfigured: Boolean(poolId),
    keeperHubConfigured: Boolean(keeperUrl && keeperKey),
    zeroGConfigured: Boolean(zgStorageUrl && signerKey),
    missingForDemo: missing,
    contracts: {
      passportRegistry: registry ?? null,
      toxicFlowHook: hook ?? null,
      poolSwapTest: poolSwapTest ?? null,
      usdcAddress: usdcAddress ?? null,
      poolId: poolId ?? null,
    },
  }));
}
