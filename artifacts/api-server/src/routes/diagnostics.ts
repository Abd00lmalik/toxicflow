import { Router } from "express";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/diagnostics", async (req, res): Promise<void> => {
  const env = process.env;

  const passportRegistry = env.NEXT_PUBLIC_PASSPORT_REGISTRY;
  const toxicFlowHook = env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  const poolSwapTest = env.NEXT_PUBLIC_POOL_SWAP_TEST;
  const poolManager = env.NEXT_PUBLIC_POOL_MANAGER;
  const v4Quoter = env.NEXT_PUBLIC_V4_QUOTER;
  const poolId = env.NEXT_PUBLIC_POOL_ID;
  const usdcAddress = env.NEXT_PUBLIC_USDC_ADDRESS;
  const testToken = env.NEXT_PUBLIC_TEST_TOKEN;
  const zgStorageUrl = env.NEXT_PUBLIC_ZG_STORAGE_URL;
  const keeperHubUrl = env.KEEPERHUB_API_URL;
  const keeperHubKey = env.KEEPERHUB_API_KEY;

  const signerKey = env.ZG_SIGNER_PRIVATE_KEY;
  let signerAddress: string | null = null;
  if (signerKey) {
    try {
      const { privateKeyToAccount } = await import("viem/accounts");
      const account = privateKeyToAccount(signerKey as `0x${string}`);
      signerAddress = account.address;
    } catch {
      signerAddress = "invalid key format";
    }
  }

  const runtimeMode = {
    passportLive: Boolean(passportRegistry),
    hookPreviewLive: Boolean(toxicFlowHook),
    poolReady: Boolean(poolId),
    realQuoteLive: Boolean(v4Quoter),
    realSwapExecutionReady: Boolean(poolId && poolSwapTest),
    eventIndexingLive: Boolean(toxicFlowHook),
    selfRegisterDeployed: env.NEXT_PUBLIC_SELF_REGISTER_DEPLOYED === "true",
    usdcPoolReady: Boolean(usdcAddress && poolId),
    zeroGStorageConfigured: Boolean(zgStorageUrl),
    keeperHubConfigured: Boolean(keeperHubUrl && keeperHubKey),
  };

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    chain: { id: 11155111, name: "Sepolia" },
    contracts: {
      passportRegistry: passportRegistry ?? null,
      toxicFlowHook: toxicFlowHook ?? null,
      poolSwapTest: poolSwapTest ?? "0x9b6b46e2c869aa39918db7f52f5557fe577b6eee",
      poolManager: poolManager ?? "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543",
      v4Quoter: v4Quoter ?? null,
    },
    pool: {
      poolId: poolId ?? null,
      pair: usdcAddress ? "ETH/USDC" : testToken ? "ETH/TEST" : "not configured",
      usdcAddress: usdcAddress ?? null,
      testToken: testToken ?? null,
    },
    integrations: {
      zeroGStorage: {
        configured: Boolean(zgStorageUrl),
        url: zgStorageUrl ?? null,
        signerAddress,
        signerFunded: null,
      },
      keeperHub: {
        configured: Boolean(keeperHubUrl && keeperHubKey),
        url: keeperHubUrl ?? null,
        workflowId: env.KEEPERHUB_WORKFLOW_ID ?? null,
        live: false,
      },
    },
    runtimeMode,
  });
});

export default router;
