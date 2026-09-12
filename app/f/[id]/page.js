async function getFileInfo(id, origin) {
  const res = await fetch(`${origin}/api/download/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function DownloadPage({ params }) {
  const { headers } = await import("next/headers");
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const file = await getFileInfo(params.id, origin);

  const wrap = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  };
  const card = {
    width: "100%",
    maxWidth: 380,
    border: "1px solid #232323",
    borderRadius: 10,
    padding: 28,
    textAlign: "center",
  };

  if (!file) {
    return (
      <main style={wrap}>
        <div style={card}>
          <p style={{ color: "#7a7a7a", fontFamily: "var(--font-mono)", fontSize: 13, margin: 0 }}>
            File tidak ditemukan atau link sudah tidak berlaku.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={wrap}>
      <div style={card}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, wordBreak: "break-all", margin: "0 0 6px" }}>
          {file.name}
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#7a7a7a", margin: "0 0 20px" }}>
          {formatSize(file.size)}
        </p>
        <a href={file.downloadUrl} style={{ textDecoration: "none" }}>
          <button
            style={{
              background: "#ededed",
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Unduh
          </button>
        </a>
      </div>
    </main>
  );
}
