async function getPublicFolder(guestId, origin) {
  const res = await fetch(`${origin}/api/public/${guestId}`, { cache: "no-store" });
  if (!res.ok) return { isPublic: false };
  return res.json();
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function PublicFolderPage({ params }) {
  const { headers } = await import("next/headers");
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const data = await getPublicFolder(params.guestId, origin);

  const wrap = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  };

  if (!data.isPublic) {
    return (
      <main style={wrap}>
        <div style={{ border: "1px solid #232323", borderRadius: 10, padding: 24 }}>
          <p style={{ color: "#7a7a7a", fontFamily: "var(--font-mono)", fontSize: 13, margin: 0 }}>
            Folder ini bersifat privat.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={wrap}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: "0 0 24px" }}>Folder publik</h1>
        {data.files.length === 0 ? (
          <p style={{ color: "#7a7a7a", fontSize: 14, fontFamily: "var(--font-mono)" }}>Folder ini kosong.</p>
        ) : (
          <div style={{ border: "1px solid #232323", borderRadius: 10, overflow: "hidden" }}>
            {data.files.map((f, i) => (
              <a
                key={f.id}
                href={`/f/${f.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  textDecoration: "none",
                  borderBottom: i === data.files.length - 1 ? "none" : "1px solid #1a1a1a",
                  color: "#ededed",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, wordBreak: "break-all" }}>
                  {f.original_name}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#7a7a7a", whiteSpace: "nowrap", marginLeft: 12 }}>
                  {formatSize(f.size)}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
    }
