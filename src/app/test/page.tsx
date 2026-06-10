"use client";

import Link from "next/link";
import { Play, LayoutGrid } from "lucide-react";

const TEST_SCENES = [
  { slug: "lockscreen", title: "Scene 1: Lock Screen", desc: "Tampilan kunci aesthetic dengan input passcode tanggal anniversary." },
  { slug: "cakecandle", title: "Scene 2: Birthday Cake", desc: "Kue ulang tahun interaktif dengan lilin tiup & sensor mic/klik." },
  { slug: "loveletter", title: "Scene 3: Love Letter", desc: "Surat cinta interaktif dengan animasi ketikan dan amplop." },
  { slug: "vhschat", title: "Scene 4: VHS Chat Replay", desc: "Replay chat ala kaset VHS retro retro dengan scroll otomatis." },
  { slug: "lovetimeline", title: "Scene 5: Scrapbook Timeline", desc: "Scrapbook 3D dengan transisi balik buku dan pre-loading gambar." },
  { slug: "cassette", title: "Scene 6: Cassette Wall", desc: "Dinding kaset audio retro dengan pemutar suara terintegrasi." },
  { slug: "photobooth", title: "Scene 7: Korean Photobooth", desc: "Bingkai foto 4-cut ala Korea dengan filter dan sticker lucu." },
  { slug: "sweetquiz", title: "Scene 8: Relationship Quiz", desc: "Kuis trivia manis tentang hubungan untuk menguji ingatan bersama." },
  { slug: "matchgames", title: "Scene 9: Memory Match Game", desc: "Game mencocokkan kartu foto/momen romantis berdua." },
  { slug: "wishingwell", title: "Scene 10: Wishing Well & Garden", desc: "Taman bunga virtual tempat menanam harapan/doa bersama." },
  { slug: "endingcredits", title: "Scene 11: Ending Credits", desc: "Teks kredit bergulir ala film bioskop sebagai penutup." },
];

export default function TestDashboard() {
  return (
    <main className="relative min-h-screen w-full overflow-y-auto py-16 px-4 md:px-12 select-none">

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-2 text-pink-400 font-mono text-xs uppercase tracking-widest font-bold">
            <LayoutGrid size={14} />
            <span>Developer Sandbox</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white font-bold tracking-wide">
            Component Playground
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Selamat datang di halaman pengujian komponen! Di sini Anda dapat membuka dan menguji setiap scene secara terpisah tanpa harus mengikuti alur dari awal.
          </p>
        </div>

        {/* Home Link */}
        <Link
          href="/"
          className="self-start flex items-center gap-2 bg-gradient-to-r from-pink-500 to-[#A64D79] text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 text-xs"
        >
          <span>← Buka Aplikasi Utama (Flow Lengkap)</span>
        </Link>

        {/* Grid Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {TEST_SCENES.map((scene, index) => (
            <Link 
              key={index}
              href={`/test/${scene.slug}`}
              className="group bg-zinc-900/40 border border-zinc-800 hover:border-pink-500/40 p-5 rounded-2xl backdrop-blur-md shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-pink-500/5 cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">
                  Test Route: /test/{scene.slug}
                </span>
                <h3 className="text-base font-sans font-bold text-white group-hover:text-pink-300 transition-colors">
                  {scene.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                  {scene.desc}
                </p>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-pink-400 group-hover:text-pink-300 font-semibold mt-5 self-end">
                <span>Mulai Uji</span>
                <Play size={12} className="fill-pink-400 group-hover:fill-pink-300 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
