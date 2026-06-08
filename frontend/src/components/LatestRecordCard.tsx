import { CheckCircle2, ExternalLink } from "lucide-react";

type Props = {
    record: any;
    contractAddress?: string;
};

export default function LatestRecordCard({ record, contractAddress }: Props) {
    if (!record) return null;

    const explorerUrl = (addr: string) =>
        `https://sepolia.etherscan.io/address/${addr}`;

    const txUrl = (tx: string) =>
        `https://sepolia.etherscan.io/tx/${tx}`;

    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold">
                        {record.protocolName ?? "Protocol"}
                    </h2>

                    <p className="text-slate-400 text-sm mt-1">
                        Current Version: {record.version}
                    </p>
                </div>

                <span className="text-green-400 flex items-center gap-1 text-sm">
                    <CheckCircle2 size={14} />
                    On-chain Entry
                </span>
            </div>

            {/* META GRID */}
            <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
                <Info label="Auditor" value={record.auditor} />
                <Info label="Audit Hash" value={record.auditHash} />
                <Info label="Commit Hash" value={record.commitHash} />
                <Info
                    label="Timestamp"
                    value={formatTime(record.timestamp)}
                />
            </div>

            {/* LINKS */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
                {contractAddress && (
                    <a
                        href={explorerUrl(contractAddress)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 flex items-center gap-1"
                    >
                        View Contract
                        <ExternalLink size={14} />
                    </a>
                )}

                {record.txHash && (
                    <a
                        href={txUrl(record.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 flex items-center gap-1"
                    >
                        View Transaction
                        <ExternalLink size={14} />
                    </a>
                )}
            </div>
        </div>
    );
}

/* ---------------- helpers ---------------- */

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-slate-400">{label}</p>
            <p className="font-medium break-all">{value}</p>
        </div>
    );
}

function formatTime(ts: any) {
    return new Date(Number(ts) * 1000).toLocaleString();
}