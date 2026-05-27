import { motion } from "framer-motion";

import {
    FileCode2,
    Shield,
    Hash,
    Fingerprint
} from "lucide-react";

export default function RegisterCard() {

    return (

        <section
            className="
                relative
                z-10
                px-6
                pb-32
            "
        >
            <div
                className="
                    max-w-7xl
                    mx-auto
                "
            >

                {/* HEADER */}

                <div className="mb-14">

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
                            mb-6
                        "
                    >
                        On-chain registration flow
                    </div>

                    <h2
                        className="
                            text-4xl
                            md:text-5xl
                            font-black
                            tracking-tight
                        "
                    >
                        Register Protocol
                    </h2>

                    <p
                        className="
                            mt-4
                            text-white/60
                            max-w-2xl
                            leading-relaxed
                        "
                    >
                        Create immutable provenance
                        records with audit hashes,
                        version history and verifiable
                        blockchain timestamps.
                    </p>
                </div>

                {/* CARD */}

                <motion.div

                    initial={{
                        opacity: 0,
                        y: 40
                    }}

                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}

                    transition={{
                        duration: 0.7
                    }}

                    viewport={{
                        once: true
                    }}

                    className="
                        relative
                        overflow-hidden
                        rounded-[32px]
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-2xl
                        p-8
                        md:p-10
                    "
                >

                    {/* GLOW */}

                    <div
                        className="
                            absolute
                            top-0
                            right-0
                            w-[300px]
                            h-[300px]
                            bg-cyan-400/10
                            blur-[120px]
                            rounded-full
                        "
                    />

                    {/* GRID */}

                    <div
                        className="
                            relative
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-6
                        "
                    >

                        {/* PROTOCOL NAME */}

                        <InputField
                            icon={<FileCode2 size={18} />}
                            label="Protocol Name"
                            placeholder="ProofChain"
                        />

                        {/* VERSION */}

                        <InputField
                            icon={<Shield size={18} />}
                            label="Version"
                            placeholder="v1.0.0"
                        />

                        {/* CONTRACT */}

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Fingerprint size={18} />}
                                label="Contract Address"
                                placeholder="0x..."
                            />
                        </div>

                        {/* AUDIT HASH */}

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Hash size={18} />}
                                label="Audit Hash"
                                placeholder="0x audit hash"
                            />
                        </div>

                        {/* COMMIT HASH */}

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Hash size={18} />}
                                label="Commit Hash"
                                placeholder="0x commit hash"
                            />
                        </div>

                        {/* AUDITOR */}

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Shield size={18} />}
                                label="Auditor"
                                placeholder="OpenZeppelin"
                            />
                        </div>
                    </div>

                    {/* ACTIONS */}

                    <div
                        className="
                            relative
                            mt-10
                            flex
                            flex-col
                            md:flex-row
                            items-start
                            md:items-center
                            justify-between
                            gap-6
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-white/50
                                "
                            >
                                Transactions are registered
                                on-chain and permanently
                                auditable.
                            </p>
                        </div>

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
                            Submit On-Chain
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

type InputProps = {
    icon: React.ReactNode;
    label: string;
    placeholder: string;
};

function InputField({
    icon,
    label,
    placeholder
}: InputProps) {

    return (

        <div>

            <label
                className="
                    mb-3
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-white/70
                "
            >
                {icon}
                {label}
            </label>

            <input
                placeholder={placeholder}
                className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/20
                    text-white
                    outline-none
                    transition
                    focus:border-cyan-400/40
                    focus:bg-black/30
                "
            />
        </div>
    );
}