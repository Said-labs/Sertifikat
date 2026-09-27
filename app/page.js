"use client";
import { useState, useMemo } from "react";
import { certificates } from "@/data/certificates";
import CertificateCard from "@/components/CertificateCard";
import CertificateModal from "@/components/CertificateModal";
import DateFilter from "@/components/DateFilter";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [dateFilter, setDateFilter] = useState({ day: "Semua", month: "Semua", year: "Semua" });
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const categories = useMemo(
    () => ["Semua", ...new Set(certificates.map((d) => d.category))],
    []
  );

  const byCategory = useMemo(() => {
    const map = {};
    certificates.forEach((d) => { map[d.category] = (map[d.category] || 0) + 1; });
    return map;
  }, []);

  const list = useMemo(() => {
    let result = [...certificates].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (activeCategory !== "Semua") result = result.filter((d) => d.category === activeCategory);

    const { day, month, year } = dateFilter;
    result = result.filter((d) => {
      const [y, m, dd] = d.date.split("-").map(Number);
      if (year !== "Semua" && y !== Number(year)) return false;
      if (month !== "Semua" && m - 1 !== Number(month)) return false;
      if (day !== "Semua" && dd !== Number(day)) return false;
      return true;
    });

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.title.toLowerCase().includes(q) || d.location.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, dateFilter, search]);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8">
      <header className="mb-6 flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-accent to-accent2" />
        <h1 className="text-lg font-extrabold sm:text-xl">Galeri Sertifikat </h1>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="bg-gradient-to-br from-accent to-accent2 bg-clip-text text-3xl font-extrabold text-transparent">
            {certificates.length}
          </div>
          <div className="mt-1 text-xs text-gray-500">Total Sertifikat</div>
        </div>
        {Object.entries(byCategory).map(([cat, n]) => (
          <div key={cat} className="rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-gradient-to-br from-accent to-accent2 bg-clip-text text-3xl font-extrabold text-transparent">
              {n}
            </div>
            <div className="mt-1 text-xs text-gray-500">{cat}</div>
          </div>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
              activeCategory === c
                ? "border-accent bg-accent text-white"
                : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul atau lokasi..."
          className="w-full max-w-xs rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none"
        />
        <DateFilter data={certificates} {...dateFilter} onChange={setDateFilter} />
      </div>

      {list.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400">Tidak ada kegiatan yang cocok.</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 sm:gap-5">
          {list.map((item, i) => (
            <CertificateCard key={item.id} item={item} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>
      )}

      <CertificateModal
        list={list}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </main>
  );
}