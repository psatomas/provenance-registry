import { useState } from "react";
import Navbar from "../components/Navbar";
import VerifyCard from "../components/VerifyCard";
import AuditSummaryCard from "../components/AuditSummaryCard";

import { getLatestRecord } from "../lib/contract";

export default function Verify() {
    const [aiData, setAiData] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [errorAI, setErrorAI] = useState("");

    // 🔥 AI integration function
    async function handleAI(record: any) {
        try {
            setLoadingAI(true);
            setErrorAI("");

            const auditText = JSON.stringify(record, null, 2);

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
            setErrorAI("Failed to generate AI summary");
        } finally {
            setLoadingAI(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <h1 className="text-5xl font-black">
                        Verify Audit
                    </h1>

                    <p className="text-slate-400 mt-4 max-w-2xl">
                        Validate audit integrity against immutable on-chain records.
                    </p>
                </div>

                {/* 🔥 We override VerifyCard to inject AI trigger */}
                <VerifyCardWithAI
                    onAIRequest={handleAI}
                />

                {/* AI RESULT */}
                <AuditSummaryCard
                    data={aiData}
                    loading={loadingAI}
                    error={errorAI}
                />
            </div>
        </main>
    );
}

/**
 * Wrapper layer to connect AI trigger with existing VerifyCard
 * (keeps your original logic untouched)
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

            const { hashPdf } = await import("../lib/hashPdf");

            const uploadedHash = await hashPdf(file);

            const { getLatestRecord } = await import("../lib/contract");
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

            // 🔥 TRIGGER AI AFTER SUCCESSFUL VERIFY
            onAIRequest(record);
        } catch (err) {
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