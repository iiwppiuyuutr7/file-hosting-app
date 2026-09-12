"use client";

import { useEffect, useRef, useState } from "react";

const BORDER = "#232323";
const BORDER_SOFT = "#1a1a1a";
const PANEL = "#0d0d0d";
const TEXT = "#ededed";
const MUTED = "#7a7a7a";
const DANGER = "#e05a4f";
const ACCENT = "#d8973c";

function IconSearch(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconRefresh(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  );
}
function IconCheckSquare(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  );
}
function IconShare(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <line x1="8.3" y1="10.7" x2="15.7" y2="6.3" />
      <line x1="8.3" y1="13.3" x2="15.7" y2="17.7" />
    </svg>
  );
}
function IconTrash(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <polyline points="4 7 20 7" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function IconX(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  );
}
function IconFolder(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" />
    </svg>
  );
}
function IconImage(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function IconFile(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function IconUpload(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3v12" />
      <polyline points="7 8 12 3 17 8" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatDate(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time}`;
}

function uploadWithProgress(file, guestId, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("guestId", guestId);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.error || "Upload gagal"));
        }
      } catch {
        reject(new Error("Upload gagal"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload gagal, periksa koneksi")));

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

const iconButtonStyle = {
  background: "transparent",
  border: "none",
  color: TEXT,
  padding: 8,
  borderRadius: 6,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
const textButtonStyle = {
  background: "transparent",
  border: "none",
  color: MUTED,
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  cursor: "pointer",
  padding: "6px 8px",
};
const rowStyle = { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" };
const uploadButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: TEXT,
  color: "#000",
  border: "none",
  borderRadius: 8,
  padding: "12px 22px",
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 50,
};
const modalStyle = {
  width: "100%",
  maxWidth: 420,
  background: "#000",
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: 24,
};

export default function Home() {
  const [guestId, setGuestId] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [files, setFiles] = useState([]);
  const [usage, setUsage] = useState({ used: 0, total: 52428800 });
  const [uploads, setUploads] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Salin");
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const visibleFiles = query.trim()
    ? files.filter((f) => f.original_name.toLowerCase().includes(query.trim().toLowerCase()))
    : files;

  const shareLink = guestId && typeof window !== "undefined" ? `${window.location.origin}/g/${guestId}` : "";

  useEffect(() => {
    let id = localStorage.getItem("xera_guest_id");
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("xera_guest_id", id);
    }
    setGuestId(id);
  }, []);

  useEffect(() => {
    if (!guestId) return;
    (async () => {
      try {
        const res = await fetch("/api/guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestId }),
        });
        const data = await res.json();
        if (res.ok) setIsPublic(data.isPublic);
      } catch {
        // biarkan, list file tetap dicoba dimuat
      }
      fetchFiles(guestId);
    })();
  }, [guestId]);

  async function fetchFiles(id) {
    try {
      const res = await fetch(`/api/files?guestId=${id}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files);
        setUsage(data.usage);
      }
    } catch {
      setError("Gagal memuat daftar file");
    }
  }

  async function handleFilesPicked(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    for (const file of picked) {
      const tempId = `${Date.now()}-${Math.random()}`;
      setUploads((prev) => [...prev, { tempId, name: file.name, percent: 0, phase: "uploading" }]);
      setError(null);
      try {
        const result = await uploadWithProgress(file, guestId, (percent) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.tempId === tempId ? { ...u, percent, phase: percent >= 100 ? "processing" : "uploading" } : u
            )
          );
        });
        setFiles((prev) => [
          {
            id: result.id,
            original_name: result.name,
            size: result.size,
            mime_type: result.mimeType,
            created_at: result.createdAt,
          },
          ...prev,
        ]);
        setUsage((prev) => ({ ...prev, used: prev.used + result.size }));
      } catch (err) {
        setError(err.message);
      } finally {
        setUploads((prev) => prev.filter((u) => u.tempId !== tempId));
      }
    }
  }

  function toggleOne(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (prev.size === visibleFiles.length && visibleFiles.length > 0) return new Set();
      return new Set(visibleFiles.map((f) => f.id));
    });
  }

  async function handleDeleteSelected() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, fileIds: ids }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus file");
      const removedSize = files
        .filter((f) => data.deleted.includes(f.id))
        .reduce((s, f) => s + Number(f.size || 0), 0);
      setFiles((prev) => prev.filter((f) => !data.deleted.includes(f.id)));
      setUsage((prev) => ({ ...prev, used: Math.max(0, prev.used - removedSize) }));
      setSelected(new Set());
    } catch (err) {
      setError(err.message);
    }
  }

  async function togglePublic() {
    const next = !isPublic;
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, isPublic: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengubah status");
      setIsPublic(data.isPublic);
    } catch (err) {
      setError(err.message);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(shareLink);
    setCopyLabel("Tersalin");
    setTimeout(() => setCopyLabel("Salin"), 1500);
  }

  const allSelected = selected.size === visibleFiles.length && visibleFiles.length > 0;

  return (
    <main style={{ minHeight: "100vh", padding: "32px 16px 80px", maxWidth: 640, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, margin: 0, letterSpacing: 0.2 }}>Xera</h1>
      </header>

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: MUTED,
            marginBottom: 6,
          }}
        >
          <span>Penyimpanan</span>
          <span>
            {formatSize(usage.used)} dari {formatSize(usage.total)}
          </span>
        </div>
        <div style={{ height: 4, background: BORDER_SOFT, borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, (usage.used / usage.total) * 100)}%`,
              background: ACCENT,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      <div
        style={{
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconFolder style={{ color: MUTED, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>root</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED, marginTop: 2 }}>
              {files.length} file
            </div>
          </div>
        </div>
        <button onClick={() => setShareOpen(true)} style={iconButtonStyle} aria-label="Bagikan">
          <IconShare />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, minHeight: 34 }}>
        {selected.size > 0 ? (
          <>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: TEXT, marginRight: "auto" }}>
              {selected.size} dipilih
            </span>
            <button onClick={() => setSelected(new Set())} style={textButtonStyle}>
              Batal
            </button>
            <button onClick={handleDeleteSelected} style={{ ...iconButtonStyle, color: DANGER }} aria-label="Hapus">
              <IconTrash />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setSearchOpen((v) => !v)} style={iconButtonStyle} aria-label="Cari file">
              <IconSearch />
            </button>
            <button
              onClick={toggleAll}
              style={{ ...iconButtonStyle, color: allSelected ? ACCENT : TEXT }}
              aria-label="Pilih semua"
            >
              <IconCheckSquare />
            </button>
            <div style={{ marginLeft: "auto" }} />
            <button onClick={() => fetchFiles(guestId)} style={iconButtonStyle} aria-label="Muat ulang">
              <IconRefresh />
            </button>
          </>
        )}
      </div>

      {searchOpen && selected.size === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: "8px 12px",
          }}
        >
          <IconSearch style={{ color: MUTED, flexShrink: 0 }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama file"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: TEXT,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ ...iconButtonStyle, padding: 4 }} aria-label="Bersihkan">
              <IconX />
            </button>
          )}
        </div>
      )}

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
        {uploads.map((u) => (
          <div key={u.tempId} style={{ ...rowStyle, borderBottom: `1px solid ${BORDER_SOFT}` }}>
            <div style={{ width: 16 }} />
            <IconFile style={{ color: MUTED, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {u.name}
              </div>
              <div style={{ height: 3, background: BORDER_SOFT, borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${u.percent}%`,
                    background: ACCENT,
                    transition: "width 0.15s linear",
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4, fontFamily: "var(--font-mono)" }}>
                {u.phase === "processing" ? "Memproses di server…" : `${u.percent}%`}
              </div>
            </div>
          </div>
        ))}

        {visibleFiles.length === 0 && uploads.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <IconFolder style={{ color: BORDER, width: 32, height: 32, marginBottom: 12 }} />
            <p style={{ margin: "0 0 4px", fontSize: 14, color: TEXT }}>
              {query ? "Tidak ada file yang cocok" : "Folder ini kosong"}
            </p>
            {!query && <p style={{ margin: 0, fontSize: 12, color: MUTED }}>Unggah file untuk mulai.</p>}
          </div>
        ) : (
          visibleFiles.map((f, i) => (
            <div
              key={f.id}
              style={{
                ...rowStyle,
                borderBottom: i === visibleFiles.length - 1 ? "none" : `1px solid ${BORDER_SOFT}`,
              }}
            >
              <input
                type="checkbox"
                checked={selected.has(f.id)}
                onChange={() => toggleOne(f.id)}
                style={{ width: 16, height: 16, accentColor: ACCENT, flexShrink: 0 }}
              />
              {(f.mime_type || "").startsWith("image/") ? (
                <IconImage style={{ color: MUTED, flexShrink: 0 }} />
              ) : (
                <IconFile style={{ color: MUTED, flexShrink: 0 }} />
              )}
              <a href={`/f/${f.id}`} style={{ flex: 1, minWidth: 0, textDecoration: "none", color: TEXT }}>
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-mono)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {f.original_name}
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{formatDate(f.created_at)}</div>
              </a>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: MUTED,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {formatSize(f.size)}
              </div>
            </div>
          ))
        )}
      </div>

      {error && <p style={{ color: DANGER, fontSize: 13, marginTop: 12 }}>{error}</p>}

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button onClick={() => fileInputRef.current?.click()} style={uploadButtonStyle}>
          <IconUpload />
          Unggah file
        </button>
        <input ref={fileInputRef} type="file" multiple onChange={handleFilesPicked} style={{ display: "none" }} />
      </div>

      {shareOpen && (
        <div style={overlayStyle} onClick={() => setShareOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>Bagikan — root</h2>
              <button onClick={() => setShareOpen(false)} style={iconButtonStyle} aria-label="Tutup">
                <IconX />
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                readOnly
                value={shareLink}
                style={{
                  flex: 1,
                  background: PANEL,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: TEXT,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <button
                onClick={copyLink}
                style={{ ...textButtonStyle, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px" }}
              >
                {copyLabel}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                paddingTop: 16,
                borderTop: `1px solid ${BORDER_SOFT}`,
              }}
            >
              <div>
                <div style={{ fontSize: 14, marginBottom: 4 }}>Publik</div>
                <div style={{ fontSize: 12, color: MUTED, maxWidth: 280 }}>
                  {isPublic
                    ? "Siapa pun dengan link ini bisa melihat dan mengunduh isi folder."
                    : "Hanya kamu yang bisa membuka folder ini."}
                </div>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: 40, height: 22, flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={togglePublic}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isPublic ? ACCENT : BORDER,
                    borderRadius: 999,
                    transition: "background 0.2s",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: isPublic ? 21 : 3,
                    width: 16,
                    height: 16,
                    background: "#000",
                    borderRadius: "50%",
                    transition: "left 0.2s",
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </main>
  );
        }
