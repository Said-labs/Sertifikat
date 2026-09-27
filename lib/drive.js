export function extractDriveId(url) {
  if (!url) return "";
  const m1 = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (m1) return m1[1];
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m2) return m2[1];
  return "";
}

export function thumbUrl(id, size = 600) {
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}` : "";
}

export function altThumbUrl(id, size = 600) {
  return id ? `https://lh3.googleusercontent.com/d/${id}=w${size}` : "";
}

export function viewUrl(id) {
  return id ? `https://drive.google.com/file/d/${id}/view` : "#";
}

export function downloadUrl(id) {
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : "#";
}

export function embedUrl(id) {
  return id ? `https://drive.google.com/file/d/${id}/preview` : "";
}

export function fmtDate(iso) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return iso;
  }
}


export function fmtDateTime(iso, time) {
  try {
    const d = new Date(iso + "T00:00:00");
    const s = d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return time ? `${s} • ${time}` : s;
  } catch (e) {
    return iso;
  }
}


export function shareLinks(url, text) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return {
    wa: `https://wa.me/?text=${t}%20${u}`,
    fb: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    tg: `https://t.me/share/url?url=${u}&text=${t}`,
  };
}

function svgToDataUri(svg) {
  const b64 =
    typeof window !== "undefined"
      ? btoa(unescape(encodeURIComponent(svg)))
      : Buffer.from(svg).toString("base64");
  return "data:image/svg+xml;base64," + b64;
}

// Metadata tampilan (ikon + warna) untuk tiap jenis sumber file.
const TYPE_META = {
  "drive-image": { emoji: "🖼️", label: "Google Drive", c1: "#3654e0", c2: "#8b3bea" },
  image: { emoji: "🖼️", label: "Gambar", c1: "#3654e0", c2: "#8b3bea" },
  vector: { emoji: "🔺", label: "Vector (SVG)", c1: "#0d9488", c2: "#065f46" },
  pdf: { emoji: "📄", label: "PDF", c1: "#e53e3e", c2: "#9b2c2c" },
  doc: { emoji: "📝", label: "Word / Docs", c1: "#2b6cb0", c2: "#1e3a8a" },
  notion: { emoji: "🗒️", label: "Notion", c1: "#4a5568", c2: "#1a202c" },
  linkedin: { emoji: "💼", label: "LinkedIn", c1: "#0a66c2", c2: "#004182" },
  credly: { emoji: "🏅", label: "Credly", c1: "#f6a623", c2: "#b45309" },
  link: { emoji: "🔗", label: "Link", c1: "#6b7280", c2: "#374151" },
  none: { emoji: "❔", label: "Tidak ada file", c1: "#9ca3af", c2: "#4b5563" },
};



export function mediaIcon(type, title) {
  const meta = TYPE_META[type] || TYPE_META.link;
  const t = (title || "Sertifikat").slice(0, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${meta.c1}"/><stop offset="1" stop-color="${meta.c2}"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="40%" font-size="46" text-anchor="middle" dominant-baseline="middle">${meta.emoji}</text>
    <text x="50%" y="60%" fill="#fff" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${meta.label}</text>
    <text x="50%" y="75%" fill="#ffffffcc" font-family="sans-serif" font-size="12" text-anchor="middle" dominant-baseline="middle">${t}</text>
  </svg>`;
  return svgToDataUri(svg);
}


export function placeholderSVG(title) {
  return mediaIcon("link", title);
}


export function resolveMedia(url) {
  if (!url) return { type: "none", thumb: "", thumbLarge: "", view: "#", download: "#" };
  const u = String(url).trim();

  const driveId = extractDriveId(u);
  if (driveId) {
    return {
      type: "drive-image",
      thumb: altThumbUrl(driveId, 600),
      thumbLarge: altThumbUrl(driveId, 1400),
      // Dicoba berurutan di komponen: kalau sumber pertama gagal dimuat,
      // otomatis lanjut ke sumber berikutnya sebelum jatuh ke ikon.
      thumbCandidates: [altThumbUrl(driveId, 600), thumbUrl(driveId, 600)],
      thumbLargeCandidates: [altThumbUrl(driveId, 1400), thumbUrl(driveId, 1400)],
      embed: embedUrl(driveId),
      view: viewUrl(driveId),
      download: downloadUrl(driveId),
    };
  }
  if (/\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(u)) {
    return { type: "image", thumb: u, thumbLarge: u, view: u, download: u };
  }
  if (/\.svg(\?.*)?$/i.test(u)) {
    return { type: "vector", thumb: u, thumbLarge: u, view: u, download: u };
  }
  if (/\.pdf(\?.*)?$/i.test(u)) {
    return { type: "pdf", thumb: "", thumbLarge: "", view: u, download: u };
  }
  if (/docs\.google\.com\/document/i.test(u) || /\.docx?(\?.*)?$/i.test(u)) {
    return { type: "doc", thumb: "", thumbLarge: "", view: u, download: u };
  }
  if (/notion\.so|notion\.site/i.test(u)) {
    return { type: "notion", thumb: "", thumbLarge: "", view: u, download: u };
  }
  if (/linkedin\.com/i.test(u)) {
    return { type: "linkedin", thumb: "", thumbLarge: "", view: u, download: u };
  }
  if (/credly\.com/i.test(u)) {
    return { type: "credly", thumb: "", thumbLarge: "", view: u, download: u };
  }
  return { type: "link", thumb: "", thumbLarge: "", view: u, download: u };
}


export function actionLabel(type) {
  if (["drive-image", "image", "vector", "pdf", "doc"].includes(type)) return "⬇ Unduh";
  return "↗ Buka Link";
}