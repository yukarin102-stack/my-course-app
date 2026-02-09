import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Curriculum } from "@/components/home/Curriculum";
import { Instructor } from "@/components/home/Instructor";
import { FAQ } from "@/components/home/FAQ";
import { Footer } from "@/components/layout/Footer";
import { LeadMagnet } from "@/components/home/LeadMagnet";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Skills",
  description: "効果的な学習スキルを学ぶためのオンライン講座プラットフォーム",
};

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <LeadMagnet />
      <Features />
      <Curriculum />
      <Instructor />
      <FAQ />
      <Footer />
    </main>
  );
}
