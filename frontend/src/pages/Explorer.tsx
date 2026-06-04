import { useState } from "react";

import Navbar from "../components/Navbar";

import {
    Search,
    Loader2,
    CheckCircle2,
} from "lucide-react";

import {
    getProtocolHistory,
} from "../lib/contract";

export default function Explorer() {

    const [address, setAddress] = useState("");

    const [records, setRecords] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleSearch() {

        try {

            setLoading(true);

            setError("");

            const history =
                await getProtocolHistory(
                    address
                );

            setRecords(history);

        } catch (err: any) {

            console.error(err);

            setError(
                err?.message ||
                "Failed to fetch records"
            );

            setRecords([]);

        } finally {

            setLoading(false);

        }
    }

    const latestRecord =
        records.length > 0
            ? records[records.length - 1]
            : null;

    return (

        <main className="min-h-screen bg-[#050816] text-white">

            <Navbar />

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-20
                "
            >

                {/* HEADER */}

                <h1
                    className="
                        text-5xl
                        font-black
                    "
                >
                    Protocol Explorer
                </h1>

                <p
                    className="
                        mt-4
                        text-slate-400
                    "
                >
                    Browse immutable protocol
                    provenance history directly
                    from the blockchain.
                </p>

                {/* SEARCH */}

                <div
                    className="
                        mt-12
                        flex
                        flex-col
                        md:flex-row
                        gap-4
                    "
                >

                    <input
                        value={address}
                        onChange={(e) =>
                            setAddress(
                                e.target.value
                            )
                        }
                        placeholder="Contract Address"
                        className="
                            flex-1
                            px-5
                            py-4
                            rounded-2xl
                            bg-white/5
                            border
                            border-white/10
                            outline-none
                        "
                    />

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="
                            px-8
                            py-4
                            rounded-2xl
                            bg-cyan-400
                            text-black
                            font-semibold
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

                {error && (

                    <div
                        className="
                            mt-6
                            text-red-400
                        "
                    >
                        {error}
                    </div>

                )}

                {/* SUMMARY */}

                {latestRecord && (

                    <div className="mt-12">

                        <h2
                            className="
                                text-2xl
                                font-bold
                                mb-6
                            "
                        >
                            Protocol Summary
                        </h2>

                        <div
                            className="
                                grid
                                md:grid-cols-4
                                gap-4
                            "
                        >

                            <SummaryCard
                                title="Protocol"
                                value={
                                    latestRecord.protocolName
                                }
                            />

                            <SummaryCard
                                title="Version"
                                value={
                                    latestRecord.version
                                }
                            />

                            <SummaryCard
                                title="Auditor"
                                value={
                                    latestRecord.auditor
                                }
                            />

                            <SummaryCard
                                title="Records"
                                value={
                                    String(
                                        records.length
                                    )
                                }
                            />

                        </div>

                    </div>

                )}

                {/* TIMELINE */}

                {records.length > 0 && (

                    <div className="mt-16">

                        <h2
                            className="
                                text-3xl
                                font-bold
                                mb-8
                            "
                        >
                            Provenance Timeline
                        </h2>

                        <div className="space-y-6">

                            {[...records]
                                .reverse()
                                .map(
                                    (
                                        record,
                                        index
                                    ) => (

                                    <div
                                        key={index}
                                        className="
                                            rounded-3xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            p-6
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                items-center
                                                mb-6
                                            "
                                        >

                                            <h3
                                                className="
                                                    text-xl
                                                    font-bold
                                                "
                                            >
                                                {
                                                    record.version
                                                }
                                            </h3>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-green-400
                                                "
                                            >
                                                <CheckCircle2
                                                    size={
                                                        16
                                                    }
                                                />
                                                Verified
                                            </div>

                                        </div>

                                        <div
                                            className="
                                                grid
                                                gap-3
                                                text-sm
                                            "
                                        >

                                            <p>
                                                <strong>
                                                    Auditor:
                                                </strong>{" "}
                                                {
                                                    record.auditor
                                                }
                                            </p>

                                            <p>
                                                <strong>
                                                    Audit Hash:
                                                </strong>{" "}
                                                {
                                                    record.auditHash
                                                }
                                            </p>

                                            <p>
                                                <strong>
                                                    Commit Hash:
                                                </strong>{" "}
                                                {
                                                    record.commitHash
                                                }
                                            </p>

                                            <p>
                                                <strong>
                                                    Timestamp:
                                                </strong>{" "}
                                                {new Date(
                                                    Number(
                                                        record.timestamp
                                                    ) *
                                                        1000
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                    </div>

                                    )
                                    )
                            }

                        </div>

                    </div>

                )}

            </div>

        </main>
    );
}

function SummaryCard({
    title,
    value,
}: {
    title: string;
    value: string;
}) {

    return (

        <div
            className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-5
            "
        >

            <p
                className="
                    text-sm
                    text-slate-400
                "
            >
                {title}
            </p>

            <p
                className="
                    mt-2
                    text-lg
                    font-bold
                "
            >
                {value}
            </p>

        </div>

    );
}