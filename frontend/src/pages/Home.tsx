import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProblemSection from "../components/ProblemSection";
import HowItWorks from "../components/HowItWorks";
import ProtocolTimeline from "../components/ProtocolTimeline";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
            <Navbar />

            <Hero />

            <ProblemSection />

            <HowItWorks />

            <ProtocolTimeline />

            <Features />

            <Footer />
        </main>
    );
}