import { useState } from "react";
import Navbar from "../components/Navbar";
import VerifyCard from "../components/VerifyCard";
import AuditSummaryCard from "../components/AuditSummaryCard";

import { getLatestRecord } from "../lib/contract";
import { hashPdf } from "../lib/hashPdf";

export default function Verify() {
    const [aiData, setAiData] = useState<any>(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [errorAI, setErrorAI] = useState("");

    // 🔥 AI integration function (serverless OpenAI)
    async function handleAI(record: any) {
        try {
            setLoadingAI(true);
            setErrorAI("");

            const auditText = `
Protocol: ${record.protocolName}
Contract: ${record.contractAddress}
Version: ${record.version}
Auditor: ${record.auditor}
Audit Hash: ${record.auditHash}
Commit Hash: ${record.commitHash}
Timestamp: ${record.timestamp}
`;

            const res = await fetch("/api/audit-summary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ auditText }),
            });

            const data = await res.json();

            setAiData(data);
        } catch (e) {
            console.error(e);
            setErrorAI("Failed to generate AI summary");
        } finally {
            setLoadingAI(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* HEADER */}
                <div className="mb-12">
                    <h1 className="text-5xl font-black">
                        Verify Audit
                    </h1>

                    <p className="text-slate-400 mt-4 max-w-2xl">
                        Validate audit integrity against immutable on-chain records.
                    </p>
                </div>

                {/* VERIFY FLOW */}
                <VerifyCardWithAI onAIRequest={handleAI} />

                {/* AI OUTPUT */}
                <div className="mt-10">
                    <AuditSummaryCard
                        data={aiData}
                        loading={loadingAI}
                        error={errorAI}
                    />
                </div>
            </div>
        </main>
    );
}

/**
 * Wrapper that keeps VerifyCard UI clean and injects AI trigger logic
 */
function VerifyCardWithAI({
    onAIRequest,
}: {
    onAIRequest: (record: any) => void;
}) {
    const [contractAddress, setContractAddress] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<any>(null);

    async function handleVerify() {
        try {
            setError("");
            setResult(null);

            if (!contractAddress.trim()) {
                setError("Please enter a contract address.");
                return;
            }

            if (!file) {
                setError("Please upload an audit PDF.");
                return;
            }

            setLoading(true);

            const uploadedHash = await hashPdf(file);
            const record = await getLatestRecord(contractAddress);

            const valid =
                uploadedHash.toLowerCase() ===
                record.auditHash.toLowerCase();

            const finalResult = {
                valid,
                ...record,
                timestamp: new Date(
                    Number(record.timestamp) * 1000
                ).toLocaleString(),
            };

            setResult(finalResult);

            // 🔥 AI ONLY triggers when verification is valid
            if (valid) {
                onAIRequest(record);
            }
        } catch (err) {
            console.error(err);
            setError("Unable to verify protocol. Record may not exist.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <VerifyCard
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
            file={file}
            setFile={setFile}
            loading={loading}
            error={error}
            result={result}
            onVerify={handleVerify}
        />
    );
}