# 🧠 ProofChain — System Architecture

This document describes the full architecture of ProofChain, including smart contract design, frontend interaction flow, and blockchain integration.

---

## 🌐 High-Level Architecture

```mermaid
flowchart TD

A[User] --> B[React Frontend - Vite + TS]
B --> C[Ethers.js Web3 Layer]
C --> D[MetaMask Wallet]
D --> E[Sepolia Smart Contract]

E --> F[ProtocolProvenanceRegistry.sol]
F --> G[(Ethereum Blockchain State)]

E --> C
C --> B
B --> A
```

---

## 🧱 System Components

### 1. Frontend Layer (Off-chain UI)

Built with:
- React
- TypeScript
- Vite
- TailwindCSS

Responsibilities:
- User interaction
- Wallet connection (MetaMask)
- Transaction signing requests
- Displaying blockchain data

Modules:
- `Register.tsx`
- `Explorer.tsx`
- `Verify.tsx`
- `Home.tsx`

---

### 2. Web3 Integration Layer

Located in:
```
frontend/src/lib/
```

Core modules:
- `contract.ts` → smart contract abstraction
- `web3.ts` → provider + signer setup
- `WalletProvider.tsx` → global wallet state
- `hashPdf.ts` → cryptographic hashing
- `checkNetwork.ts` → network validation

Responsibilities:
- Bridge UI ↔ blockchain
- Manage wallet state
- Format transactions

---

### 3. Smart Contract Layer (On-chain)

Contract:
```
ProtocolProvenanceRegistry.sol
```

Deployed on:
- Ethereum Sepolia Testnet

Responsibilities:
- Store protocol provenance records
- Enforce access control (`onlyOwner`)
- Maintain version history
- Emit events for indexing

---

### 4. Blockchain Layer

Network:
- Ethereum Sepolia

Responsibilities:
- Immutable storage
- Consensus validation
- Transaction finality
- Public verifiability

---

## 🔁 Core Data Flow

### Register Flow

```mermaid
sequenceDiagram
participant U as User
participant F as Frontend
participant W as Wallet (MetaMask)
participant C as Smart Contract
participant B as Blockchain

U->>F: Fill protocol data
F->>W: Request signature
W->>C: Send transaction
C->>B: Store record
B-->>F: Transaction confirmed
F-->>U: Success UI update
```

---

### Verify Flow

```mermaid
sequenceDiagram
participant U as User
participant F as Frontend
participant C as Smart Contract

U->>F: Upload PDF
F->>F: Generate hash (keccak256)
F->>C: Fetch latest audit hash
C-->>F: Return stored hash
F->>F: Compare hashes
F-->>U: VALID / INVALID result
```

---

### Explorer Flow

```mermaid
sequenceDiagram
participant U as User
participant F as Frontend
participant C as Smart Contract

U->>F: Query protocol address
F->>C: getProtocolHistory()
C-->>F: Return records array
F-->>U: Render timeline UI
```

---

## 🔐 Trust Model

ProofChain minimizes trust everywhere except one deliberate point: who is
allowed to register a new record.

| Layer | Trust Requirement |
|------|------------------|
| Frontend | Untrusted |
| Wallet | User-controlled |
| Smart Contract logic | Deterministic, publicly verifiable, cannot be altered after deployment |
| Registration authority | **Owner-curated** — only the contract owner can call `registerProtocolRecord` (not trustless) |
| Blockchain | Canonical truth for whatever has been registered |

---

## 🧾 Data Integrity Model

Each record includes:

- Protocol name
- Version number
- Auditor identity
- Audit hash (PDF integrity)
- Commit hash (code reference)
- Timestamp

### Guarantee:
> If data exists on-chain, it is immutable and verifiable.

---

## 🧠 Design Principles

- ⛓️ Blockchain as source of truth
- 🔒 Minimal trust assumptions outside of registration (reads, integrity
  verification, and immutability are trustless; writing a record is
  owner-curated, not permissionless)
- 🧾 Cryptographic verification (hash-based)
- 📦 Append-only data structure
- 🔍 Full transparency via public chain

---

## 🚀 Deployment Context

- Network: Sepolia Testnet
- Framework: Hardhat + Ignition
- Frontend: React + Vite
- Web3: Ethers.js v6
- Wallet: MetaMask

---

## 🏁 Summary

ProofChain is structured as an **owner-curated provenance system with
decentralized verification**, where:

- UI is only an interface
- Wallet handles identity
- Smart contract enforces rules, including owner-gated registration
- Blockchain guarantees truth for whatever has been registered, and lets
  anyone verify it independently

---