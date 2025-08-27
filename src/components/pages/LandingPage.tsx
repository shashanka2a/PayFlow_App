import { Header } from "../Header";
import { Hero } from "../Hero";
import { HowItWorks } from "../HowItWorks";
import { Features } from "../Features";
import { Footer } from "../Footer";
import type { Page } from "../AppRouter";

interface LandingPageProps {
  navigate: (page: Page) => void;
}

export function LandingPage({ navigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header navigate={navigate} />
      <main>
        <Hero navigate={navigate} />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
}