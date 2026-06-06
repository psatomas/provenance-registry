import { ethers } from "ethers";
import { getSignerContract } from "../lib/contract";
import { useState } from "react";
import { motion } from "framer-motion";

import {
    FileCode2,
    Shield,
    Hash,
    Fingerprint,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function RegisterCard() {

    const [protocolName, setProtocolName] = useState("");
    const [version, setVersion] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [auditHash, setAuditHash] = useState("");
    const [commitHash, setCommitHash] = useState("");
    const [auditor, setAuditor] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit() {

    try {

        setLoading(true);
        setError("");
        setSuccess(false);

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!protocolName.trim()) {
            throw new Error(
                "Protocol name is required"
            );
        }

        if (!ethers.isAddress(contractAddress)) {
            throw new Error(
                "Invalid contract address"
            );
        }

        if (!version.trim()) {
            throw new Error(
                "Version is required"
            );
        }

        if (!auditHash.trim()) {
            throw new Error(
                "Audit hash is required"
            );
        }

        if (!commitHash.trim()) {
            throw new Error(
                "Commit hash is required"
            );
        }

        if (!auditor.trim()) {
            throw new Error(
                "Auditor is required"
            );
        }

        // =====================================================
        // CONVERT TO BYTES32
        // =====================================================

        const auditHashBytes32 =
            ethers.keccak256(
                ethers.toUtf8Bytes(
                    auditHash.trim()
                )
            );

        const commitHashBytes32 =
            ethers.keccak256(
                ethers.toUtf8Bytes(
                    commitHash.trim()
                )
            );

        // =====================================================
        // DEBUG
        // =====================================================

        console.log({
            protocolName,
            contractAddress,
            version,
            auditHashBytes32,
            commitHashBytes32,
            auditor
        });

        // =====================================================
        // CONTRACT
        // =====================================================

        const contract =
            await getSignerContract();

        const tx =
            await contract.registerProtocolRecord(
                protocolName.trim(),
                contractAddress,
                version.trim(),
                auditHashBytes32,
                commitHashBytes32,
                auditor.trim()
            );

        await tx.wait();

        // =====================================================
        // SUCCESS
        // =====================================================

        setSuccess(true);

        setProtocolName("");
        setVersion("");
        setContractAddress("");
        setAuditHash("");
        setCommitHash("");
        setAuditor("");

    } catch (err: any) {

        console.error(err);

        setError(
            err?.reason ||
            err?.shortMessage ||
            err?.message ||
            "Transaction failed"
        );

    } finally {

        setLoading(false);
    }
}

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
                            value={protocolName}
                            onChange={setProtocolName}
                        />

                        {/* VERSION */}

                        <InputField
                            icon={<Shield size={18} />}
                            label="Version"
                            placeholder="v1.0.0"
                            value={version}
                            onChange={setVersion}
                        />

                        {/* CONTRACT */}

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Fingerprint size={18} />}
                                label="Contract Address"
                                placeholder="0x..."
                                value={contractAddress}
                                onChange={setContractAddress}
                            />
                        </div>

                        {/* AUDIT HASH */}

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Hash size={18} />}
                                label="Audit Hash"
                                placeholder="0x audit hash"
                                value={auditHash}
                                onChange={setAuditHash}
                            />
                        </div>

                        {/* COMMIT HASH */}

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Hash size={18} />}
                                label="Commit Hash"
                                placeholder="0x commit hash"
                                value={commitHash}
                                onChange={setCommitHash}
                            />
                        </div>

                        {/* AUDITOR */}

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Shield size={18} />}
                                label="Auditor"
                                placeholder="OpenZeppelin"
                                value={auditor}
                                onChange={setAuditor}
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

                        <div className="space-y-2">

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

                            {success && (
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-green-400
                                        text-sm
                                    "
                                >
                                    <CheckCircle2 size={16} />
                                    Protocol successfully registered.
                                </div>
                            )}

                            {error && (
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-red-400
                                        text-sm
                                        max-w-xl
                                        break-words
                                    "
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
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
                                disabled:opacity-60
                                disabled:hover:scale-100
                                flex
                                items-center
                                gap-2
                            "
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Confirming Transaction...
                                </>
                            ) : (
                                "Submit On-Chain"
                            )}

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
    value: string;
    onChange: (value: string) => void;
};

function InputField({
    icon,
    label,
    placeholder,
    value,
    onChange
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
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