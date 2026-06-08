# 📌 ProofChain

## 🌐 Languages

- 🇺🇸 [English Version](#-english-version)
- 🇧🇷 [Versão Português](#-versão-português)

---

# 🇺🇸 English Version

## 📌 ProofChain

Blockchain Protocol Provenance & Audit Verification System

ProofChain is a full-stack Web3 application that provides immutable protocol provenance tracking, enabling transparent registration, historical auditing, and cryptographic verification of smart contract evolution using blockchain.

Built for the HackWeb RESTIC 29 Hackathon.

---

## 🚀 Overview

ProofChain enables:
- On-chain protocol registration
- Versioned audit history tracking
- PDF cryptographic verification
- Immutable provenance exploration
- MetaMask interaction
- Sepolia testnet validation

---

## 🧱 Architecture

User → React (Vite + TS) → Ethers.js → Smart Contract → Blockchain State

Principles:
- No backend trust assumptions
- Hash-based verification (PDF → Keccak256)
- On-chain source of truth
- Modular Web3 architecture

---

## ⚙️ Smart Contract Layer

ProtocolProvenanceRegistry.sol:
- Protocol registration
- Version tracking
- Auditor attribution
- Audit + commit hash storage
- Timestamped records
- onlyOwner protection
- Event emission

Read methods:
- getProtocolHistory(address)
- getLatestRecord(address)
- getRecordCount(address)

---

## 🌐 Frontend

Stack:
React + TypeScript + Vite + TailwindCSS + Framer Motion + Ethers v6

Pages:
Home → Register → Explorer → Verify → Audit Summary (optional)

---

## 🔗 Web3 Layer

Modules:
- contract.ts
- web3.ts
- WalletProvider.tsx
- hashPdf.ts
- checkNetwork.ts

Flow:
MetaMask → Sign → Transaction → Blockchain → UI

---

## 🧾 Core Flows

Register:
User → Wallet → Metadata → Transaction → On-chain storage

Explorer:
User → Contract → History → Timeline UI

Verify:
PDF → Hash → Compare → VALID / INVALID

---

## 🧪 Development

npm install
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
npx hardhat test
cd frontend && npm run dev

---

## 🌍 Deployment

Sepolia Testnet:
- Smart contract deployed on Ethereum Sepolia
- MetaMask integration enabled
- Verified on explorers

---

## 🔐 Features

- Immutable audit registry
- Versioned provenance tracking
- PDF cryptographic verification
- Full Web3 wallet integration
- Real-time blockchain queries
- End-to-end decentralized system

---

## 🧠 AI Layer (Optional)

- Audit summarization
- Risk classification
- Insight extraction

AI runs off-chain only.

---

## 🏁 Status

All core systems complete:
Smart Contract • Frontend • Web3 • Testing • Deployment • Verification

---

## 🚀 Next Steps

Improve explorer UI
Add explorer links (Etherscan)
Enhance verify UX
Expand AI layer
Production polish

---

## 👥 Team

Add team members here

---

## 📄 License

MIT

---

# 🇧🇷 Versão Português

## 📌 ProofChain

Sistema de Protocolo de Proveniência e Verificação de Auditoria em Blockchain

ProofChain é uma aplicação Web3 full-stack que fornece rastreamento imutável de protocolos, permitindo registro transparente, auditoria histórica e verificação criptográfica da evolução de contratos inteligentes.

Construído para o Hackathon HackWeb RESTIC 29.

---

## 🚀 Visão Geral

O ProofChain permite:
- Registro de protocolos na blockchain
- Histórico versionado de auditoria
- Verificação de PDFs via hash criptográfico
- Exploração de histórico imutável
- Integração com MetaMask
- Validação na rede Sepolia

---

## 🧱 Arquitetura

Usuário → React → Ethers.js → Smart Contract → Blockchain

Princípios:
- Sem backend centralizado
- Verificação por hash
- Blockchain como fonte de verdade
- Arquitetura modular

---

## ⚙️ Smart Contract

ProtocolProvenanceRegistry.sol:
- Registro de protocolos
- Controle de versões
- Auditoria associada
- Hash de auditoria e commit
- Timestamp dos registros
- Proteção onlyOwner
- Eventos para indexação

---

## 🌐 Frontend

React + TypeScript + Vite + TailwindCSS + Framer Motion + Ethers v6

Páginas:
Home, Register, Explorer, Verify, Audit Summary (opcional)

---

## 🔗 Web3

- contract.ts
- web3.ts
- WalletProvider.tsx
- hashPdf.ts
- checkNetwork.ts

Fluxo:
MetaMask → Assinatura → Blockchain → UI

---

## 🧾 Fluxos

Registro:
Usuário → Carteira → Dados → Blockchain

Explorer:
Usuário → Contrato → Histórico

Verify:
PDF → Hash → Validação

---

## 🧪 Desenvolvimento

npm install
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts
npx hardhat test
cd frontend && npm run dev

---

## 🌍 Deploy

Sepolia Testnet com MetaMask e verificação em explorer

---

## 🔐 Funcionalidades

- Registro imutável
- Histórico versionado
- Verificação de PDF
- Integração Web3 completa
- Consulta on-chain

---

## 🧠 IA (Opcional)

Resumo de auditoria, risco e insights (off-chain)

---

## 🏁 Status

Sistema completo: Smart Contract • Frontend • Web3 • Deploy • Verify

---

## 🚀 Próximos passos

Melhorar Explorer
Adicionar links de explorer
Aprimorar UX do Verify
Expandir IA
Polimento final

---

## 👥 Time

Adicionar integrantes

---

## 📄 Licença

MIT
```

---

Se quiser elevar ainda mais (nível “projeto vencedor de hackathon”), o próximo upgrade seria:

- adicionar **badges clicáveis no topo (Sepolia, Solidity, React, Hardhat)**
- adicionar **links reais do contrato na Sepolia**
- adicionar **GIF demo inline**
- adicionar **diagrama SVG da arquitetura**

Só me fala.