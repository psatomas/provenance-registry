import Navbar from "../components/Navbar";

export default function Explorer() {
    return (
        <main className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20">
                <h1 className="text-5xl font-black">
                    Protocol Explorer
                </h1>

                <p className="mt-4 text-slate-400">
                    Browse protocol provenance records.
                </p>
            </div>
        </main>
    );
}