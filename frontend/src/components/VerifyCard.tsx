import { motion } from "framer-motion";
import {
    Search,
    ShieldCheck,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export default function VerifyCard() {
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    async function handleVerify() {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setVerified(true);
        }, 2000);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
        >
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />

            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Search className="text-blue-400" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold">
                            Verify Protocol
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Query immutable provenance records
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">
                            Contract Address
                        </label>

                        <input
                            placeholder="0x..."
                            className="w-full bg-[#0B1120]/80 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-blue-500/50 transition"
                        />
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 py-4 font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] transition"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-5 h-5" />
                                Verify Provenance
                            </>
                        )}
                    </button>

                    {verified && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5"
                        >
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-400 mt-1" />

                                <div>
                                    <p className="font-semibold text-emerald-300">
                                        Verified Protocol
                                    </p>

                                    <p className="text-sm text-slate-300 mt-1">
                                        Provenance history validated successfully.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}