# 🚀 ProofChain — Deployment Guide

This document describes how to deploy and run ProofChain in both **local development** and **Sepolia testnet production mode**.

---

## 🌐 Prerequisites

Before starting, ensure you have:

- Node.js (>= 18)
- npm
- MetaMask wallet
- Sepolia ETH (for testnet deployment) — get some from a faucet, e.g. https://sepoliafaucet.com/
- RPC provider (Alchemy / Infura / a public Sepolia RPC endpoint)

---

## 📦 Installation

Install all dependencies:

```bash
npm install
```

---

## ⚙️ Environment Setup

Create a `.env` file in the **repository root** (never commit it — it's already
git-ignored). `hardhat.config.ts` reads these exact variable names:

```env
SEPOLIA_RPC_URL=https://your-provider.example/v3/YOUR_KEY
SEPOLIA_PRIVATE_KEY=your_deployer_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

- `SEPOLIA_RPC_URL` and `SEPOLIA_PRIVATE_KEY` are required for any Sepolia
  deployment. `SEPOLIA_RPC_URL` alone (a valid URL, real or a local
  placeholder like `http://127.0.0.1:8545`) is enough for `hardhat compile`
  and `hardhat test`, since `hardhat.config.ts` validates the network config
  eagerly even for tasks that never touch it.
- `ETHERSCAN_API_KEY` is optional — only needed if you want to run
  `hardhat verify` against Etherscan afterward.
- **Never commit this file, paste its contents into an issue/PR, or share
  `SEPOLIA_PRIVATE_KEY` with anyone or anything that doesn't need to sign a
  transaction.**

There is no separate frontend `.env`. The frontend does not read any
`VITE_*` environment variables for the contract address or RPC endpoint —
see "Updating the frontend after deployment" below.

---

## 🧱 Compile Smart Contracts

```bash
npx hardhat compile
```

This generates the ABI and bytecode artifacts under `artifacts/`.

---

## 🧪 Local Development Deployment (Optional)

### Start a local blockchain:

```bash
npx hardhat node
```

Leave this running in its own terminal — `test/ProtocolProvenanceRegistry.ts`
also connects directly to `http://127.0.0.1:8545`, so a local node must
already be listening before running the test suite.

### Deploy locally (in a second terminal), via Hardhat Ignition:

```bash
npx hardhat ignition deploy ignition/modules/ProtocolRegistry.ts --network localhost
```

### Run tests:

```bash
npx hardhat test
```

---

## 🌍 Sepolia Testnet Deployment (Production Mode)

This is the **main deployment target for ProofChain**. The canonical
deployment mechanism is **Hardhat Ignition** — there is no other supported
deploy path. (`scripts/deploy.ts` only *defines* an Ignition module and does
nothing by itself if run directly with `hardhat run`; it exists for
historical/local-experimentation reasons. Use the command below instead.)

### Step 1 — Ensure your deployer wallet has Sepolia ETH

Use a faucet such as https://sepoliafaucet.com/. Whichever address
corresponds to `SEPOLIA_PRIVATE_KEY` needs enough Sepolia ETH to cover gas.

### Step 2 — Deploy the contract

```bash
npx hardhat ignition deploy ignition/modules/ProtocolRegistry.ts --network sepolia
```

`ignition/modules/ProtocolRegistry.ts` takes no constructor arguments — the
contract's constructor takes none. **The deployer address (the account behind
`SEPOLIA_PRIVATE_KEY`) automatically becomes the registry's owner**, because
the constructor sets `owner = msg.sender`. There is no separate
ownership-assignment step; whoever's key signs the deployment transaction is
the owner from that point on, until (and unless) `transferOwnership` is
called.

Ignition records the result under
`ignition/deployments/chain-11155111/` (git-ignored — this is local
deployment bookkeeping, not something to commit). The new address is printed
to the terminal as:

```text
Deployed Addresses

ProtocolRegistryModule#ProtocolProvenanceRegistry - 0x...
```

A manually-triggered GitHub Actions workflow
(`.github/workflows/deploy-sepolia.yml`) runs this same command end-to-end
(compile → test → deploy → verify) using repository secrets instead of a
local `.env`. See that workflow file for details; it never deploys
automatically on push, PR, merge, or tag.

### Step 3 — Verify the deployment worked

At minimum, confirm:

- Bytecode exists at the new address (`eth_getCode` returns more than `0x`).
- `owner()` returns the expected deployer address.
- A **read-only, non-owner `eth_call` simulation** of
  `registerProtocolRecord` reverts with the `NotOwner` custom error (this
  never sends a real transaction, so it needs no private key for the
  simulated caller).

`scripts/verify-deployment.ts` automates exactly these checks against
whatever address Ignition just recorded for the current network:

```bash
npx hardhat run scripts/verify-deployment.ts --network sepolia
```

(To check a specific address instead of relying on Ignition's local record,
set `VERIFY_ADDRESS=0x...` in the environment first.)

### Step 4 — Verify on a block explorer (optional but recommended)

If `ETHERSCAN_API_KEY` is configured:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

This has no constructor arguments to pass. This step is optional — it is not
required for the deployment to be considered valid, and the CI workflow
skips it entirely if no Etherscan API key secret is configured.

---

## 🔗 Updating the frontend after deployment

The frontend does **not** read the contract address from an environment
variable. It's a plain source constant:

```ts
// frontend/src/lib/contract.ts
const CONTRACT_ADDRESS = "0x...";
```

After a new deployment, update that constant to the new address, then
rebuild:

```bash
cd frontend
npm install
npm run build
```

Because the address is compiled into the JS bundle, the frontend **must be
rebuilt** (not just have its source edited) for the new address to actually
take effect — `npm run dev` picks up the change immediately for local
testing, but any deployed/hosted build needs a fresh `npm run build` (and a
redeploy of that build) to serve the updated bundle.

Two other files hold the same address as a plain reference and should be
updated alongside it when it represents the *canonical live deployment*
(don't touch historical mentions elsewhere that aren't meant to track the
live contract):

- `README.md` — the "Live Deployment" / Etherscan-link sections (both
  English and Portuguese).
- `scripts/make-test-pdf.ts` — embeds the address as text in a generated
  sample audit PDF; only needs updating if you want newly generated sample
  PDFs to reference the current live contract. Regenerate with:

  ```bash
  npx hardhat run scripts/make-test-pdf.ts
  ```

---

## 🧾 Deployment Architecture Flow

```text
Hardhat Ignition (ignition/modules/ProtocolRegistry.ts)
   ↓
Solidity Contract Deployment
   ↓
Sepolia Blockchain
   ↓
Contract Address Generated (deployer becomes owner)
   ↓
scripts/verify-deployment.ts (read-only checks)
   ↓
Manually update frontend/src/lib/contract.ts + rebuild
   ↓
React + Ethers.js Integration
```

---

## ⚠️ Common Issues

### 1. "Insufficient funds"
- The deployer wallet does not have Sepolia ETH.

### 2. "Network mismatch"
- MetaMask is not set to the Sepolia network when using the app.

### 3. `HHE15: Invalid config` on any Hardhat command
- `SEPOLIA_RPC_URL` is unset or not a valid URL. Even `compile`/`test`
  require a syntactically valid value (a local placeholder is fine for
  those two).

### 4. Tests hang indefinitely
- `test/ProtocolProvenanceRegistry.ts` connects directly to
  `http://127.0.0.1:8545`. Make sure `npx hardhat node` is running first.

### 5. Frontend still shows the old contract data after updating the address
- The address is compiled into the bundle — re-run `npm run build` (and
  redeploy the built output) rather than only editing the source constant.

---

## 🔐 Security Notes

- Never commit `SEPOLIA_PRIVATE_KEY`, paste it into chat/logs, or expose it
  in the frontend. It is only ever needed by whatever signs the deployment
  transaction (a local `.env` for manual deploys, or the
  `SEPOLIA_PRIVATE_KEY` GitHub Actions secret for the CI workflow).
- Sepolia is a public testnet — no real financial value is at risk, but
  treat the deployer key with the same hygiene as a real one; it becomes the
  registry's sole owner.
- The GitHub Actions deployment workflow never prints `SEPOLIA_RPC_URL`,
  `SEPOLIA_PRIVATE_KEY`, or `ETHERSCAN_API_KEY`, and only runs on an
  explicit, manually-typed confirmation — never on push, PR, merge, or tag.

---

## 🏁 Final Result After Deployment

Once deployed and verified, ProofChain provides:

- A new, immutable smart contract on Sepolia, owned by the deploying wallet.
- Publicly verifiable transaction history.
- A frontend that, once rebuilt against the new address, is a fully
  functional end-to-end provenance tracking system again.

---

## 🚀 Summary

Deployment transforms ProofChain from a local dApp into a publicly
verifiable blockchain system on Ethereum Sepolia — via Hardhat Ignition,
either run locally or through the manual GitHub Actions workflow, always
followed by a read-only verification pass and a deliberate, separate update
of the frontend's contract address.

---
