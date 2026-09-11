"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#151f33", border: "1px solid #263250", borderRadius: 20, padding: "40px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, margin: "0 auto 20px", borderRadius: 16, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>📁</div>
        <h1 style={{ fontSize: 22, margin: "0 0 8px", color: "#fff" }}>Upload File</h1>
        <p style={{ color: "#8b95ab", fontSize: 14, margin: "0 0 28px" }}>Pilih file dan dapatkan link untuk dibagikan</p>
        <form onSubmit={handleUpload}>
          <label htmlFor="fileInput" style={{ display: "block", border: "2px dashed #2e3b5c", borderRadius: 14, padding: "24px 16px", cursor: "pointer", color: file ? "#e5e9f0" : "#6b7690", fontSize: 14, marginBottom: 16, background: "#101929", wordBreak: "break-all" }}>
            {file ? file.name : "Ketuk untuk pilih file"}
          </label>
          <input id="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
          <button type="submit" disabled={!file || uploading} style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: !file || uploading ? "#293252" : "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: !file || uploading ? "not-allowed" : "pointer" }}>
            {uploading ? "Mengunggah..." : "Upload"}
          </button>
        </form>
        {error && <p style={{ color: "#f87171", fontSize: 14, marginTop: 16 }}>{error}</p>}
        {result && (
          <div style={{ marginTop: 24, padding: 16, background: "#101929", border: "1px solid #263250", borderRadius: 12 }}>
            <p style={{ color: "#4ade80", fontSize: 14, margin: "0 0 8px" }}>File berhasil diupload!</p>
            <a href={result.url} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", fontSize: 13, wordBreak: "break-all" }}>{result.url}</a>
          </div>
        )}
      </div>
    </main>
  );
              }
