import { Router } from "express";
import type { IRouter } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);
const router: IRouter = Router();

const WORKSPACE = path.resolve("/home/runner/workspace");
const FOUNDRY_BIN = `${process.env.HOME}/.foundry/bin`;

/** GET /api/liquidity/status - pool liquidity config */
router.get("/liquidity/status", (_req, res) => {
  const configured =
    Boolean(process.env.DEPLOYER_PRIVATE_KEY) &&
    Boolean(process.env.VITE_TOXIC_FLOW_HOOK) &&
    Boolean(process.env.SEPOLIA_RPC_URL);

  res.json({
    poolPair: "ETH/USDC",
    targetPrice: "1 ETH = 2,000 USDC",
    tickRange: { lower: -887220, upper: 887220, spacing: 60 },
    poolManager: "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543",
    hook: process.env.VITE_TOXIC_FLOW_HOOK ?? null,
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    deployerConfigured: configured,
    note: "Liquidity is added from the protocol deployer wallet (testnet). Full user-wallet LP via PositionManager in a future release.",
  });
});

/** POST /api/liquidity/add - run AddLiquidity forge script via deployer key */
router.post("/liquidity/add", async (req, res): Promise<void> => {
  const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;
  const hookAddr    = process.env.VITE_TOXIC_FLOW_HOOK;
  const rpcUrl      = process.env.SEPOLIA_RPC_URL;

  if (!deployerKey || !hookAddr || !rpcUrl) {
    res.status(400).json({
      error: "Server not configured for liquidity operations",
      missing: [
        !deployerKey && "DEPLOYER_PRIVATE_KEY",
        !hookAddr    && "VITE_TOXIC_FLOW_HOOK",
        !rpcUrl      && "SEPOLIA_RPC_URL",
      ].filter(Boolean),
    });
    return;
  }

  const body = req.body as { ethAmount?: string; usdcAmount?: string };
  const ethFloat  = Math.max(0.001, Math.min(10, parseFloat(body.ethAmount  ?? "0.05")));
  const usdcFloat = Math.max(1,     Math.min(10000, parseFloat(body.usdcAmount ?? "100")));

  // Convert to raw units
  const ethWei  = BigInt(Math.round(ethFloat  * 1e18)).toString();
  const usdcRaw = BigInt(Math.round(usdcFloat * 1e6)).toString();

  const scriptPath = "contracts/script/liquidity/AddLiquidity.s.sol";
  const forgeCmd = [
    `${FOUNDRY_BIN}/forge`,
    "script", scriptPath,
    "--rpc-url", rpcUrl,
    "--private-key", deployerKey,
    "--broadcast",
    "--skip-simulation",
    "-vvv",
  ].join(" ");

  req.log.info({ ethFloat, usdcFloat }, "Starting AddLiquidity forge script");

  try {
    const { stdout, stderr } = await execAsync(forgeCmd, {
      cwd: WORKSPACE,
      timeout: 200_000,
      env: {
        ...process.env,
        VITE_TOXIC_FLOW_HOOK: hookAddr,
        ADD_LIQ_ETH_WEI:     ethWei,
        ADD_LIQ_USDC_RAW:    usdcRaw,
        PATH: `${FOUNDRY_BIN}:${process.env.PATH}`,
      },
    });

    const combined = (stdout + "\n" + stderr).slice(-4000);

    // Try to extract a tx hash from forge's output
    const hashMatch = combined.match(/(?:hash|Hash):\s*(0x[a-fA-F0-9]{64})/);
    const txHash = hashMatch?.[1] ?? null;

    const success = combined.toLowerCase().includes("liquidity added successfully");

    req.log.info({ txHash, success }, "AddLiquidity script completed");

    res.json({
      success,
      txHash,
      ethAmount: ethFloat.toString(),
      usdcAmount: usdcFloat.toString(),
      message: success
        ? `Liquidity added: ${ethFloat} ETH + ${usdcFloat} USDC`
        : "Script ran but success marker not found - check output",
      output: combined,
    });
  } catch (err: unknown) {
    const error = err as { message?: string; stdout?: string; stderr?: string };
    const details = (error.stdout ?? "") + "\n" + (error.stderr ?? "") + "\n" + (error.message ?? "");
    req.log.error({ err }, "AddLiquidity script failed");
    res.status(500).json({
      error: "Liquidity operation failed",
      details: details.slice(-1500),
    });
  }
});

export default router;
