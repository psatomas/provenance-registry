import { motion } from "framer-motion";
import {
    Shield,
    Database,
    Globe,
    Lock,
    Workflow,
    Cpu,
} from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Immutable Provenance",
        description:
            "Historical protocol ownership and upgrade lineage stored permanently on-chain.",
    },
    {
        icon: Database,
        title: "Decentralized Registry",
        description:
            "Blockchain-native architecture removes dependency on centralized registries.",
    },
    {
        icon: Globe,
        title: "Public Verification",
        description:
            "Anyone can independently validate protocol authenticity and historical integrity.",
    },
    {
        icon: Lock,
        title: "Access Control",
        description:
            "Secure authorization model with ownership-restricted updates.",
    },
    {
        icon: Workflow,
        title: "Upgrade Tracking",
        description:
            "Transparent lifecycle monitoring for protocol evolution and governance.",
    },
    {
        icon: Cpu,
        title: "Enterprise Architecture",
        description:
            "Designed with scalability, auditability, and production-grade trust in mind.",
    },
];

export default function Features() {
    return (
        <section className="px-6 lg:px-20 py-28 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_40%)]" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-200 text-sm mb-6">
                        CORE FEATURES
                    </div>

                    <h2 className="text-4xl lg:text-6xl font-bold">
                        Infrastructure for the
                        <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                            {" "}
                            next generation
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg mt-6">
                        ProofChain delivers transparency, trust, and immutable
                        protocol provenance through decentralized infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div className="h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 hover:border-blue-500/30 transition-all duration-500">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                                        <Icon className="text-blue-400 w-7 h-7" />
                                    </div>

                                    <h3 className="text-2xl font-semibold mb-4">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-400 leading-relaxed">
                                        {feature.description}
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