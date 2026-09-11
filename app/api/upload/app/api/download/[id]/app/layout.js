export const metadata = {
  title: "File Hosting",
  description: "Upload dan share file dengan mudah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
