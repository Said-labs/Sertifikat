"use client";
import { useMemo } from "react";

const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export default function DateFilter({ data, day, month, year, onChange }) {
  const years = useMemo(
    () => Array.from(new Set(data.map((d) => Number(d.date.slice(0, 4))))).sort((a, b) => b - a),
    [data]
  );
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const hasSelection = day !== "Semua" || month !== "Semua" || year !== "Semua";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={day}
        onChange={(e) => onChange({ day: e.target.value, month, year })}
        className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600"
      >
        <option value="Semua">Tanggal</option>
        {days.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={month}
        onChange={(e) => onChange({ day, month: e.target.value, year })}
        className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600"
      >
        <option value="Semua">Bulan</option>
        {BULAN.map((b, i) => (
          <option key={b} value={i}>{b}</option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => onChange({ day, month, year: e.target.value })}
        className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600"
      >
        <option value="Semua">Tahun</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {hasSelection && (
        <button
          onClick={() => onChange({ day: "Semua", month: "Semua", year: "Semua" })}
          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
        >
          Reset
        </button>
      )}
    </div>
  );
}