"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api-src/diagnostics.ts
var diagnostics_exports = {};
__export(diagnostics_exports, {
  default: () => handler
});
module.exports = __toCommonJS(diagnostics_exports);
async function handler(_req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (_req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  const env = process.env;
  const scorerKey = env.SCORER_PRIVATE_KEY ?? env.DEPLOYER_PRIVATE_KEY;
  const rpcUrl = env.SEPOLIA_RPC_URL;
  const registry = env.NEXT_PUBLIC_PASSPORT_REGISTRY;
  const hook = env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  const poolId = env.NEXT_PUBLIC_POOL_ID;
  const poolSwapTest = env.NEXT_PUBLIC_POOL_SWAP_TEST;
  const usdcAddress = env.NEXT_PUBLIC_USDC_ADDRESS;
  const zgStorageUrl = env.NEXT_PUBLIC_ZG_STORAGE_URL;
  const signerKey = env.ZG_SIGNER_PRIVATE_KEY;
  const keeperUrl = env.KEEPERHUB_API_URL;
  const keeperKey = env.KEEPERHUB_API_KEY;
  const missing = [];
  if (!scorerKey) missing.push("SCORER_PRIVATE_KEY (or DEPLOYER_PRIVATE_KEY)");
  if (!rpcUrl) missing.push("SEPOLIA_RPC_URL");
  if (!registry) missing.push("NEXT_PUBLIC_PASSPORT_REGISTRY");
  res.statusCode = 200;
  res.end(JSON.stringify({
    status: "ok",
    apiRuntime: "vercel-function",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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
      poolId: poolId ?? null
    }
  }));
}
