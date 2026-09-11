export const metadata = {
  title: "File Hosting",
  description: "Upload dan share file dengan mudah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0b1424 0%, #101d33 100%)",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          color: "#e5e9f0",
        }}
      >
        {children}
      </body>
    </html>
  );
}
