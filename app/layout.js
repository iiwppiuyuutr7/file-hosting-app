import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Xera",
  description: "Simpan dan bagikan file dengan mudah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#000000",
          color: "#ededed",
          fontFamily: "var(--font-display), system-ui, sans-serif",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {children}
      </body>
    </html>
  );
}
