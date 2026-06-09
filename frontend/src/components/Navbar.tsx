import { Link, NavLink } from "react-router-dom";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Navbar() {
    const navLinkClass = ({
        isActive,
    }: {
        isActive: boolean;
    }) =>
        `
        text-sm
        font-medium
        transition
        ${
            isActive
                ? "text-cyan-300"
                : "text-slate-400 hover:text-white"
        }
    `;

    return (
        <header
            className="
                w-full
                px-6
                lg:px-20
                py-6
                flex
                items-center
                justify-between
                border-b
                border-white/10
                backdrop-blur-xl
                bg-[#050816]/60
                sticky
                top-0
                z-50
            "
        >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-12">
                {/* LOGO */}
                <Link
                    to="/"
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    {/* LOGO IMAGE */}
                    <img 
                        src="/favicon.svg" 
                        alt="Provenance Registry Logo" 
                        className="w-10 h-10" 
                    />

                    <div>
                        <h1 className="text-lg font-bold">
                            Provenance Registry
                        </h1>

                        <p
                            className="
                                text-xs
                                text-slate-400
                            "
                        >
                            Protocol Provenance Layer
                        </p>
                    </div>
                </Link>

                {/* NAVIGATION */}

                <nav
                    className="
                        hidden
                        md:flex
                        items-center
                        gap-8
                    "
                >
                    <NavLink
                        to="/"
                        className={navLinkClass}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/register"
                        className={navLinkClass}
                    >
                        Register
                    </NavLink>

                    <NavLink
                        to="/verify"
                        className={navLinkClass}
                    >
                        Verify
                    </NavLink>

                    <NavLink
                        to="/explorer"
                        className={navLinkClass}
                    >
                        Explorer
                    </NavLink>
                </nav>
            </div>

            {/* RIGHT SIDE */}

            <div className="flex items-center gap-4">
                <ConnectWalletButton />
            </div>
        </header>
    );
}


