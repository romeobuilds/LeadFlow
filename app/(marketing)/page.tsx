import type { Metadata } from "next";
import { Cta } from "@/components/marketing/cta";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";

export const metadata: Metadata = {
  title: "LeadFlow — Lead Management for Agencies & Freelancers",
  description:
    "Capture every lead, drag it through a six-stage pipeline, and track open pipeline value, win rate, and deal activity in one place.",
  openGraph: {
    title: "LeadFlow — Every lead, every stage, one pipeline",
    description:
      "Lead management for agencies and freelancers. A pipeline board, a sortable lead list, and dashboard metrics that update as you work.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <DashboardPreview />
      <Cta />
    </>
  );
}