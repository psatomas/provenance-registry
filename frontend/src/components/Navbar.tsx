import { ShieldCheck } from "lucide-react";

export default function Navbar() {

    return (
        <header
            className="
                w-full
                border-b
                border-white/10
                backdrop-blur-xl
                bg-white/5
                sticky
                top-0
                z-50
            "
        >
            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-4
                    flex
                    items-center
                    justify-between
                "
            >
                <div className="flex items-center gap-3">

                    <div
                        className="
                            p-2
                            rounded-xl
                            bg-cyan-500/10
                            border
                            border-cyan-400/20
                        "
                    >
                        <ShieldCheck
                            className="text-cyan-400"
                            size={22}
                        />
                    </div>

                    <div>
                        <h1
                            className="
                                text-xl
                                font-bold
                                tracking-tight
                            "
                        >
                            ProofChain
                        </h1>

                        <p
                            className="
                                text-xs
                                text-white/50
                            "
                        >
                            On-chain provenance registry
                        </p>
                    </div>
                </div>

                <nav
                    className="
                        hidden
                        md:flex
                        items-center
                        gap-8
                        text-sm
                        text-white/70
                    "
                >
                    <a
                        href="#"
                        className="hover:text-cyan-400 transition"
                    >
                        Register
                    </a>

                    <a
                        href="#"
                        className="hover:text-cyan-400 transition"
                    >
                        Verify
                    </a>

                    <a
                        href="#"
                        className="hover:text-cyan-400 transition"
                    >
                        Explorer
                    </a>
                </nav>
            </div>
        </header>
    );
}