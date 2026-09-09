import { ethers } from "ethers";
import { getSignerContract } from "../lib/contract";
import { useState } from "react";
import { motion } from "framer-motion";

import { hashPdf } from "../lib/hashPdf";
import artifact from "../abi/ProtocolProvenanceRegistry.json";

import {
    FileCode2,
    Shield,
    Hash,
    Fingerprint,
    Loader2,
    CheckCircle2,
    AlertCircle,
    FileText
} from "lucide-react";

// Built from the same ABI the contract client uses, so custom-error decoding
// stays correct even if the call fails before a contract instance exists.
const REGISTRY_INTERFACE = new ethers.Interface(artifact.abi);

// =========================================================
// CUSTOM ERROR DECODING
// =========================================================
//
// ethers can surface a contract revert as an opaque
// "execution reverted (unknown custom error)" message (err.reason is null)
// depending on how the provider (MetaMask, JSON-RPC) shapes the error. Walk
// the known locations for raw revert data and decode it against the
// registry's own ABI instead of relying on err.reason/shortMessage alone.
type EthersLikeError = {
    data?: unknown;
    info?: { error?: { data?: unknown } };
    error?: { data?: unknown; error?: { data?: unknown } };
};

function decodeRegistryErrorName(err: unknown): string | undefined {
    const shaped = err as EthersLikeError;

    const candidates = [
        shaped?.data,
        shaped?.info?.error?.data,
        shaped?.error?.data,
        shaped?.error?.error?.data,
    ];

    for (const data of candidates) {
        if (typeof data === "string" && data.startsWith("0x")) {
            try {
                const parsed = REGISTRY_INTERFACE.parseError(data);
                if (parsed) return parsed.name;
            } catch {
                // not decodable from this candidate, try the next one
            }
        }
    }

    return undefined;
}

export default function RegisterCard() {

    const [protocolName, setProtocolName] = useState("");
    const [version, setVersion] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [auditor, setAuditor] = useState("");

    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const [commitHash, setCommitHash] = useState("");

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

            if (!protocolName.trim()) throw new Error("Protocol name is required");
            if (!ethers.isAddress(contractAddress)) throw new Error("Invalid contract address");
            if (!version.trim()) throw new Error("Version is required");
            if (!auditor.trim()) throw new Error("Auditor is required");
            if (!pdfFile) throw new Error("PDF file is required");
            if (!commitHash.trim()) throw new Error("Commit hash is required");

            // =====================================================
            // PDF HASH (CORE OF YOUR SYSTEM)
            // =====================================================

            const auditHashBytes32 = await hashPdf(pdfFile);

            // =====================================================
            // COMMIT HASH (OPTIONAL AUTO-FIX)
            // =====================================================

            let commitHashBytes32: string;

            if (commitHash.startsWith("0x") && commitHash.length === 66) {
                commitHashBytes32 = commitHash;
            } else {
                commitHashBytes32 = ethers.keccak256(
                    ethers.toUtf8Bytes(commitHash)
                );
            }

            // =====================================================
            // CONTRACT
            // =====================================================

            const contract = await getSignerContract();

            const tx = await contract.registerProtocolRecord(
                protocolName.trim(),
                contractAddress,
                version.trim(),
                auditHashBytes32,
                commitHashBytes32,
                auditor.trim()
            );

            await tx.wait();

            // =====================================================
            // SUCCESS RESET
            // =====================================================

            setSuccess(true);

            setProtocolName("");
            setVersion("");
            setContractAddress("");
            setAuditor("");
            setCommitHash("");
            setPdfFile(null);

        } catch (err: any) {

            console.error(err);

            const errorName = decodeRegistryErrorName(err);

            if (errorName === "NotOwner") {
                setError(
                    "Only the registry owner can register provenance records. Connect the owner wallet and try again."
                );
            } else {
                setError(
                    err?.reason ||
                    err?.shortMessage ||
                    err?.message ||
                    "Transaction failed"
                );
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="relative z-10 px-6 pb-32">
            <div className="max-w-7xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10"
                >

                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-400/10 blur-[120px] rounded-full" />

                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* PDF UPLOAD (NEW CORE PIECE) */}
                        <div className="md:col-span-2">
                            <label className="mb-3 flex items-center gap-2 text-sm text-white/70">
                                <FileText size={18} />
                                Audit PDF
                            </label>

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setPdfFile(file);
                                }}
                                className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/20 text-white"
                            />
                        </div>

                        <InputField
                            icon={<FileCode2 size={18} />}
                            label="Protocol Name"
                            placeholder="ProofChain"
                            value={protocolName}
                            onChange={setProtocolName}
                        />

                        <InputField
                            icon={<Shield size={18} />}
                            label="Version"
                            placeholder="v1.0.0"
                            value={version}
                            onChange={setVersion}
                        />

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Fingerprint size={18} />}
                                label="Contract Address"
                                placeholder="0x..."
                                value={contractAddress}
                                onChange={setContractAddress}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InputField
                                icon={<Hash size={18} />}
                                label="Commit Hash"
                                placeholder="git commit or 0x..."
                                value={commitHash}
                                onChange={setCommitHash}
                            />
                        </div>

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

                    {/* STATUS */}
                    <div className="relative mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                        <div className="space-y-2">

                            <p className="text-sm text-white/50">
                                PDF is hashed and anchored on-chain via keccak256.
                            </p>

                            {success && (
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                    <CheckCircle2 size={16} />
                                    Protocol successfully registered.
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-sm max-w-xl break-words">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-4 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition shadow-[0_0_40px_rgba(34,211,238,0.35)] disabled:opacity-60 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
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

function InputField({ icon, label, placeholder, value, onChange }: InputProps) {
    return (
        <div>
            <label className="mb-3 flex items-center gap-2 text-sm text-white/70">
                {icon}
                {label}
            </label>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-black/20 text-white outline-none focus:border-cyan-400/40 focus:bg-black/30"
            />
        </div>
    );
}