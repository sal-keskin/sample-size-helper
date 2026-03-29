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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rByDn93PUhC28v4P0v8Bjnalr3VaBbRBJ/1lkH5AZ00PKHOoP+jQunA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
