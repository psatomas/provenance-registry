import { ethers } from "ethers";

import artifact from "../../../artifacts/contracts/ProtocolProvenanceRegistry.sol/ProtocolProvenanceRegistry.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

declare global {
    interface Window {
        ethereum?: any;
    }
}

// =========================================================
// PROVIDER
// =========================================================

export async function getProvider() {
    if (!window.ethereum) {
        throw new Error("MetaMask not found");
    }

    return new ethers.BrowserProvider(window.ethereum);
}

// =========================================================
// SIGNER
// =========================================================

export async function getSigner() {
    const provider = await getProvider();
    return await provider.getSigner();
}

// =========================================================
// READ-ONLY CONTRACT
// =========================================================

export async function getContract() {
    const provider = await getProvider();

    return new ethers.Contract(
        CONTRACT_ADDRESS,
        artifact.abi,
        provider
    );
}

// =========================================================
// WRITE CONTRACT (WITH SIGNER)
// =========================================================

export async function getSignerContract() {
    const signer = await getSigner();

    return new ethers.Contract(
        CONTRACT_ADDRESS,
        artifact.abi,
        signer
    );
}

// =========================================================
// PROTOCOL HISTORY
// =========================================================

export async function getProtocolHistory(
    contractAddress: string
) {
    const contract = await getContract();

    return await contract.getProtocolHistory(
        contractAddress
    );
}

// =========================================================
// LATEST RECORD
// =========================================================

export async function getLatestRecord(
    contractAddress: string
) {
    const contract = await getContract();

    return await contract.getLatestRecord(
        contractAddress
    );
}

// =========================================================
// RECORD COUNT
// =========================================================

export async function getRecordCount(
    contractAddress: string
) {
    const contract = await getContract();

    return await contract.getRecordCount(
        contractAddress
    );
}