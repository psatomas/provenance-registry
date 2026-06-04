import Navbar from "../components/Navbar";
import VerifyCard from "../components/VerifyCard";

export default function Verify() {
    return (
        <main className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <h1 className="text-5xl font-black">
                        Verify Audit
                    </h1>

                    <p className="text-slate-400 mt-4 max-w-2xl">
                        Validate audit integrity against
                        immutable on-chain records.
                    </p>
                </div>

                <VerifyCard />
            </div>
        </main>
    );
}