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

// api-src/keeperhub/trigger.ts
var trigger_exports = {};
__export(trigger_exports, {
  default: () => handler
});
module.exports = __toCommonJS(trigger_exports);
async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  const apiUrl = process.env.KEEPERHUB_API_URL;
  const apiKey = process.env.KEEPERHUB_API_KEY;
  const workflowId = process.env.KEEPERHUB_WORKFLOW_ID;
  if (!apiUrl || !apiKey || !workflowId) {
    res.statusCode = 503;
    res.end(JSON.stringify({ triggered: false, error: "KeeperHub not configured", missing: [!apiUrl && "KEEPERHUB_API_URL", !apiKey && "KEEPERHUB_API_KEY", !workflowId && "KEEPERHUB_WORKFLOW_ID"].filter(Boolean) }));
    return;
  }
  let body = req.body ?? {};
  if (typeof body !== "object") {
    try {
      body = JSON.parse(String(body));
    } catch {
      body = {};
    }
  }
  const summary = body.summary ?? {};
  const toxicShareBps = summary.computedToxicShareBps ?? 0;
  const thresholdBps = 3e3;
  const thresholdExceeded = summary.thresholdExceeded ?? false;
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
    callbackUrl: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""}/api/pool-defense/pause`,
    reason: thresholdExceeded ? "TOXIC_THRESHOLD_EXCEEDED" : "MANUAL_TRIGGER",
    triggeredAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    const webhookUrl = `${apiUrl.replace(/\/$/, "")}/workflows/${workflowId}/webhook`;
    const r = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(payload) });
    if (r.status === 410) {
      res.statusCode = 410;
      res.end(JSON.stringify({ triggered: false, error: "Workflow disabled (HTTP 410) \u2014 re-enable in KeeperHub dashboard" }));
      return;
    }
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      res.statusCode = r.status;
      res.end(JSON.stringify({ triggered: false, error: `KeeperHub returned ${r.status}`, details: t }));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ triggered: true, workflowId, triggeredAt: payload.triggeredAt, payload }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ triggered: false, error: String(err) }));
  }
}
