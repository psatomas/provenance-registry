import { createContext, useContext, useEffect, useState } from "react";

import type { WalletState } from "./web3";
import { connectWallet, getWalletState } from "./web3";

type WalletContextType = WalletState & {
    connect: () => Promise<void>;
    refresh: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [wallet, setWallet] = useState<WalletState>({
        address: null,
        chainId: null,
        isConnected: false,
    });

    async function refresh() {
        const state = await getWalletState();
        setWallet(state);
    }

    async function connect() {
        const state = await connectWallet();
        setWallet(state);
    }

    useEffect(() => {
        refresh();

        if (window.ethereum) {
            const handler = () => refresh();

            window.ethereum.on("accountsChanged", handler);
            window.ethereum.on("chainChanged", handler);

            return () => {
                window.ethereum.removeListener("accountsChanged", handler);
                window.ethereum.removeListener("chainChanged", handler);
            };
        }
    }, []);

    return (
        <WalletContext.Provider
            value={{
                ...wallet,
                connect,
                refresh,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const ctx = useContext(WalletContext);

    if (!ctx) {
        throw new Error("useWallet must be used within WalletProvider");
    }

    return ctx;
}