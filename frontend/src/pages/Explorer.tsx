import { useState } from "react";
import Navbar from "../components/Navbar";
import { Search, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { getProtocolHistory } from "../lib/contract";
import LatestRecordCard from "../components/LatestRecordCard";

export default function Explorer() {
  const [address, setAddress] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    try {
      setLoading(true);
      setError("");

      const history = await getProtocolHistory(address);
      setRecords(history ?? []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  const sortedRecords = [...records].sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) {
      return (a.blockNumber ?? 0) - (b.blockNumber ?? 0);
    }
    if (a.logIndex !== b.logIndex) {
      return (a.logIndex ?? 0) - (b.logIndex ?? 0);
    }
    return Number(a.timestamp || 0) - Number(b.timestamp || 0);
  });

  const uniqueRecords = Array.from(
    new Map(
      sortedRecords.map((r) => [r.version + r.auditHash + r.commitHash, r]),
    ).values(),
  );

  const latest = uniqueRecords.at(-1);

  const explorerUrl = (addr: string) =>
    `https://sepolia.etherscan.io/address/${addr}`;

  const txUrl = (tx: string) => `https://sepolia.etherscan.io/tx/${tx}`;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-black">Protocol Explorer</h1>

          <p className="text-slate-400 mt-3">
            Browse immutable protocol provenance history directly from the
            blockchain.
          </p>

          <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
            <span>Network: Sepolia</span>
            <span>Source: ProtocolProvenanceRegistry</span>
            {address && (
              <a
                href={explorerUrl(address)}
                target="_blank"
                className="text-cyan-400 flex items-center gap-1"
              >
                View Contract
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-4 mb-10">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Contract Address (0x...)"
            className="flex-1 px-5 py-4 rounded-2xl bg-white/5 border border-white/10"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-cyan-400 text-black font-semibold flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading
              </>
            ) : (
              <>
                <Search size={18} />
                Search
              </>
            )}
          </button>
        </div>

        {/* ERROR */}
        {error && <div className="text-red-400 mb-6">{error}</div>}

        {/* EMPTY */}
        {!loading && uniqueRecords.length === 0 && address && (
          <div className="text-slate-400">No provenance records found.</div>
        )}

        {/* SUMMARY CARD */}
        {latest && (
          <div className="mb-12">
            <LatestRecordCard record={latest} contractAddress={address} />
          </div>
        )}

        {/* TIMELINE */}
        {uniqueRecords.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Provenance Timeline</h2>

            <div className="space-y-6">
              {[...uniqueRecords].reverse().map((r, i) => (
                <div key={i} className="flex gap-4">
                  {/* LINE */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    {i !== uniqueRecords.length - 1 && (
                      <div className="w-px h-24 bg-white/10" />
                    )}
                  </div>

                  {/* CARD */}
                  <div className="flex-1 p-5 rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{r.version}</h3>
                      <Badge />
                    </div>

                    <div className="text-sm text-slate-300 mt-3 space-y-2">
                      <p>
                        <b>Auditor:</b> {r.auditor}
                      </p>
                      <p className="break-all">
                        <b>Audit:</b> {r.auditHash}
                      </p>
                      <p className="break-all">
                        <b>Commit:</b> {r.commitHash}
                      </p>
                      <p>
                        <b>Time:</b> {format(r.timestamp)}
                      </p>

                      {r.txHash && (
                        <a
                          href={txUrl(r.txHash)}
                          target="_blank"
                          className="text-cyan-400 flex items-center gap-1 mt-2"
                        >
                          View Tx
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================
   UI COMPONENTS
========================= */

function Badge() {
  return (
    <span className="text-green-400 flex items-center gap-1 text-sm">
      <CheckCircle2 size={14} />
      On-chain Entry
    </span>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-slate-400">{label}</p>
      <p className="font-medium break-all">{value}</p>
    </div>
  );
}

function format(ts: any) {
  return new Date(Number(ts) * 1000).toLocaleString();
}
