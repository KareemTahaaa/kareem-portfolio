import type { Metadata, Viewport } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";

// One family that covers both Latin and Arabic, so the two scripts share a voice.
const readex = Readex_Pro({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kareem Taha, full-stack software engineer",
  description:
    "Full-stack engineer in Cairo building web apps in English and Arabic with Next.js, TypeScript and Node.js. Open to full-time roles and freelance projects.",
  openGraph: {
    title: "Kareem Taha, full-stack software engineer",
    description: "Web apps built end to end, in English and Arabic.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1F3EF" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1820" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={readex.variable} suppressHydrationWarning>
      <head>
        {/* Apply a saved theme before paint so there is no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
