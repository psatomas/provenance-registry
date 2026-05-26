import { ethers } from "ethers";
import { readFileSync } from "fs";
import path from "path";

// =========================================================
// CONTRACT ADDRESS (local / sepolia depois você troca)
// =========================================================

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// =========================================================
// LOAD ABI SAFELY (NO ESM JSON IMPORT ISSUES)
// =========================================================

const artifactPath = path.join(
    process.cwd(),
    "artifacts/contracts/ProtocolProvenanceRegistry.sol/ProtocolProvenanceRegistry.json"
);

const artifact = JSON.parse(
    readFileSync(artifactPath, "utf-8")
);

// =========================================================
// CONTRACT FACTORY
// =========================================================

export function getContract(signerOrProvider: any) {
    return new ethers.Contract(
        CONTRACT_ADDRESS,
        artifact.abi,
        signerOrProvider
    );
}