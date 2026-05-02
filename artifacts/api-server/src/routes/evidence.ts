import { Router } from "express";
import type { IRouter } from "express";

const router: IRouter = Router();

// In-memory cache for anchored records (per process)
const anchoredRecords: Array<{
  txHash: string;
  storageRef: string;
  anchoredAt: number;
  tier?: number;
  feeBps?: number;
}> = [];

const anchoredSet = new Set<string>();

router.post("/evidence/anchor", async (req, res): Promise<void> => {
  const { txHash, tier, feeBps } = req.body as { txHash?: string; tier?: number; feeBps?: number };

  if (!txHash || typeof txHash !== "string") {
    res.status(400).json({ anchored: false, error: "txHash required" });
    return;
  }

  if (anchoredSet.has(txHash)) {
    const existing = anchoredRecords.find(r => r.txHash === txHash);
    res.json({ anchored: true, storageRef: existing?.storageRef, duplicate: true });
    return;
  }

  const zgUrl = process.env.NEXT_PUBLIC_ZG_STORAGE_URL;
  const signerKey = process.env.ZG_SIGNER_PRIVATE_KEY;

  if (!zgUrl || !signerKey) {
    // Store locally without 0G
    const storageRef = `local:${txHash.slice(0, 16)}`;
    anchoredSet.add(txHash);
    anchoredRecords.unshift({ txHash, storageRef, anchoredAt: Date.now(), tier, feeBps });
    if (anchoredRecords.length > 200) anchoredRecords.splice(200);
    res.json({
      anchored: true,
      storageRef,
      mode: "local",
      note: "0G Storage not configured — record stored in-process only. Configure ZG_SIGNER_PRIVATE_KEY and NEXT_PUBLIC_ZG_STORAGE_URL for decentralized storage.",
    });
    return;
  }

  try {
    // Attempt 0G storage with 30s timeout
    const evidence = {
      txHash,
      tier: tier ?? 0,
      feeBps: feeBps ?? 30,
      anchoredAt: new Date().toISOString(),
      protocol: "toxicflow-passport",
      chainId: 11155111,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      // Dynamic import to avoid client bundle
      const { Indexer } = await import("@0glabs/0g-ts-sdk" as string).catch(() => ({ Indexer: null }));
      if (!Indexer) throw new Error("0G SDK not available");

      const { privateKeyToAccount } = await import("viem/accounts");
      const account = privateKeyToAccount(signerKey as `0x${string}`);

      // Simplified upload via REST if SDK unavailable
      const uploadRes = await fetch(`${zgUrl}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Signer": account.address },
        body: JSON.stringify(evidence),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
      const uploadData = await uploadRes.json() as { ref?: string; hash?: string };
      const storageRef = uploadData.ref ?? uploadData.hash ?? `zg:${txHash.slice(0, 16)}`;

      anchoredSet.add(txHash);
      anchoredRecords.unshift({ txHash, storageRef, anchoredAt: Date.now(), tier, feeBps });
      if (anchoredRecords.length > 200) anchoredRecords.splice(200);

      res.json({ anchored: true, storageRef, mode: "0g-storage" });
    } catch (innerErr: unknown) {
      clearTimeout(timeout);
      throw innerErr;
    }
  } catch (err: unknown) {
    req.log.warn({ err }, "0G anchor failed, falling back to local");

    const errMsg = String(err);
    if (errMsg.includes("insufficient") || errMsg.includes("balance")) {
      res.json({
        anchored: false,
        error: "0G signer requires testnet tokens — visit https://faucet.0g.ai",
        mode: "failed",
      });
      return;
    }

    // Local fallback
    const storageRef = `local:${txHash.slice(0, 16)}`;
    anchoredSet.add(txHash);
    anchoredRecords.unshift({ txHash, storageRef, anchoredAt: Date.now(), tier, feeBps });
    if (anchoredRecords.length > 200) anchoredRecords.splice(200);
    res.json({ anchored: true, storageRef, mode: "local-fallback", note: errMsg });
  }
});

router.get("/evidence/anchored", async (req, res): Promise<void> => {
  const limit = Math.min(100, parseInt((req.query.limit as string) ?? "20", 10));
  res.json({ records: anchoredRecords.slice(0, limit), total: anchoredRecords.length });
});

export default router;
