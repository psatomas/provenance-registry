import { Globe, ShieldCheck, Blocks } from "lucide-react";

export default function Footer() {
    return (
        <footer className="px-6 lg:px-20 py-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center">
                            <Blocks className="text-white w-5 h-5" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold">
                                ProofChain
                            </h3>

                            <p className="text-sm text-slate-400">
                                Protocol Provenance Infrastructure
                            </p>
                        </div>
                    </div>

                    <p className="text-slate-500 text-sm max-w-md">
                        Immutable provenance and transparent protocol history
                        for the decentralized future.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <a
                        href="#"
                        className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:border-blue-500/40 transition"
                    >
                        <Globe className="w-5 h-5 text-slate-300" />
                    </a>

                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />

                        <span className="text-sm text-emerald-300">
                            Smart Contract Verified
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}