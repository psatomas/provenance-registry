import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProblemSection from "../components/ProblemSection";
import HowItWorks from "../components/HowItWorks";
import RegisterCard from "../components/RegisterCard";
import VerifyCard from "../components/VerifyCard";
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

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 lg:px-20 py-20">
                <RegisterCard />
                <VerifyCard />
            </section>

            <ProtocolTimeline />
            <Features />
            <Footer />
        </main>
    );
}