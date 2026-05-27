import { motion } from "framer-motion";

export default function Hero() {

    return (
        <section
            className="
                relative
                min-h-[90vh]
                flex
                items-center
                justify-center
                px-6
            "
        >

            {/* BACKGROUND GLOW */}

            <div
                className="
                    absolute
                    top-[-200px]
                    left-1/2
                    -translate-x-1/2
                    w-[700px]
                    h-[700px]
                    bg-cyan-500/20
                    blur-[180px]
                    rounded-full
                "
            />

            <motion.div
                initial={{
                    opacity: 0,
                    y: 40
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                transition={{
                    duration: 0.8
                }}

                className="
                    relative
                    z-10
                    max-w-5xl
                    text-center
                "
            >

                <div
                    className="
                        inline-flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                        text-cyan-300
                        text-sm
                        mb-8
                    "
                >
                    Immutable blockchain verification
                </div>

                <h1
                    className="
                        text-5xl
                        md:text-7xl
                        font-black
                        leading-tight
                        tracking-tight
                    "
                >
                    Protocol Provenance

                    <span
                        className="
                            block
                            text-cyan-400
                        "
                    >
                        Secured On-Chain
                    </span>
                </h1>

                <p
                    className="
                        mt-8
                        text-lg
                        md:text-xl
                        text-white/60
                        leading-relaxed
                        max-w-3xl
                        mx-auto
                    "
                >
                    Register, audit and verify protocol
                    history using immutable blockchain
                    records with transparent provenance
                    tracking.
                </p>

                <div
                    className="
                        mt-12
                        flex
                        flex-col
                        sm:flex-row
                        items-center
                        justify-center
                        gap-4
                    "
                >
                    <button
                        className="
                            px-8
                            py-4
                            rounded-2xl
                            bg-cyan-400
                            text-black
                            font-semibold
                            hover:scale-105
                            transition
                            shadow-[0_0_40px_rgba(34,211,238,0.35)]
                        "
                    >
                        Register Protocol
                    </button>

                    <button
                        className="
                            px-8
                            py-4
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            backdrop-blur-xl
                            hover:bg-white/10
                            transition
                        "
                    >
                        Verify Records
                    </button>
                </div>
            </motion.div>
        </section>
    );
}