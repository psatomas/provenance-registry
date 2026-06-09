import { ethers } from "ethers";
import artifact from "../abi/ProtocolProvenanceRegistry.json";

const CONTRACT_ADDRESS = "0x8166431404B7f8e5e9d351333e08548a23Bbdae0";

// Extract ABI safely
const abi = artifact.abi;

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
        abi,
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
        abi,
        signer
    );
}

// =========================================================
// PROTOCOL HISTORY
// =========================================================

export async function getProtocolHistory(contractAddress: string) {
    const contract = await getContract();

    return await contract.getProtocolHistory(contractAddress);
}

// =========================================================
// LATEST RECORD
// =========================================================

export async function getLatestRecord(contractAddress: string) {
    const contract = await getContract();

    return await contract.getLatestRecord(contractAddress);
}

// =========================================================
// RECORD COUNT
// =========================================================

export async function getRecordCount(contractAddress: string) {
    const contract = await getContract();

    return await contract.getRecordCount(contractAddress);
}