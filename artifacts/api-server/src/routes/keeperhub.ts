import { Router } from "express";
import type { IRouter } from "express";

const router: IRouter = Router();

let lastTriggeredAt: string | null = null;
let keeperHubLive = false;

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
  const payload = {
    protocol: "toxicflow-passport",
    chainId: 11155111,
    hookAddress: process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK ?? null,
    poolId: process.env.NEXT_PUBLIC_POOL_ID ?? null,
    toxicShareBps: body.summary ? (body.summary as Record<string, number>).computedToxicShareBps ?? 0 : 0,
    thresholdBps: 3000,
    thresholdExceeded: body.summary ? Boolean((body.summary as Record<string, boolean>).thresholdExceeded) : false,
    manual: Boolean(body.manual),
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

router.get("/keeperhub/status", async (_req, res): Promise<void> => {
  res.json({ configured: Boolean(process.env.KEEPERHUB_API_URL), live: keeperHubLive, lastTriggeredAt });
});

export { keeperHubLive };
export default router;
