// All contracts deployed and pool initialized on Sepolia 2026-05-02
export const RUNTIME_MODE = {
  passportLive:            true,
  hookPreviewLive:         true,
  poolReady:               true,
  realQuoteLive:           Boolean(import.meta.env.VITE_V4_QUOTER),
  realSwapExecutionReady:  true,
  eventIndexingLive:       true,
  selfRegisterDeployed:    true,
  usdcPoolReady:           true,
  zeroGStorageConfigured:  Boolean(import.meta.env.VITE_ZG_STORAGE_URL),
  zeroGStorageLive:        false,
  keeperHubConfigured:     true,
  keeperHubLive:           true,
  lpProtectionTriggerReady: true,
} as const
