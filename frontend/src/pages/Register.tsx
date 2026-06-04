import Navbar from "../components/Navbar";
import RegisterCard from "../components/RegisterCard";

export default function Register() {
    return (
        <main className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <h1 className="text-5xl font-black">
                        Register Protocol
                    </h1>

                    <p className="text-slate-400 mt-4 max-w-2xl">
                        Create immutable provenance records and
                        publish audit metadata on-chain.
                    </p>
                </div>

                <RegisterCard />
            </div>
        </main>
    );
}