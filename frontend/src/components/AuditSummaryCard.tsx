import { motion } from "framer-motion";
import { AlertTriangle, Shield, Lightbulb } from "lucide-react";

type AuditSummary = {
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    executiveSummary: string;
    keyFindings: string[];
    recommendations: string[];
};

type Props = {
    data: AuditSummary | null;
    loading: boolean;
    error?: string;
};

const riskConfig = {
    LOW: {
        border: "border-emerald-500/20",
        bg: "bg-emerald-500/10",
        text: "text-emerald-300",
        icon: Shield,
    },
    MEDIUM: {
        border: "border-yellow-500/20",
        bg: "bg-yellow-500/10",
        text: "text-yellow-300",
        icon: AlertTriangle,
    },
    HIGH: {
        border: "border-red-500/20",
        bg: "bg-red-500/10",
        text: "text-red-300",
        icon: AlertTriangle,
    },
};

export default function AuditSummaryCard({
    data,
    loading,
    error,
}: Props) {
    const config = data ? riskConfig[data.riskLevel] : null;
    const Icon = config?.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative mt-8"
        >
            <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full" />

            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Lightbulb className="text-purple-400" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold">
                            AI Audit Summary
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Human-readable interpretation of on-chain audit provenance
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center gap-3 text-slate-300">
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        Generating audit intelligence...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!data && !loading && !error && (
                    <p className="text-slate-400 text-sm">
                        Generate an AI summary to interpret audit risk and findings.
                    </p>
                )}

                {/* Data */}
                {data && config && (
                    <div className="space-y-6">
                        {/* Risk badge */}
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${config.border} ${config.bg} ${config.text}`}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            Risk Level: {data.riskLevel}
                        </div>

                        {/* Summary */}
                        <div>
                            <p className="text-slate-500 text-sm mb-2">
                                Executive Summary
                            </p>
                            <p className="text-slate-200 text-sm leading-relaxed">
                                {data.executiveSummary}
                            </p>
                        </div>

                        {/* Key Findings */}
                        <div>
                            <p className="text-slate-500 text-sm mb-2">
                                Key Findings
                            </p>
                            <ul className="space-y-2 text-sm text-slate-300">
                                {data.keyFindings.map((f, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-purple-400">•</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <p className="text-slate-500 text-sm mb-2">
                                Recommendations
                            </p>
                            <ul className="space-y-2 text-sm text-slate-300">
                                {data.recommendations.map((r, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-emerald-400">•</span>
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}