# 🧱 ProofChain — Smart Contract Specification

This document describes the architecture, logic, and behavior of the core smart contract used in ProofChain:

> `ProtocolProvenanceRegistry.sol`

The contract is responsible for maintaining an **immutable, versioned registry of protocol audit provenance records on-chain**.

---

## 📌 Contract Overview

The contract acts as a **decentralized registry of protocol evolution**, enabling:

- Protocol registration
- Version tracking
- Audit integrity verification
- Historical provenance retrieval
- Ownership-controlled updates

It is deployed on **Ethereum Sepolia testnet**.

---

## 🧱 Core Design Philosophy

The contract is designed under the following principles:

- ⛓️ Immutability of historical records
- 🔐 Restricted write access (owner-only)
- 🧾 Cryptographic integrity via hashes
- 📦 Append-only data structure
- 🔍 Public read access for transparency

---

## 📦 Data Model

Each protocol entry is stored as a structured record:

```solidity
struct ProtocolRecord {
    string protocolName;
    address contractAddress;
    string version;
    bytes32 auditHash;
    bytes32 commitHash;
    string auditor;
    uint256 timestamp;
}
```

---

## 🗂️ Storage Layout

Records are organized by contract address:

```solidity
mapping(address => ProtocolRecord[]) private records;
```

### Behavior:
- Each address has its own history
- Records are appended (never overwritten)
- Full version history is preserved

---

## 🔐 Access Control

### Authorization Model

ProtocolProvenanceRegistry is an **owner-curated registry**, not a self-attestation
system: a single authorized owner account registers provenance records on behalf of
protocols, identified by their `contractAddress`. The protocol represented by
`contractAddress` is not required to sign or originate the transaction itself — the
owner is the sole trust anchor for what gets written. This is a deliberate MVP trust
model (see `docs/security.md`), not an oversight.

Only the contract owner can register new protocol records:

```solidity
modifier onlyOwner() {
    if (msg.sender != owner) {
        revert NotOwner();
    }
    _;
}
```

`registerProtocolRecord` is restricted with `onlyOwner`. `transferOwnership` (also
`onlyOwner`) lets the current owner hand control to a new address.

### Purpose:
- Prevent unauthorized protocol registration
- Ensure data integrity at write-time

---

## 🧾 Core Functions

---

### 1. `registerProtocolRecord(...)`

Registers a new protocol provenance record.

#### Parameters:
- `protocolName` (`string`)
- `contractAddress` (`address`)
- `version` (`string`)
- `auditHash` (`bytes32`)
- `commitHash` (`bytes32`)
- `auditor` (`string`)

#### Behavior:
- Validates every field is non-empty / non-zero (reverts with `InvalidProtocolName`,
  `InvalidContractAddress`, `InvalidVersion`, `InvalidAuditHash`, `InvalidCommitHash`,
  or `InvalidAuditor` otherwise)
- Creates a new `ProtocolRecord` and appends it to `records[contractAddress]`
- Emits `ProtocolRegistered` for off-chain indexing

#### Security:
- Restricted via `onlyOwner` (reverts with `NotOwner` otherwise)

---

### 2. `getProtocolHistory(address)`

Returns full provenance history for a protocol.

#### Output:
- Array of `ProtocolRecord` (empty array if none exist)

#### Purpose:
- Enables full audit trail reconstruction
- Used by Explorer UI and by Verify UI to check historical (non-latest) records

---

### 3. `getLatestRecord(address)`

Returns the most recent protocol version.

#### Behavior:
- Reverts with `NoRecordsFound` if no record exists for `contractAddress`

#### Purpose:
- Quick access to current state
- Used in dashboard UI

---

### 4. `getRecordCount(address)`

Returns number of stored versions.

#### Purpose:
- Version tracking
- UI metadata display

---

### 5. `transferOwnership(address newOwner)`

Transfers registry ownership to a new address.

#### Behavior:
- Restricted via `onlyOwner` (reverts with `NotOwner` otherwise)
- Reverts with `"Invalid owner"` if `newOwner` is the zero address
- Emits `OwnershipTransferred`

---

## 📡 Events

### `ProtocolRegistered`

Emitted when a new protocol record is created:

```solidity
event ProtocolRegistered(
    address indexed contractAddress,
    bytes32 indexed auditHash,
    bytes32 indexed commitHash,
    string protocolName,
    string version,
    string auditor,
    uint256 timestamp
);
```

### `OwnershipTransferred`

Emitted on deployment (`previousOwner` = zero address) and whenever
`transferOwnership` succeeds:

```solidity
event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
);
```

### Purpose:
- Enables off-chain indexing
- Supports explorer functionality
- Improves transparency

---

## ⚠️ Errors

All validation and access-control failures use custom errors (gas-efficient, no
string reverts) except `transferOwnership`'s zero-address check, which keeps a plain
`require` string:

| Error | Raised when |
|---|---|
| `NotOwner()` | Caller of `registerProtocolRecord` or `transferOwnership` is not `owner` |
| `InvalidProtocolName()` | `protocolName` is empty |
| `InvalidContractAddress()` | `contractAddress` is the zero address |
| `InvalidVersion()` | `version` is empty |
| `InvalidAuditHash()` | `auditHash` is `bytes32(0)` |
| `InvalidCommitHash()` | `commitHash` is `bytes32(0)` |
| `InvalidAuditor()` | `auditor` is empty |
| `NoRecordsFound()` | `getLatestRecord` is called for an address with no records |

---

## 🔒 Security Model

The contract enforces:

### 1. Write Protection
Only owner can mutate state

### 2. Append-only Storage
No updates or deletions allowed

### 3. Deterministic State
Same inputs always produce same stored result

### 4. On-chain Integrity
All records are permanently stored in Ethereum state

---

## 🧠 Cryptographic Guarantees

### Audit Hash
- Represents hashed PDF or audit document
- Ensures document integrity

### Commit Hash
- Represents code version reference
- Links protocol version to repository state

Together they ensure:

> “What was audited is exactly what was deployed”

---

## 🌐 Deployment Context

- Network: Ethereum Sepolia
- Deployment tool: Hardhat Ignition / scripts
- Interaction: Ethers.js v6
- Wallet: MetaMask / deployer key

---

## 🧾 State Behavior Summary

```text
Register → Append record → Emit event → Persist on-chain

Read → Query mapping → Return historical dataset
```

No deletion, no modification, no rollback.

---

## ⚠️ Limitations

- No pagination for `getProtocolHistory` / `records[addr]` (future improvement).
  Growth is bounded by the owner's willingness to register records — since writes
  are `onlyOwner`, this is a cost/UX concern (a very long history becomes gas-heavy
  to read in one call) rather than a public spam/DoS vector.
- Owner centralized write control (intentional for MVP trust model — see
  Authorization Model above)
- No upgradeability pattern (immutable deployment)

---

## 🚀 Summary

The `ProtocolProvenanceRegistry` contract serves as the **trust anchor of ProofChain**, providing:

- Immutable audit trail
- Version-controlled protocol history
- Cryptographic verification of integrity
- Transparent public read access

It is the foundation that guarantees the reliability of the entire system.

---