import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum?: any;
    }
}

// =========================================================
// NETWORK CONFIG
// =========================================================

export const SUPPORTED_CHAIN_ID = 11155111;

export const SEPOLIA_CONFIG = {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    nativeCurrency: {
        name: "Sepolia ETH",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: [
        "https://ethereum-sepolia-rpc.publicnode.com"
    ],
    blockExplorerUrls: [
        "https://eth-sepolia.blockscout.com"
    ],
};

// =========================================================
// TYPES
// =========================================================

export type WalletState = {
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
};

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
// WALLET STATE
// =========================================================

export async function getWalletState(): Promise<WalletState> {

    if (!window.ethereum) {
        return {
            address: null,
            chainId: null,
            isConnected: false,
        };
    }

    const provider = await getProvider();

    const accounts = await provider.send(
        "eth_accounts",
        []
    );

    const network = await provider.getNetwork();

    return {
        address: accounts[0] ?? null,
        chainId: Number(network.chainId),
        isConnected: accounts.length > 0,
    };
}

// =========================================================
// CONNECT WALLET
// =========================================================

export async function connectWallet(): Promise<WalletState> {

    if (!window.ethereum) {
        throw new Error("MetaMask not found");
    }

    const provider = await getProvider();

    const accounts = await provider.send(
        "eth_requestAccounts",
        []
    );

    const network = await provider.getNetwork();

    return {
        address: accounts[0],
        chainId: Number(network.chainId),
        isConnected: true,
    };
}