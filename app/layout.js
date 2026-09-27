import "./globals.css";

export const metadata = {
  title: "Galeri Sertifikat & Kegiatan",
  description: "Galeri sertifikat dan dokumentasi kegiatan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#f4f6fb] text-[#161a23] font-sans">{children}</body>
    </html>
  );
}