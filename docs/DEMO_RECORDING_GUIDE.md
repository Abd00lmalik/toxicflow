# ToxicFlow Passport — Demo Recording Guide

A concise guide for recording a compelling demo of ToxicFlow Passport on Sepolia testnet.

---

## Pre-Recording Setup

### Browser
- Use **Chrome** or **Brave** with a clean profile
- Install **MetaMask** or **Rabby** as your wallet
- Close unrelated tabs and disable browser extensions that show overlays
- Set browser zoom to **100%**

### Network
- Switch MetaMask/Rabby to **Sepolia testnet** (chainId 11155111)
- Make sure your wallet has **Sepolia ETH** — get free ETH from [sepoliafaucet.com](https://sepoliafaucet.com)
- Confirm the ToxicFlow pool has liquidity (check `/pool-defense` — if Toxic Share shows 0 events, add liquidity first)

### App
- Open `https://t0xicflow.vercel.app` or your local `http://localhost:3000`
- If recording locally, confirm `BASE_PATH=/` and `PORT` are set
- If you want live KeeperHub automation shown, confirm `KEEPERHUB_API_URL`, `KEEPERHUB_API_KEY`, `KEEPERHUB_WORKFLOW_ID` are set

### Screen
- Set resolution to **1440×900** or higher for a clean recording
- Hide bookmarks bar for a cleaner look (`Ctrl+Shift+B` / `Cmd+Shift+B`)

---

## Recommended Recording Tools

| Tool | Platform | Notes |
|---|---|---|
| **OBS Studio** | Win / Mac / Linux | Free, professional quality, RTMP streaming |
| **Screen Studio** | Mac | Best-in-class cursor animations, great for product demos |
| **Loom** | Browser / Desktop | Easy sharing link, good for async demos |
| **Windows Recorder** | Win | `Win + G`, quick and built-in |

**Recommended**: OBS (full control) or Screen Studio (polished look).

---

## Recommended Demo Route (8–10 min)

### 1. Landing Page
- Show the hero section
- Read the one-liner aloud:

> "ToxicFlow gives wallets a trading passport that changes the fee they pay in a Uniswap v4 pool."

- Briefly show the fee tier breakdown card

### 2. Connect Wallet
- Click **Connect** in the top-right nav
- Show the centered wallet modal with distinct wallet logos
- Connect with MetaMask or Rabby on Sepolia

### 3. Passport Page
- Navigate to `/passport`
- Show your connected wallet's current tier (Neutral / Trusted / Toxic)
- If your wallet has no passport, click **Claim Passport**
- Explain: "Wallets that prove their trading history earn a Trusted tier and pay lower fees"

### 4. Demo Page
- Navigate to `/demo`
- Switch tier to **Neutral** — show the 30 bps fee
- Switch to **Trusted** — show the fee drop to 10 bps
- Switch to **Toxic** — show the fee spike to 80 bps
- Explain: "The hook reads this tier on every swap, in real time"

### 5. Swap Page
- Navigate to `/swap`
- Show the ETH → USDC swap panel and the displayed fee tier
- Explain: "This is the ToxicFlow ETH/USDC pool on Sepolia — a dedicated pool initialized with the hook from day one"

### 6. Records Page
- Navigate to `/records`
- Show stored fee records from recent swaps
- Explain: "Every swap emits a `SwapFeeApplied` event on-chain. Records are verified and stored via 0G decentralized storage"

### 7. Pool Defense
- Navigate to `/pool-defense`
- Show the Flow Monitor metrics
- Show the Risk Gauge (threshold line)
- Explain:

> "Pool Defense watches the recent swap composition. If toxic flow concentration exceeds the threshold — currently 30% — KeeperHub triggers an automated defense response."

- Show the **Test Trigger** button and click it
- Show the KeeperHub payload with `action: PAUSE_SWAPS`

### 8. Developers Page
- Navigate to `/developers`
- Show the Quick Integration section
- Explain: "Any DEX or AMM can integrate ToxicFlow in three steps: deploy a pool with the hook, and the hook reads tier on every swap automatically"
- Show the API Resolver endpoint
- Show the Fee Class Mapping table

---

## Demo Voiceover Script

```
[Landing]
"ToxicFlow Passport is a trust-aware fee system for Uniswap v4.
 Every wallet earns a trading passport — Trusted, Neutral, or Toxic.
 The pool hook reads that passport on every swap and charges the right fee automatically."

[Connect Wallet]
"I'll connect my wallet on Sepolia testnet."

[Passport]
"My wallet is currently Neutral — I pay the standard 30 basis-point fee."

[Demo]
"In the demo mode, I can preview how my fee changes.
 Trusted: 10 bps. That's a 67% discount. Toxic: 80 bps — eight times more than Trusted."

[Swap]
"This is the live ToxicFlow ETH/USDC pool. When I swap, the hook reads my tier in the same transaction."

[Records]
"Every swap is logged on-chain and archived via 0G decentralized storage — 
 creating an immutable audit trail of fee decisions."

[Pool Defense]
"Pool Defense monitors toxic flow concentration in real time.
 When it crosses the threshold, KeeperHub triggers an automated protective response — 
 or can pause swaps entirely using the circuit breaker on ToxicFlowHookV2."

[Developers]
"Integrating ToxicFlow takes one function call.
 Any AMM can query wallet tier on-chain or via the REST resolver, 
 then let the hook handle fee enforcement automatically."
```

---

## What NOT to Show

- Private keys or seed phrases
- `.env.local` or any file containing API keys
- Raw backend error logs (unless the error is expected and you explain it)
- Unfinished or broken test pages
- KeeperHub API key or workflow credentials

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Wallet not connecting | Check you're on Sepolia. Try refreshing. Try MetaMask if Rabby fails. |
| Wrong network warning | Switch MetaMask/Rabby to Sepolia (chainId 11155111) |
| Swap fails with "insufficient liquidity" | Add liquidity via `PoolModifyLiquidityTest` — see `docs/LIQUIDITY.md` |
| Records page empty | No swaps have been recorded yet — do a swap on the Demo page first |
| Pool Defense shows "Not configured" | `KEEPERHUB_API_URL` / `KEEPERHUB_API_KEY` env vars not set |
| 0G storage errors | `ZG_SIGNER_PRIVATE_KEY` not set or 0G node unreachable |
| Circuit breaker button grayed | Current deployed hook is V1 — deploy ToxicFlowHookV2 to enable on-chain pause |
| Demo tier changes don't affect Swap fee | Swap page reads on-chain tier — demo tier is frontend-only simulation |
