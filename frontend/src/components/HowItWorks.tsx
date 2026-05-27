import { motion } from "framer-motion";
import {
    Wallet,
    ShieldCheck,
    Database,
    ScanSearch,
} from "lucide-react";

const steps = [
    {
        icon: Wallet,
        title: "Connect Wallet",
        description:
            "Authenticate using your Web3 wallet with secure ownership verification.",
    },
    {
        icon: Database,
        title: "Register Protocol",
        description:
            "Store immutable protocol provenance metadata directly on-chain.",
    },
    {
        icon: ShieldCheck,
        title: "Verify Ownership",
        description:
            "Associate trusted maintainers and ownership lineage transparently.",
    },
    {
        icon: ScanSearch,
        title: "Audit History",
        description:
            "Query the complete historical timeline of protocol evolution.",
    },
];

export default function HowItWorks() {
    return (
        <section className="relative px-6 lg:px-20 py-28">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <div className="inline-flex px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-200 text-sm mb-6">
                        HOW IT WORKS
                    </div>

                    <h2 className="text-4xl lg:text-6xl font-bold">
                        Simple workflow.
                        <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                            {" "}
                            Enterprise-grade trust.
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg mt-6">
                        ProofChain transforms protocol provenance into a
                        transparent and verifiable blockchain-native system.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 text-[120px] font-bold text-white/[0.03] leading-none">
                                        0{index + 1}
                                    </div>

                                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                                        <Icon className="w-7 h-7 text-blue-400" />
                                    </div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        {step.title}
                                    </h3>

                                    <p className="text-slate-400 leading-relaxed">
                                        {step.description}
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