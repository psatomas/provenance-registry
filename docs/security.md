# 🔐 ProofChain — Security Model

This document defines the security assumptions, threat model, and integrity guarantees of the ProofChain system.

ProofChain is an **owner-curated, blockchain-based protocol provenance system**.
Once a record is written, its integrity and history are enforced trustlessly
through smart contract logic and cryptographic verification — nobody, including
the registry owner, can alter or fake it afterward, and anyone can independently
verify it. Writing a *new* record, however, is not trustless: it is restricted to
a single authorized owner account (see "Authorization model" below), not
self-attested by protocols or open to arbitrary callers.

---

## 🧭 Security Philosophy

ProofChain follows a **minimal trust architecture for everything except
registration**:

- No centralized backend exists
- Blockchain is the source of truth for whatever has been registered
- Registration (writes) is restricted to the registry owner — this is the one
  deliberately centralized trust assumption in the system
- Clients are untrusted execution environments
- Verification is deterministic and cryptographic

---

## 🧱 Threat Model Overview

We consider the following potential threats:

### 1. Unauthorized Data Injection
An attacker attempts to register invalid or fake protocol data.

### Mitigation:
- Smart contract uses `onlyOwner` modifier
- Only authorized wallet can write state

### Authorization model:
ProofChain is an **owner-curated registry**, not a self-attestation system. A single
authorized owner account registers provenance records on behalf of protocols; the
`contractAddress` a record refers to is not required to sign or originate the
transaction itself. Anyone can *read* history for any address, but only the owner
can *write*. This is an intentional MVP trust model — a curated registry — not a
placeholder for a future signature or role-based scheme.

---

### 2. Data Tampering
Attempting to modify historical audit records.

### Mitigation:
- Blockchain immutability guarantees data cannot be altered after inclusion
- Historical state is permanently stored in Ethereum ledger

---

### 3. Fake Audit Documents

An attacker submits a modified PDF pretending to match a valid audit.

### Mitigation:
- Audit verification uses cryptographic hashing (keccak256-style)
- Only hash is stored on-chain
- File content must match hash exactly to be valid

---

### 4. Replay Attacks
Re-submitting old transactions to overwrite or confuse state.

### Mitigation:
- Versioned protocol records
- Each entry includes timestamp and version identifier
- Blockchain nonce system prevents replay duplication

---

### 5. Frontend Manipulation
User modifies UI to display false verification results.

### Mitigation:
- UI is not trusted source of truth
- All validation results come directly from smart contract comparison

---

### 6. RPC / Provider Tampering
Malicious RPC node attempts to alter returned data.

### Mitigation:
- Data is validated against multiple sources (MetaMask + Sepolia consensus)
- Final truth comes from blockchain state, not RPC UI layer

---

## 🔐 Smart Contract Security Model

### Access Control

Only authorized owner can write data:

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}
```

This prevents:
- unauthorized protocol registration
- malicious state injection

---

### Data Integrity

Each record contains:

- `auditHash` (PDF integrity hash)
- `commitHash` (code version reference)
- `timestamp`
- `version`

Ensures:
- traceability
- audit consistency
- reproducibility of protocol history

---

### Immutability Guarantee

Once data is written:
- It cannot be modified
- It can only be appended
- Historical state remains preserved on-chain

---

## 🧾 Verification Security Model

ProofChain uses **client-side cryptographic verification**:

```text
PDF File → Hash Generation → On-chain Comparison → Result
```

### Security property:
If hashes match:
> Document is identical to original registered version

If not:
> Document has been modified or is invalid

---

## 🌐 Network Security Assumptions

ProofChain runs on **Ethereum Sepolia testnet**:

- Uses Proof-of-Stake consensus
- Publicly verifiable state
- Resistant to single-node manipulation
- Transactions require gas fees (prevents spam attacks)

---

## 🔑 Key Management

### Private Keys
- Stored ONLY in `.env`
- Never exposed to frontend
- Used only for deployment scripts

### Wallet Security
- MetaMask handles signing operations
- User always approves transactions manually

---

## ⚠️ Limitations

### 1. Testnet Environment
Sepolia is not production-grade secure for financial use.

### 2. Client-side Hashing
If frontend is compromised, hash generation could be manipulated (mitigated by user verification step).

### 3. RPC Trust Boundary
RPC providers are assumed to be honest but not authoritative.

### 4. Unbounded Per-Address History
`getProtocolHistory` / `records[addr]` has no pagination. Because writes are
`onlyOwner`, this is not a public spam/DoS vector — only the owner can grow an
address's history — but a very long history is still gas-heavy to read back in one
call. Accepted as a known limitation for the current scale; would need pagination
before supporting protocols with very large version histories.

---

## 🧠 Security Summary

ProofChain security is based on:

- 🔒 Smart contract access control
- ⛓️ Blockchain immutability
- 🔑 Cryptographic hashing
- 🧾 Deterministic verification logic
- 👤 User-controlled wallet signing

---

## 🚀 Final Statement

ProofChain does not rely on trusted intermediaries. Instead, it enforces integrity through cryptographic proofs and decentralized consensus, ensuring that protocol provenance is **publicly verifiable, tamper-resistant, and audit-ready**.

---