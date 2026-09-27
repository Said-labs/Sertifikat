"use client";
import { useState } from "react";
import { resolveMedia, mediaIcon, fmtDate } from "@/lib/drive";

export default function CertificateCard({ item, index, onOpen }) {
  const media = resolveMedia(item.fileUrl);
  const candidates = media.thumbCandidates?.length
    ? media.thumbCandidates
    : media.thumb
    ? [media.thumb]
    : [];
  const [step, setStep] = useState(0);
  const img = candidates[step] || mediaIcon(media.type, item.title);

  return (
    <div
      onClick={() => onOpen(item)}
      style={{ animationDelay: `${index * 0.04}s` }}
      className="animate-rise cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-xl"
    >
      {/* Foto — tidak ada teks menutupi, kelihatan penuh */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
          {item.category}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          onError={() => setStep((s) => s + 1)}
        />
      </div>

    
      <div className="p-3.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">
          {item.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
          📅 {fmtDate(item.date)}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          📍 {item.location}
        </div>
      </div>
    </div>
  );
}