import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {

    return (
        <main className="min-h-screen bg-[#050816] overflow-hidden">
            <Navbar />
            <Hero />
        </main>
    );
}