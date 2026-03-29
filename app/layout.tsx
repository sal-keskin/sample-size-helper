import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "Study Design & Sample Size Helper",
  description: "A simple, bilingual guide for clinicians planning clinical-epidemiology studies and theses. Calculate sample sizes for prevalence, two-group comparisons, and predictor studies.",
  keywords: ["sample size", "study design", "clinical research", "epidemiology", "prevalence", "örneklem büyüklüğü"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
