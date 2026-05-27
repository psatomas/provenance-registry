import { motion } from "framer-motion";

const timeline = [
    {
        title: "Protocol Registered",
        date: "Genesis Event",
        description:
            "Initial protocol deployment registered immutably on-chain.",
    },
    {
        title: "Ownership Verified",
        date: "Security Validation",
        description:
            "Primary maintainers cryptographically authenticated.",
    },
    {
        title: "Upgrade Recorded",
        date: "Version Evolution",
        description:
            "Protocol upgrade lineage added to provenance registry.",
    },
    {
        title: "Audit Completed",
        date: "Transparency Layer",
        description:
            "Independent verification added to immutable history.",
    },
];

export default function ProtocolTimeline() {
    return (
        <section className="px-6 lg:px-20 py-28">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-3xl mb-16">
                    <div className="inline-flex px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-200 text-sm mb-6">
                        PROTOCOL HISTORY
                    </div>

                    <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                        Immutable protocol
                        <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                            {" "}
                            evolution timeline
                        </span>
                    </h2>
                </div>

                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

                    <div className="space-y-10">
                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="relative pl-14"
                            >
                                <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-blue-500 border-4 border-[#050816]" />

                                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                                    <p className="text-sm text-blue-300 mb-2">
                                        {item.date}
                                    </p>

                                    <h3 className="text-2xl font-semibold mb-3">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}