import { motion } from "framer-motion";
import {
    Search,
    ShieldCheck,
    Loader2,
    CheckCircle2,
    XCircle,
    Upload,
} from "lucide-react";

type VerifyCardProps = {
    contractAddress: string;
    setContractAddress: (v: string) => void;

    file: File | null;
    setFile: (f: File | null) => void;

    loading: boolean;
    error: string;
    result: any;

    onVerify: () => void | Promise<void>;
};

export default function VerifyCard({
    contractAddress,
    setContractAddress,
    file,
    setFile,
    loading,
    error,
    result,
    onVerify,
}: VerifyCardProps) {
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
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Search className="text-blue-400" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold">
                            Verify Audit
                        </h3>

                        <p className="text-slate-400 text-sm">
                            Validate audit integrity against immutable on-chain records
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* CONTRACT */}
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">
                            Contract Address
                        </label>

                        <input
                            value={contractAddress}
                            onChange={(e) =>
                                setContractAddress(e.target.value)
                            }
                            placeholder="0x..."
                            className="w-full bg-[#0B1120]/80 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-blue-500/50 transition"
                        />
                    </div>

                    {/* FILE UPLOAD */}
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">
                            Audit PDF
                        </label>

                        <label className="flex items-center justify-center gap-3 border border-dashed border-white/10 rounded-2xl p-5 bg-[#0B1120]/80 cursor-pointer hover:border-blue-500/40 transition">
                            <Upload className="w-5 h-5 text-blue-400" />

                            <span className="text-slate-300">
                                {file ? file.name : "Upload audit report"}
                            </span>

                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] ?? null)
                                }
                            />
                        </label>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={onVerify}
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
                                Verify Audit
                            </>
                        )}
                    </button>

                    {/* ERROR */}
                    {error && (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {/* RESULT */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-2xl p-5 border ${
                                result.valid
                                    ? "border-emerald-500/20 bg-emerald-500/10"
                                    : "border-red-500/20 bg-red-500/10"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {result.valid ? (
                                    <CheckCircle2 className="text-emerald-400 mt-1" />
                                ) : (
                                    <XCircle className="text-red-400 mt-1" />
                                )}

                                <div>
                                    <p
                                        className={`font-semibold ${
                                            result.valid
                                                ? "text-emerald-300"
                                                : "text-red-300"
                                        }`}
                                    >
                                        {result.valid
                                            ? "Verified Audit Report"
                                            : "Audit Report Mismatch"}
                                    </p>

                                    <p className="text-sm text-slate-300 mt-1">
                                        {result.valid
                                            ? "The uploaded PDF matches the audit hash stored on-chain."
                                            : "The uploaded PDF does not match the registered provenance record."}
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