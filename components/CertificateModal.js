"use client";
import { useEffect, useState } from "react";
import { resolveMedia, mediaIcon, fmtDateTime, actionLabel, shareLinks } from "@/lib/drive";

export default function CertificateModal({ list = [], index, onClose, onNavigate }) {
  const [toast, setToast] = useState("");
  const [zoom, setZoom] = useState(100);
  const [bright, setBright] = useState(100);

  const item = index != null ? list[index] : null;

  useEffect(() => {
    setZoom(100);
    setBright(100);
  }, [index]);

  if (!item) return null;

  const media = resolveMedia(item.fileUrl);
  const hasEmbed = media.type === "drive-image" && media.embed;
  const isVisual = ["image", "vector"].includes(media.type);

  const goPrev = () => onNavigate((index - 1 + list.length) % list.length);
  const goNext = () => onNavigate((index + 1) % list.length);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const handlePrimaryAction = () => {
    if (media.download === "#") {
      showToast("Tidak ada file untuk item ini");
      return;
    }
    window.open(media.download, "_blank");
  };

  const handleShare = (platform) => {
    const url = media.view !== "#" ? media.view : typeof window !== "undefined" ? window.location.href : "";
    const links = shareLinks(url, item.title);
    window.open(links[platform], "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    const link = media.view !== "#" ? media.view : window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      showToast("Link disalin!");
    } catch (e) {
      showToast("Gagal menyalin link");
    }
  };

  const tags = [item.category, item.publisher].filter(Boolean).map((t) => `#${t.replace(/\s+/g, "")}`);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5">
        <span className="text-sm font-semibold text-white/70">Detail Sertifikat</span>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
  
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-black">
          {list.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/25 sm:left-4"
              >
                ‹
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/25 sm:right-4"
              >
                ›
              </button>
            </>
          )}

          <div className="flex flex-1 items-center justify-center overflow-hidden px-4">
            {hasEmbed ? (
              <iframe
                src={media.embed}
                title={item.title}
                className="h-full w-full max-w-3xl"
                allow="autoplay"
              />
            ) : (
           
              <img
                src={isVisual ? media.thumbLarge || media.thumb : mediaIcon(media.type, item.title)}
                alt={item.title}
                style={{ transform: `scale(${zoom / 100})`, filter: `brightness(${bright}%)` }}
                className="max-h-full max-w-full object-contain transition-transform duration-150"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = mediaIcon(media.type, item.title);
                }}
              />
            )}
          </div>

          {!hasEmbed && (
            <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-4 px-4 pb-4 text-xs text-white/70">
              <label className="flex items-center gap-2">
                Zoom
                <input type="range" min="50" max="250" value={zoom} onChange={(e) => setZoom(+e.target.value)} />
              </label>
              <label className="flex items-center gap-2">
                Kecerahan
                <input type="range" min="30" max="200" value={bright} onChange={(e) => setBright(+e.target.value)} />
              </label>
              <button
                onClick={() => { setZoom(100); setBright(100); }}
                className="rounded-full border border-white/25 px-3 py-1 font-semibold text-white transition hover:bg-white/10"
              >
                Reset tampilan
              </button>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="flex w-full flex-col gap-4 overflow-y-auto border-t border-white/10 bg-[#141414] p-6 md:w-[380px] md:border-l md:border-t-0">
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-accent2">
            {fmtDateTime(item.date, item.time)}
          </span>
          <h2 className="text-2xl font-extrabold leading-tight">{item.title}</h2>
          <p className="text-sm leading-relaxed text-white/55">{item.desc || "-"}</p>

          <div className="flex flex-col gap-2 rounded-xl bg-white/5 p-3.5 text-sm text-white/80">
            <div className="flex gap-2"><b className="min-w-[78px] text-white/40">Lokasi</b><span>{item.location || "-"}</span></div>
            <div className="flex gap-2"><b className="min-w-[78px] text-white/40">Penerbit</b><span>{item.publisher || "-"}</span></div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Bagikan</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleCopy} className="rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold transition hover:bg-white/20">🔗 Salin</button>
              <button onClick={() => handleShare("wa")} className="rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold transition hover:bg-white/20">WA</button>
              <button onClick={() => handleShare("fb")} className="rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold transition hover:bg-white/20">FB</button>
              <button onClick={() => handleShare("x")} className="rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold transition hover:bg-white/20">X</button>
              <button onClick={() => handleShare("tg")} className="rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold transition hover:bg-white/20">TG</button>
            </div>
          </div>

          <button
            onClick={handlePrimaryAction}
            className="mt-auto rounded-xl bg-gradient-to-br from-accent to-accent2 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            {actionLabel(media.type)}
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900">
          {toast}
        </div>
      )}
    </div>
  );
}