import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum?: any;
    }
}

export type WalletState = {
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
};

export async function getProvider() {
    if (!window.ethereum) throw new Error("MetaMask not found");
    return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
    const provider = await getProvider();
    return await provider.getSigner();
}

export async function getWalletState(): Promise<WalletState> {
    if (!window.ethereum) {
        return {
            address: null,
            chainId: null,
            isConnected: false,
        };
    }

    const provider = await getProvider();
    const accounts = await provider.send("eth_accounts", []);
    const network = await provider.getNetwork();

    return {
        address: accounts[0] ?? null,
        chainId: Number(network.chainId),
        isConnected: accounts.length > 0,
    };
}

export async function connectWallet(): Promise<WalletState> {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const provider = await getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();

    return {
        address: accounts[0],
        chainId: Number(network.chainId),
        isConnected: true,
    };
}