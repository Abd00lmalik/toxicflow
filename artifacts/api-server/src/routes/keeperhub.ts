import { Router } from "express";
import type { IRouter } from "express";
import {
  createWalletClient,
  createPublicClient,
  http,
  parseAbi,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const router: IRouter = Router();

let lastTriggeredAt: string | null = null;
let keeperHubLive = false;

interface SwapsPausedState {
  paused: boolean;
  reason: string | null;
  txHash: string | null;
  pausedAt: string | null;
  pausedBy: string | null;
}

const circuitBreakerState: SwapsPausedState = {
  paused: false,
  reason: null,
  txHash: null,
  pausedAt: null,
  pausedBy: null,
};

const CIRCUIT_BREAKER_ABI = parseAbi([
  "function pauseSwaps(bytes32 reason) external",
  "function resumeSwaps() external",
  "function paused() external view returns (bool)",
]);

function encodeReason(reason: string): `0x${string}` {
  const buf = Buffer.alloc(32);
  Buffer.from(reason.slice(0, 31), "utf8").copy(buf);
  return `0x${buf.toString("hex")}`;
}

function requireKeeperHubAuth(
  req: Parameters<Parameters<typeof router.post>[1]>[0],
  res: Parameters<Parameters<typeof router.post>[1]>[1]
): boolean {
  const apiKey = process.env.KEEPERHUB_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "KeeperHub not configured" });
    return false;
  }
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${apiKey}`) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// ─── Trigger (existing, enhanced payload) ─────────────────────────────────────
router.post("/keeperhub/trigger", async (req, res): Promise<void> => {
  const apiUrl = process.env.KEEPERHUB_API_URL;
  const apiKey = process.env.KEEPERHUB_API_KEY;
  const workflowId = process.env.KEEPERHUB_WORKFLOW_ID;

  if (!apiUrl || !apiKey || !workflowId) {
    res.status(503).json({
      triggered: false,
      error: "KeeperHub not configured. Set KEEPERHUB_API_URL, KEEPERHUB_API_KEY, and KEEPERHUB_WORKFLOW_ID.",
    });
    return;
  }

  const body = req.body as Record<string, unknown>;
  const summary = body.summary as Record<string, number | boolean> | undefined;

  const toxicShareBps = summary?.computedToxicShareBps ?? 0;
  const thresholdBps  = 3000;
  const thresholdExceeded = summary?.thresholdExceeded ?? false;

  const payload = {
    protocol: "toxicflow-passport",
    action: thresholdExceeded ? "PAUSE_SWAPS" : "MONITOR",
    chainId: 11155111,
    hookAddress: process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK ?? null,
    poolId: process.env.NEXT_PUBLIC_POOL_ID ?? null,
    toxicShareBps,
    thresholdBps,
    thresholdExceeded,
    manual: Boolean(body.manual),
    circuitBreakerState,
    callbackUrl: `${process.env.API_BASE_URL ?? ""}/api/pool-defense/pause`,
    reason: thresholdExceeded ? "TOXIC_THRESHOLD_EXCEEDED" : "MANUAL_TRIGGER",
    triggeredAt: new Date().toISOString(),
  };

  try {
    const webhookUrl = `${apiUrl.replace(/\/$/, "")}/workflows/${workflowId}/webhook`;
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 410) {
      res.status(410).json({
        triggered: false,
        error: "Workflow is disabled or deleted (HTTP 410)",
        remediation: [
          "1. Log into KeeperHub dashboard",
          "2. Navigate to your workflow",
          "3. Enable or re-create the workflow",
          "4. Update KEEPERHUB_WORKFLOW_ID with the new ID",
        ],
      });
      return;
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      res.status(response.status).json({ triggered: false, error: `KeeperHub returned ${response.status}`, details: text });
      return;
    }

    keeperHubLive = true;
    lastTriggeredAt = new Date().toISOString();

    res.json({
      triggered: true,
      message: `KeeperHub workflow triggered successfully`,
      workflowId,
      triggeredAt: lastTriggeredAt,
      payload,
    });
  } catch (err: unknown) {
    req.log.error({ err }, "KeeperHub trigger failed");
    res.status(500).json({ triggered: false, error: String(err) });
  }
});

// ─── Circuit Breaker: Pause ────────────────────────────────────────────────────
router.post("/pool-defense/pause", async (req, res): Promise<void> => {
  if (!requireKeeperHubAuth(req, res)) return;

  const hookAddress = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  const privateKey  = process.env.DEPLOYER_PRIVATE_KEY;
  const rpcUrl      = process.env.SEPOLIA_RPC_URL;

  if (!hookAddress || !privateKey || !rpcUrl) {
    res.status(503).json({
      paused: false,
      error: "Circuit breaker not configured. Requires NEXT_PUBLIC_TOXIC_FLOW_HOOK, DEPLOYER_PRIVATE_KEY, SEPOLIA_RPC_URL.",
      note: "Also requires ToxicFlowHookV2 to be deployed — the current V1 hook does not support pauseSwaps().",
    });
    return;
  }

  const body = req.body as Record<string, unknown>;
  const reason = typeof body.reason === "string" ? body.reason : "TOXIC_THRESHOLD_EXCEEDED";

  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: http(rpcUrl),
      account,
    });
    const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) });

    const hash = await walletClient.writeContract({
      address: hookAddress as `0x${string}`,
      abi: CIRCUIT_BREAKER_ABI,
      functionName: "pauseSwaps",
      args: [encodeReason(reason)],
    });

    await publicClient.waitForTransactionReceipt({ hash });

    circuitBreakerState.paused   = true;
    circuitBreakerState.reason   = reason;
    circuitBreakerState.txHash   = hash;
    circuitBreakerState.pausedAt = new Date().toISOString();
    circuitBreakerState.pausedBy = account.address;

    req.log.info({ hash, reason }, "Swaps paused via circuit breaker");

    res.json({
      paused: true,
      txHash: hash,
      reason,
      pausedAt: circuitBreakerState.pausedAt,
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Circuit breaker pause failed");
    const msg = String(err);
    const isV1Hook = msg.includes("function") || msg.includes("revert") || msg.includes("selector");
    res.status(500).json({
      paused: false,
      error: msg,
      note: isV1Hook
        ? "The current deployed hook (V1) does not have pauseSwaps(). Deploy ToxicFlowHookV2 and update NEXT_PUBLIC_TOXIC_FLOW_HOOK."
        : "Transaction failed — check account balance and RPC.",
    });
  }
});

// ─── Circuit Breaker: Resume ───────────────────────────────────────────────────
router.post("/pool-defense/resume", async (req, res): Promise<void> => {
  if (!requireKeeperHubAuth(req, res)) return;

  const hookAddress = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  const privateKey  = process.env.DEPLOYER_PRIVATE_KEY;
  const rpcUrl      = process.env.SEPOLIA_RPC_URL;

  if (!hookAddress || !privateKey || !rpcUrl) {
    res.status(503).json({ resumed: false, error: "Circuit breaker not configured" });
    return;
  }

  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({ chain: sepolia, transport: http(rpcUrl), account });
    const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) });

    const hash = await walletClient.writeContract({
      address: hookAddress as `0x${string}`,
      abi: CIRCUIT_BREAKER_ABI,
      functionName: "resumeSwaps",
      args: [],
    });

    await publicClient.waitForTransactionReceipt({ hash });

    circuitBreakerState.paused   = false;
    circuitBreakerState.reason   = null;
    circuitBreakerState.txHash   = hash;
    circuitBreakerState.pausedBy = null;

    req.log.info({ hash }, "Swaps resumed");

    res.json({ resumed: true, txHash: hash });
  } catch (err: unknown) {
    req.log.error({ err }, "Circuit breaker resume failed");
    res.status(500).json({ resumed: false, error: String(err) });
  }
});

// ─── Circuit Breaker: Status ───────────────────────────────────────────────────
router.get("/pool-defense/status", (_req, res): void => {
  const hookAddress = process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK;
  res.json({
    circuitBreaker: circuitBreakerState,
    hookV2Required: true,
    currentHook: hookAddress ?? null,
    note: "Circuit breaker requires ToxicFlowHookV2. Current deployment is V1 (no pause support).",
  });
});

// ─── KeeperHub status ─────────────────────────────────────────────────────────
router.get("/keeperhub/status", async (_req, res): Promise<void> => {
  res.json({ configured: Boolean(process.env.KEEPERHUB_API_URL), live: keeperHubLive, lastTriggeredAt });
});

export { keeperHubLive };
export default router;
