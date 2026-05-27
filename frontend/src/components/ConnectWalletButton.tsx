import { useState } from "react";
import { useWallet } from "../lib/WalletProvider";
import { Wallet, Loader2 } from "lucide-react";

export default function ConnectWalletButton() {
    let wallet;

    // SAFE HOOK ACCESS (prevents full app crash)
    try {
        wallet = useWallet();
    } catch (err) {
        console.error("WalletProvider missing:", err);

        return (
            <button
                disabled
                className="px-5 py-3 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 flex items-center gap-2"
            >
                Wallet Error
            </button>
        );
    }

    const { address, isConnected, connect } = wallet;

    const [loading, setLoading] = useState(false);

    async function handleConnect() {
        try {
            setLoading(true);
            await connect();
        } catch (err) {
            console.error("Wallet connect failed:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleConnect}
            disabled={loading}
            className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/40 transition flex items-center gap-2 disabled:opacity-60"
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    Connecting...
                </>
            ) : isConnected ? (
                <>
                    <Wallet className="w-4 h-4 text-blue-400" />
                    {address
                        ? `${address.slice(0, 6)}...${address.slice(-4)}`
                        : "Connected"}
                </>
            ) : (
                <>
                    <Wallet className="w-4 h-4 text-blue-400" />
                    Connect Wallet
                </>
            )}
        </button>
    );
}