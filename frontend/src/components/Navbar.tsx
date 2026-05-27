import ConnectWalletButton from "./ConnectWalletButton";
import { Blocks } from "lucide-react";

export default function Navbar() {
    return (
        <header className="w-full px-6 lg:px-20 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-[#050816]/60 sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center">
                    <Blocks className="w-5 h-5 text-white" />
                </div>

                <div>
                    <h1 className="text-lg font-bold">ProofChain</h1>
                    <p className="text-xs text-slate-400">
                        Protocol Provenance Layer
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <ConnectWalletButton />
            </div>
        </header>
    );
}