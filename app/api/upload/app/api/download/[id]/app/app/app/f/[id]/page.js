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

  if (!file) {
    return (
      <main style={{ maxWidth: 480, margin: "80px auto", textAlign: "center" }}>
        <h1>File tidak ditemukan</h1>
        <p>Link ini tidak valid atau file sudah expired.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 480, margin: "80px auto", textAlign: "center" }}>
      <h1>{file.name}</h1>
      <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
      <a href={file.downloadUrl}>
        <button>Download</button>
      </a>
    </main>
  );
    }
