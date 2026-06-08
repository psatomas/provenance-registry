import { useState } from "react";
import Navbar from "../components/Navbar";
import VerifyCard from "../components/VerifyCard";

import { getLatestRecord } from "../lib/contract";
import { hashPdf } from "../lib/hashPdf";

export default function Verify() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-black">Verify Audit</h1>

          <p className="text-slate-400 mt-4 max-w-2xl">
            Validate audit integrity against immutable on-chain records.
          </p>
        </div>

        {/* VERIFY FLOW */}
        <VerifyCardWithVerification />
      </div>
    </main>
  );
}

function VerifyCardWithVerification() {
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
        uploadedHash.toLowerCase() === record.auditHash.toLowerCase();

      const finalResult = {
        valid,
        ...record,
        timestamp: new Date(
          Number(record.timestamp) * 1000
        ).toLocaleString(),
      };

      setResult(finalResult);
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