async function getFileInfo(id, origin) {
  const res = await fetch(`${origin}/api/download/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function DownloadPage({ params }) {
  const { headers } = await import("next/headers");
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const file = await getFileInfo(params.id, origin);

  const cardStyle = { width: "100%", maxWidth: 420, background: "#151f33", border: "1px solid #263250", borderRadius: 20, padding: "40px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", textAlign: "center" };

  if (!file) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>😕</div>
          <h1 style={{ fontSize: 20, color: "#fff", margin: "0 0 8px" }}>File tidak ditemukan</h1>
          <p style={{ color: "#8b95ab", fontSize: 14, margin: 0 }}>Link ini tidak valid atau file sudah expired.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={cardStyle}>
        <div style={{ width: 56, height: 56, margin: "0 auto 20px", borderRadius: 16, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>📄</div>
        <h1 style={{ fontSize: 18, color: "#fff", margin: "0 0 4px", wordBreak: "break-all" }}>{file.name}</h1>
        <p style={{ color: "#8b95ab", fontSize: 14, margin: "0 0 24px" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <a href={file.downloadUrl} style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Download</button>
        </a>
      </div>
    </main>
  );
    }
