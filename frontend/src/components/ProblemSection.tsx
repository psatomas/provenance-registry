import { motion } from "framer-motion";
import {
    ShieldAlert,
    DatabaseZap,
    FileWarning,
    LockKeyhole,
} from "lucide-react";

const problems = [
    {
        icon: ShieldAlert,
        title: "No Provenance Layer",
        description:
            "Protocols evolve constantly, but there is no immutable on-chain history proving who created, upgraded, or modified critical infrastructure.",
    },
    {
        icon: FileWarning,
        title: "Trust Is Fragmented",
        description:
            "Auditors, investors, and developers rely on scattered documentation, GitHub commits, and unverifiable claims instead of cryptographic proof.",
    },
    {
        icon: DatabaseZap,
        title: "Centralized Registries",
        description:
            "Existing registries depend on centralized platforms that can be manipulated, censored, or lose historical integrity over time.",
    },
    {
        icon: LockKeyhole,
        title: "Weak Upgrade Transparency",
        description:
            "Most users cannot easily verify protocol ownership changes, upgrade chronology, or operational authenticity.",
    },
];

export default function ProblemSection() {
    return (
        <section className="relative px-6 lg:px-20 py-28 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_45%)]" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-xl mb-6">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-sm text-blue-200 tracking-wide">
                            THE PROBLEM
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                        Web3 lacks a trusted
                        <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                            {" "}
                            provenance layer
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg leading-relaxed mt-6">
                        Protocol infrastructure evolves rapidly, but the
                        ecosystem still lacks an immutable and verifiable system
                        for tracking protocol ownership, upgrade lineage, and
                        historical authenticity.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.map((problem, index) => {
                        const Icon = problem.icon;

                        return (
                            <motion.div
                                key={problem.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-blue-300/5 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />

                                <div className="relative h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 hover:border-blue-500/30 transition-all duration-500">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                                        <Icon className="text-blue-400 w-7 h-7" />
                                    </div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        {problem.title}
                                    </h3>

                                    <p className="text-slate-400 leading-relaxed">
                                        {problem.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}