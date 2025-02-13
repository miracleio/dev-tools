import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import SiteHeader from "@/components/Site/Header";
import "./globals.css";

const HostSans = Host_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tools",
  description: "Collection of Simple & (hopefully) useful tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${HostSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <SiteHeader />
        {children}
        <footer className="site-section mt-auto">
          <div className="wrapper">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Made with 💙 by{" "}
                <a
                  href="https://github.com/miracleio"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400"
                >
                  Miracleio
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
