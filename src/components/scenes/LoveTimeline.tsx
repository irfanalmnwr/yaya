"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Heart, MapPin, Sparkles, Headphones, Coffee, ChevronLeft, ChevronRight, BookOpen, Music } from "lucide-react";

interface LoveTimelineProps {
  onProceed: () => void;
}

// ========================================================
// PAGES CONFIGURATION ARRAY
// Kamu bisa menambah, menghapus, atau mengedit foto/halaman di sini dengan mudah.
// PENTING: Jumlah item halaman HARUS genap agar susunan kiri-kanan buku pas!
// ========================================================
const PAGES_CONFIG = [
  {
    type: "cover",
    title: "Our Story",
    subTitle: "Yaya & Her Love",
  },
  {
    type: "counter",
    title: "Cerita Kecil Kita ✨",
    description: "Hari-hari bareng kamu itu selalu jadi bagian terfavorit di hidup aku. Ini scrapbook kecil kita catatan visual tentang tawa, obrolan random, dan semua hal manis yang udah kita laluin bareng.",
  },
  {
    type: "photo",
    title: "Awal Mula Cerita Kita 💖",
    description: "Awalnya cuma dari game yang kita mainin, sampe akhirnya kita bisa ketemu. ga nyangka siihh yang dulu cuma berandai-andai waktu smp sampe akhirnya bisa ketemu berdua dan jalan bareng.",
    caption: "Pertama Kali Ketemu Kamu",
    image: "/assets/scrappbook/Gambar 1.jpg",
    image2: "/assets/scrappbook/Gsmbar 1.1.jpg",
    location: "Awal Cerita Kita",
    washiTape: "🌸 🌸 🌸",
    washiColor: "bg-pink-300/40 border-pink-400/25",
    washiTextColor: "text-pink-800/60"
  },
  {
    type: "photo",
    title: "Yup Aku kenalin kamu ke keluarga ku",
    description: "Aku disini deg-degan banget, ini kaya kesempatan terakhir ku buat ngenalin seseorang yang aku sayang ke keluarga ku. Untungnya kamu berani dateng Makasiiii ya sayang",
    caption: "Hari TerDeg-degan",
    image: "/assets/scrappbook/Gamabr 2.jpg",
    location: "Rumah Aku",
    washiTape: "⭐ ⭐ ⭐",
    washiColor: "bg-yellow-200/40 border-yellow-300/25",
    washiTextColor: "text-yellow-800/60"
  },
  {
    type: "photo",
    title: "Hari Kerja Pertama Kamu 💼",
    description: "Ini hari pertama kamu mulai bekerja! Aku inget banget senengnya aku liat kamu akhirnya bisa kerja, kamu usaha banget buat bisa kerja, dan akhirnya kamu berhasil dapet kerja, aku bangga sama kamu. Semoga karir kamu makin sukses dan cemerlang ya sayang, aku selalu mendukungmu!",
    caption: "Momen Pertama Kali Kerja",
    image: "/assets/scrappbook/Kerja.jpeg",
    location: "Kantor Baru",
    washiTape: "💼 ✨ 💼",
    washiColor: "bg-indigo-200/40 border-indigo-300/25",
    washiTextColor: "text-indigo-850/60",
    objectPosition: "object-top"
  },
  {
    type: "photo",
    title: "Mam Shusi Bareng",
    description: "Makan sushi pertama kalinya sama kamu dan pertama kalinya buat aku bareng pasangan kuuu wkwkwkwk",
    caption: "Pertama kali mam shusi bareng",
    image: "/assets/scrappbook/Gambar 3.jpg",
    location: "GGP Mall",
    washiTape: "✨ ✨ ✨",
    washiColor: "bg-blue-200/40 border-blue-300/25",
    washiTextColor: "text-blue-800/60"
  },
  {
    type: "photo",
    title: "Niatnya foto wisuda biasa",
    description: "Niatnya foto wisuda biasa, tapi hasilnya malah kayak pasangan yang lagi foto prewedding. Entah karena suasananya, entah karena kamu yang selalu berhasil bikin setiap momen terasa lebih spesial.",
    caption: "Wisuda Rasa Prewedding",
    image: "/assets/scrappbook/Gambar 4.jpg",
    location: "ICE BSD Tanggerang",
    washiTape: "☕ ☕ ☕",
    washiColor: "bg-amber-200/40 border-amber-300/25",
    washiTextColor: "text-amber-800/60"
  },
  {
    type: "photo",
    title: "Konser Pertama Kita 🎶",
   description: "Aku sempat lupa beberapa lagu yang dibawakan malam itu, tapi aku nggak akan pernah lupa rasanya bisa bernyanyi, tertawa, dan menikmati konser pertamaku bersamamu.",
    caption: "Nada yang Jadi Kenangan",
    image: "/assets/scrappbook/Gambar 5.jpg",
    location: "Synchronize Festival",
    washiTape: "💝 💝 💝",
    washiColor: "bg-red-200/40 border-red-300/25",
    washiTextColor: "text-red-800/60"
  },
{
  type: "photo",
  title: "Bandung Favoritku 💕",
  description: "Kalau ada yang bertanya apa momen favoritku bersama kamu, Bandung pasti masuk dalam daftar teratas. Tiga hari pertama kita benar-benar menghabiskan waktu berdua sebagai pasangan. Entah karena suasana kotanya yang romantis atau karena memang segala hal terasa lebih indah saat bersamamu. Yang jelas, dari semua tempat yang kita kunjungi, kenangan paling berharga tetaplah kebersamaan kita di sana.",
  caption: "Tiga Hari yang Tak Terlupakan",
  image: "/assets/scrappbook/Gambar 6.jpg",
  image2: "/assets/scrappbook/Gambar 6.1.jpg",
  location: "Bandung, Jawa Barat",
  washiTape: "🌈 🌈 🌈",
  washiColor: "bg-teal-200/40 border-teal-300/25",
  washiTextColor: "text-teal-850/60"
},
 {
  type: "photo",
  title: "Valentine Telat Dikit ❤️",
  description: "Valentine kali ini terasa berbeda karena ada kamu di sisiku. Tidak perlu hadiah yang mewah atau perayaan yang berlebihan, karena menghabiskan waktu bersamamu saja sudah lebih dari cukup. Hari itu menjadi pengingat bahwa kebahagiaan sering kali hadir dalam bentuk sederhana: tawa, cerita, dan kebersamaan dengan orang yang kita sayangi.",
  caption: "Hari Kasih Sayang Kita",
  image: "/assets/scrappbook/Gambar 7.jpg",
  location: "14 Februari Bersamamu",
  washiTape: "❤️ 🌹 ❤️",
  washiColor: "bg-green-200/40 border-green-300/25",
  washiTextColor: "text-green-800/60"
},
  {
    type: "photo",
    title: "Foto Berdua Sama Mamaku",
    description: "Dulu kamu pernah kasih Mama kejutan yang bikin semuanya terasa hangat dan spesial. Sekarang gantian aku yang mau kasih kejutan buat kamu. Walaupun sedikit kebongkar sebelum waktunya, semoga rasa sayang dan usaha kecil ini tetap bisa bikin kamu tersenyum. Karena buatku, melihat kamu bahagia itu selalu jadi bagian terbaik dari setiap momen.",
    caption: "Gantian Kamu Sekarang",
    image: "/assets/scrappbook/Gambar 8.jpg",
    location: "Rumahku",
    washiTape: "🍕 🍕 🍕",
    washiColor: "bg-orange-200/40 border-orange-300/25",
    washiTextColor: "text-orange-800/60"
  },
{
  type: "photo",
  title: "Buka Puasa Bersama 🌙",
  description: "Salah satu hal yang paling aku tunggu selama Ramadan adalah momen berbuka bersama kamu. Duduk satu meja, berbagi cerita setelah seharian beraktivitas, dan menikmati waktu sederhana yang entah kenapa selalu terasa begitu hangat. Mungkin makanannya akan terlupa, tapi kebersamaan kita di hari itu akan selalu aku ingat.",
  caption: "Ramadan Mubarak",
  image: "/assets/scrappbook/Gambar 9.jpg",
  image2: "/assets/scrappbook/Gambar 9.1.jpg",
  location: "Meja Buka Puasa Kita",
  washiTape: "🌙 ✨ 🌙",
  washiColor: "bg-pink-200/40 border-pink-300/25",
  washiTextColor: "text-pink-850/60"
},
{
  type: "photo",
  title: "Hari yang Bikin Aku Panik 🥺",
  description: "Ini mungkin bukan momen yang lucu atau romantis seperti yang lain, tapi justru jadi salah satu yang paling membekas buatku. Waktu itu kamu teelepon dan bilang udah nggak kuat, minta aku jemput. Jujur, saat itu aku langsung panik dan nggak kepikiran apa-apa selain nyusul kamu. Melihat kamu lemes sampai akhirnya harus ke rumah sakit dan diinfus benar-benar bikin aku khawatir. Semoga ke depannya kamu lebih menjaga diri, jangan terlalu memaksakan diri kalau memang sudah lelah. Karena ada banyak orang yang sayang dan khawatir sama kamu, termasuk aku.",
  caption: "Aku Khawatir, Karena Aku Sayang",
  image: "/assets/scrappbook/Gambar 10.jpg",
  location: "Hari yang Membuatku Panik",
  washiTape: "🤍 🤍 🤍",
  washiColor: "bg-yellow-250/40 border-yellow-300/25",
  washiTextColor: "text-yellow-800/60"
},
{
  type: "photo",
  title: "Random Tapi Berkesan 📸",
  description: "Lucunya, momen ini sebenarnya nggak direncanain sama sekali. Habis pulang kerja dan seperti biasa kita sempat bingung mau ke mana. Tapi entah gimana, ujung-ujungnya malah berakhir di sini dan jadi salah satu kenangan yang masih sering aku inget sampai sekarang. Mungkin karena semuanya serba random, atau mungkin karena setiap momen sederhana bakal selalu punya cerita kalau dijalaninnya bareng kamu.",
  caption: "Random yang Jadi Kenangan",
  image: "/assets/scrappbook/Gambar 11.jpg",
  location: "Sepulang Kerja Bersamamu",
  washiTape: "📷 📷 📷",
  washiColor: "bg-zinc-200/40 border-zinc-300/25",
  washiTextColor: "text-zinc-800/60"
},
{
  type: "photo",
  title: "Transum Date Pertama 🚆🍦",
  description: "Awalnya kita emang udah ada rencana buat main, tapi seperti biasa bingung mau ke mana. Setelah muter-muter mikir, akhirnya kita memutuskan buat naik transportasi umum dan jalan tanpa tujuan yang terlalu pasti. Lucunya, ini juga jadi pertama kalinya aku benar-benar pergi ngedate naik transum begini. Ternyata seru juga ya, dari nunggu kendaraan, pindah-pindah halte, sampai capek bareng. Yang awalnya cuma cari kegiatan malah jadi salah satu momen yang cukup aku inget sampai sekarang.",
  caption: "Transum Date Pertama Kita",
  image: "/assets/scrappbook/Gambar 12.jpg",
  location: "Jakarta dan Ceritanya",
  washiTape: "🚆 🍦 🚆",
  washiColor: "bg-cyan-200/40 border-cyan-300/25",
  washiTextColor: "text-cyan-850/60"
},
{
  type: "photo",
  title: "Jadi Bagian dari Ceritamu 🤍",
  description: "Momen ini selalu punya tempat spesial di hatiku. Karena di hari itu, kamu memperkenalkan aku ke keluarga Mama. Jujur, aku cukup gugup, takut salah ngomong, takut nggak bisa memberikan kesan yang baik. Tapi di saat yang sama, aku juga merasa sangat dihargai karena kamu memilih untuk mengenalkan aku ke orang-orang yang penting dalam hidupmu. Makasih ya sayang, karena sudah memberi aku kesempatan untuk menjadi bagian dari cerita dan keluargamu. Itu adalah salah satu hal yang nggak akan pernah aku lupakan.",
  caption: "Terima Kasih Sudah Mengenalkanku",
  image: "/assets/scrappbook/Gambar 13.jpg",
  location: "Bersama Keluarga Kamu",
  washiTape: "🤍 🏡 🤍",
  washiColor: "bg-purple-200/40 border-purple-300/25",
  washiTextColor: "text-purple-800/60"
},
{
  type: "photo",
  title: "Jogja dan Cerita Baru ✈️💙",
  description: "Baru bulan kemarin kita jalan bareng ke Jogja, dan jujur rasanya lebih ramai dari Bandung. Empat hari yang penuh cerita, pengalaman baru, tempat-tempat baru, dan tentunya banyak waktu yang bisa kita habiskan berdua. Ada capeknya, ada bingungnya, ada momen lucunya, tapi justru itu yang bikin perjalanan ini jadi berkesan. Dari semua yang kita lakukan di sana, yang paling aku suka adalah fakta bahwa aku bisa membagikan semuanya bersamamu. Semoga ini bukan perjalanan terakhir kita. Semoga setelah ini kita bisa pelan-pelan muterin Indonesia bareng, bikin lebih banyak cerita di kota-kota yang belum pernah kita datangi, dan suatu hari nanti lanjut bikin kenangan sampai ke luar negeri juga. ❤️",
  caption: "Empat Hari, Ribuan Cerita",
  image: "/assets/scrappbook/Gambar 15.jpg",
  image2: "/assets/scrappbook/Gambar 14.jpg",
  location: "Yogyakarta, Indonesia",
  washiTape: "✈️ 🌏 ❤️",
  washiColor: "bg-indigo-200/40 border-indigo-300/25",
  washiTextColor: "text-indigo-850/60"
},
{
  type: "letter",
  title: "Janji & Harapan Esok Hari",
  letterText: "Sayangggggku,\n\nKalau dipikir-pikir, semua foto di album ini cuma menangkap beberapa detik dari perjalanan kita. Tapi di balik setiap foto ada cerita, tawa, perjalanan, kejutan, pelukan, kekhawatiran, dan begitu banyak kenangan yang sudah kita lewati bersama.\n\nAku berharap album ini nggak berhenti sampai di sini. Semoga nanti akan ada banyak foto baru yang memenuhi halaman-halaman berikutnya. Foto perjalanan kita ke kota-kota yang belum pernah kita datangi, foto saat meraih mimpi-mimpi kita, foto momen-momen sederhana yang ternyata jadi kenangan berharga, sampai foto keluarga kecil yang selama ini kita impikan.\n\nSemoga kita terus diberi waktu untuk membuat lebih banyak cerita, lebih banyak kenangan, dan lebih banyak alasan untuk tersenyum bersama.\n\nTerima kasih sudah hadir dan menjadi bagian dari perjalanan hidupku. Aku selalu bersyukur karena dari sekian banyak orang di dunia ini, aku dipertemukan dengan kamu.\n\nAku sayang kamu hari ini, besok, dan di setiap halaman baru yang akan kita isi bersama.\n\nSampai album ini penuh oleh cerita kita... dan suatu hari nanti, oleh cerita anak-anak kita juga. ❤️"
}
];

// ========================================================
// SCENE PAGE CONTENT RENDERER
// ========================================================
interface PageContentProps {
  page: typeof PAGES_CONFIG[number];
  isLeft: boolean;
  isMobile: boolean;
  duration: { days: number; hours: number; mins: number; secs: number };
  onProceed: () => void;
  playChime: () => void;
}

const PageContent = ({ page, isLeft, isMobile, duration, onProceed, playChime }: PageContentProps) => {
  const cursiveStyle = { fontFamily: "var(--font-cursive)" };
  const serifStyle = { fontFamily: "var(--font-serif)" };

  switch (page.type) {
    case "cover":
      return (
        <div className="flex flex-col justify-center items-center h-full p-8 select-none text-center">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-300/20 rounded-full blur-md pointer-events-none" />
          <div className="absolute top-8 left-8 w-24 h-5 bg-pink-200/20 border border-pink-300/10 rotate-12" />
          <div className="absolute bottom-8 right-8 w-24 h-5 bg-pink-200/20 border border-pink-300/10 -rotate-12" />
          
          <div className="bg-[#fcfaf5] px-8 py-10 rounded-lg shadow-lg border border-pink-200/20 flex flex-col items-center max-w-[300px] text-center rotate-[-1deg]">
            <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 font-bold mb-2">Album</span>
            <h1 style={cursiveStyle} className="text-4xl text-zinc-800 font-normal leading-tight mb-2">
              {page.title}
            </h1>
            <div className="w-12 h-px bg-pink-300 my-2" />
            <p className="text-[10px] font-sans text-zinc-500 font-medium">{page.subTitle}</p>
          </div>

          <div className="absolute bottom-10 flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[#fcfaf5] text-[#A64D79] flex items-center justify-center shadow-md animate-bounce hover:scale-105 transition-transform duration-300 border border-pink-200/30">
              <Heart size={16} className="fill-[#A64D79] text-[#A64D79]" />
            </div>
            <span className="text-[9px] uppercase font-mono text-pink-200/80 tracking-widest font-bold">
              Klik untuk membuka
            </span>
          </div>
        </div>
      );

    case "counter":
      return (
        <div className="flex flex-col h-full text-left justify-between py-2">
          <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-[#8c5a6b] font-bold mb-2">
            <Heart size={11} className="text-pink-500 fill-pink-500/20" />
            <span>Sejak Hari Pertama Bertemu</span>
          </div>

          <h3 className="text-xl font-serif font-bold text-zinc-900 tracking-wide leading-tight mb-3">
            {page.title}
          </h3>
          <p className="text-[11px] md:text-[12px] leading-relaxed text-zinc-600 font-sans mb-4 select-none">
            {page.description}
          </p>

          <div 
            className="relative w-full bg-gradient-to-br from-[#fffdf0] to-[#fffbc7] border border-[#e6de95] p-5 rounded-md shadow-md flex flex-col justify-center items-center mt-auto mb-2 text-center"
            style={{ transform: "rotate(1.5deg)" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-pink-400/20 backdrop-blur-sm shadow-sm" />
            
            <div className="flex items-center gap-1.5 mb-3 select-none">
              <Heart size={11} className="text-pink-600 fill-pink-600 animate-pulse" />
              <span className="text-[8px] uppercase font-mono tracking-[0.15em] text-zinc-700 font-bold">
                Waktu Bersama
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 w-full">
              {[
                { label: "Hari", value: duration.days },
                { label: "Jam", value: duration.hours },
                { label: "Meni", value: duration.mins },
                { label: "Deti", value: duration.secs },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center bg-[#fcf9d4]/60 border border-[#e0d680]/30 rounded-lg py-2">
                  <span className="text-lg font-mono font-bold text-zinc-800">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[7.5px] text-zinc-500 uppercase tracking-widest mt-0.5 font-sans font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "photo":
      return (
        <div className="flex flex-col h-full text-left justify-between py-1">
          <div 
            className="bg-[#f7f6f0] p-2 pb-4 md:p-3 md:pb-6 rounded shadow-md border border-zinc-200/80 mb-2 md:mb-3 relative flex flex-col"
            style={{ transform: isLeft ? "rotate(2deg)" : "rotate(-1.5deg)" }}
          >
            {page.washiTape && (
              <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-4.5 ${page.washiColor || "bg-pink-300/40 border-pink-400/25"} border shadow-sm pointer-events-none flex items-center justify-center`}>
                <span className={`text-[6px] ${page.washiTextColor || "text-pink-850"} font-mono tracking-widest font-bold`}>
                  {page.washiTape}
                </span>
              </div>
            )}

            {page.image2 ? (
              <div className="w-full aspect-[3/2] overflow-hidden mb-2 md:mb-3 flex gap-2">
                <div className="flex-1 h-full bg-[#ece9df] overflow-hidden shadow-inner rounded relative">
                  <img 
                    src={page.image} 
                    alt={page.title} 
                    loading="eager"
                    decoding="sync"
                    className={`w-full h-full object-cover saturate-[1.05] ${(page as any).objectPosition || "object-center"}`} 
                  />
                </div>
                <div className="flex-1 h-full bg-[#ece9df] overflow-hidden shadow-inner rounded relative">
                  <img 
                    src={page.image2} 
                    alt={page.title} 
                    loading="eager"
                    decoding="sync"
                    className={`w-full h-full object-cover saturate-[1.05] ${(page as any).objectPosition2 || "object-center"}`} 
                  />
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[3/2] bg-[#ece9df] overflow-hidden shadow-inner mb-2 md:mb-3">
                <img 
                  src={page.image} 
                  alt={page.title} 
                  loading="eager"
                  decoding="sync"
                  className={`w-full h-full object-cover saturate-[1.05] ${(page as any).objectPosition || "object-center"}`} 
                />
              </div>
            )}
            
            <span style={cursiveStyle} className="text-zinc-700 text-center text-lg select-none leading-none">
              {page.caption}
            </span>
          </div>

          <h3 className="text-base font-serif font-bold text-zinc-900 leading-tight mb-2 tracking-wide">
            {page.title}
          </h3>
          <p className="text-[11px] md:text-[12px] leading-relaxed text-[#555] font-sans mb-3 select-none pr-1 overflow-y-auto max-h-[100px] md:max-h-[140px] scrollbar-thin">
            {page.description}
          </p>

          <div className="flex items-center justify-between border-t border-zinc-200/70 pt-2.5 mt-auto select-none">
            <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-400">
              <MapPin size={8} className="text-pink-400" />
              <span>{page.location}</span>
            </div>
            {!isMobile && (
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#8c5a6b] font-bold">
                {isLeft ? "Kiri" : "Kanan"}
              </span>
            )}
          </div>
        </div>
      );

    case "playlist":
      return (
        <div className="flex flex-col h-full text-left justify-between py-1">
          <div 
            className="bg-[#f7f6f0] p-2 pb-4 md:p-3 md:pb-6 rounded shadow-md border border-zinc-200/80 mb-3 md:mb-5 relative flex flex-col"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            {page.washiTape && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-purple-200/40 border border-purple-300/25 -rotate-2 shadow-sm pointer-events-none flex items-center justify-center">
                <span className="text-[6px] text-purple-850/60 font-mono tracking-widest font-bold">{page.washiTape}</span>
              </div>
            )}

            <div className="w-full aspect-[4/3] bg-[#ece9df] overflow-hidden shadow-inner mb-3 relative group">
              <img 
                src={page.image} 
                alt="Soundtrack Cover" 
                loading="eager"
                decoding="sync"
                className="w-full h-full object-cover saturate-[1.05]" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <Music size={24} className="text-white/80 animate-pulse" />
              </div>
            </div>
            
            <span style={cursiveStyle} className="text-zinc-700 text-center text-lg select-none leading-none">
              {page.caption}
            </span>
          </div>

          <h3 className="text-base font-serif font-bold text-zinc-900 leading-tight mb-2 tracking-wide flex items-center gap-1.5">
            <span>{page.title}</span>
            <Coffee size={14} className="text-[#8c5a6b]" />
          </h3>
          <p className="text-[10px] md:text-[11.5px] leading-relaxed text-[#555] font-sans mb-3 select-none pr-1 overflow-y-auto max-h-[100px] md:max-h-[140px] scrollbar-thin">
            {page.description}
          </p>

          <div className="flex items-center justify-between border-t border-zinc-200/70 pt-2.5 mt-auto select-none">
            <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-400">
              <MapPin size={8} className="text-pink-400" />
              <span>{page.location}</span>
            </div>
            {!isMobile && (
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#8c5a6b] font-bold">Halaman 4</span>
            )}
          </div>
        </div>
      );

    case "letter":
      return (
        <div className="flex flex-col h-full text-left justify-between py-2">
          <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-pink-600 font-bold mb-2 md:mb-3">
            <Heart size={11} className="text-pink-500 fill-pink-500/20" />
            <span>Untuk Selamanya</span>
          </div>

          <h3 className="text-xl font-serif font-bold text-zinc-900 tracking-wide leading-tight mb-2 md:mb-3">
            {page.title}
          </h3>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-pink-50/20 border border-pink-100/50 p-3 md:p-4 rounded-xl shadow-sm mb-3 md:mb-4 select-none flex-1 overflow-hidden flex flex-col"
          >
            <span className="text-[28px] text-pink-600 absolute top-1 right-3 leading-none opacity-20">”</span>
            <div className="overflow-y-auto letter-scrollbar flex-1 pr-1">
              <p 
                style={{ ...serifStyle, lineHeight: isMobile ? "1.55" : "1.7", whiteSpace: "pre-line" }} 
                className={`text-zinc-800 text-center py-1 italic tracking-wide ${isMobile ? "text-[14px]" : "text-[16.5px]"}`}
              >
                {page.letterText}
              </p>
            </div>
          </div>

          <div className="w-full mt-auto select-none z-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                playChime();
                onProceed();
              }}
              className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-bold font-sans tracking-widest text-[10px] uppercase py-3.5 px-6 rounded-xl shadow-[0_8px_20px_rgba(255,179,198,0.3)] border border-[#ffb3c6]/20 transition-all duration-300 w-full cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Headphones size={13} className="text-[#0a060d]" />
              <span>Dengarkan Kaset Catatan Suaraku</span>
            </motion.button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

// ========================================================
// ANIMS AND COMPONENT
// ========================================================
const mobilePageVariants = {
  initial: (dir: number) => ({
    rotateY: dir > 0 ? 90 : -90,
    scaleX: 0.9,
    skewY: dir > 0 ? 5 : -5,
    z: 0,
    opacity: 0,
    transformOrigin: "left center"
  }),
  animate: {
    rotateY: 0,
    scaleX: 1,
    skewY: 0,
    z: 0,
    opacity: 1,
    transformOrigin: "left center",
    transition: {
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number]
    }
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -90 : 90,
    scaleX: 0.9,
    skewY: dir > 0 ? -5 : 5,
    z: 30,
    opacity: 0,
    transformOrigin: "left center",
    transition: {
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number]
    }
  })
};

export default function LoveTimeline({ onProceed }: LoveTimelineProps) {
  const [currentPage, setCurrentPage] = useState(0); // 0 to PAGES_CONFIG.length - 1
  const [flippingSheet, setFlippingSheet] = useState<number | null>(null);
  const [duration, setDuration] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [direction, setDirection] = useState(1);

  // Preload and decode images at startup to prevent delayed renders during page flips
  useEffect(() => {
    PAGES_CONFIG.forEach((page) => {
      if ((page.type === "photo" || page.type === "playlist") && page.image) {
        const img = new Image();
        img.src = page.image;
        img.decode?.().catch((err) => {
          console.warn("Failed to decode image:", page.image, err);
        });
      }
    });
  }, []);

  useEffect(() => {
    const anniversaryDate = new Date("August 31, 2025 19:00:00").getTime();

    const updateCounter = () => {
      const now = new Date().getTime();
      const difference = now - anniversaryDate;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setDuration({ days, hours, mins, secs });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;
      
      const freqs = [659.25, 783.99, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.04, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.55);
      });
    } catch (e) {}
  };

  const setPage = (newPage: number) => {
    if (newPage < 0 || newPage > PAGES_CONFIG.length - 1 || newPage === currentPage) return;

    setDirection(newPage > currentPage ? 1 : -1);

    // Determine flipping sheet index mathematically based on transition direction
    let sheetIndex: number | null = null;
    if (newPage > currentPage) {
      sheetIndex = Math.ceil(currentPage / 2); // Forward flip
    } else {
      sheetIndex = Math.floor((currentPage - 1) / 2); // Backward flip
    }

    if (sheetIndex !== null) {
      setFlippingSheet(sheetIndex);
      setTimeout(() => {
        setFlippingSheet(null);
      }, 800);
    }

    setCurrentPage(newPage);
  };

  const isSheetVisible = (sheetIdx: number) => {
    // Keep flipping sheet visible during transition (and the one next to it to avoid gaps)
    if (flippingSheet !== null) {
      if (sheetIdx === flippingSheet || sheetIdx === flippingSheet + 1) {
        return true;
      }
    }

    // Cover page open state check
    if (currentPage === 0) {
      return sheetIdx === 0;
    }

    const leftPage = currentPage % 2 === 0 ? currentPage - 1 : currentPage;
    const rightPage = currentPage % 2 === 0 ? currentPage : currentPage + 1;

    const leftSheet = Math.floor(leftPage / 2);
    const rightSheet = Math.floor(rightPage / 2);

    return sheetIdx === leftSheet || sheetIdx === rightSheet;
  };

  const totalSheets = PAGES_CONFIG.length / 2;

  const getZIndex = (sheetIndex: number) => {
    if (flippingSheet === sheetIndex) return 40;
    const isFlipped = currentPage >= sheetIndex * 2 + 1;
    if (isFlipped) {
      return 10 + sheetIndex * 10;
    } else {
      return 10 + (totalSheets - 1 - sheetIndex) * 10;
    }
  };

  const paperGridBackground = "radial-gradient(rgba(0,0,0,0.06) 1.2px, transparent 1.2px)";

  return (
    <section id="love-journey" className="relative flex flex-col justify-center items-center min-h-screen text-center py-20 md:py-28 px-4 md:px-12 overflow-hidden select-none w-full">
      <div className="absolute inset-0 bg-radial-[circle_at_center,_#1b0f1a_0%,_#0a060d_100%] z-0" />

      <div className="z-10 flex flex-col items-center w-full max-w-6xl gap-y-10 md:gap-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="flex flex-col items-center gap-y-1.5 md:gap-y-2 select-none text-center"
        >
          <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#ffb3c6] font-bold flex items-center gap-1.5">
            <Sparkles size={11} className="text-pink-300 animate-pulse" />
            <span>Kenangan Kecil</span>
            <Sparkles size={11} className="text-pink-300 animate-pulse" />
          </span>

          <h2 className="text-3xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-blue leading-tight flex items-center justify-center gap-3">
            <span>Our Memory Scrapbook</span>
            <BookOpen size={24} className="text-[#ffb3c6] animate-pulse" />
          </h2>
          
          <p className="text-xs md:text-sm text-zinc-400 font-sans max-w-md leading-relaxed">
            Klik halaman buku untuk membalik halaman, atau gunakan navigasi di bawah untuk membuka kisah kita...
          </p>
        </motion.div>

        {/* ========================================================
            SCRAPBOOK WIDGET CONTAINER
            ======================================================== */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[560px] md:min-h-[700px]">
          
          {/* ================= DESKTOP 3D BOOK LAYOUT ================= */}
          <motion.div 
            className="hidden md:block relative w-[1080px] h-[680px] origin-center md:scale-[0.7] lg:scale-[0.85] xl:scale-100"
            animate={{
              x: currentPage === 0 ? -257 : 0
            }}
            transition={{
              duration: 0.9,
              ease: [0.25, 1, 0.5, 1]
            }}
            style={{ perspective: "2500px", transformStyle: "preserve-3d" }}
          >
            {/* Hardcover Backing (Book Cover Left and Right) */}
            <motion.div 
              className="absolute inset-y-0 bg-[#2b101c] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.65)] border border-[#1a0a11] z-0 overflow-hidden"
              animate={{
                left: currentPage === 0 ? 534 : 0,
                right: 0,
                borderRadius: currentPage === 0 ? "0 24px 24px 0" : "24px",
              }}
              transition={{
                duration: 0.9,
                ease: [0.25, 1, 0.5, 1]
              }}
            >
              <div className="absolute inset-2 border border-pink-900/10 rounded-[22px] pointer-events-none" />
              <motion.div 
                className="absolute left-4 top-4 bottom-4 w-[calc(50%-26px)] bg-[#1e0a13] rounded-l-2xl border border-pink-950/20" 
                animate={{ opacity: currentPage === 0 ? 0 : 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute right-4 top-4 bottom-4 w-[calc(50%-26px)] bg-[#1e0a13] rounded-r-2xl border border-pink-950/20" />
              
              <motion.div 
                className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-300/40 rounded-tl-3xl pointer-events-none" 
                animate={{ opacity: currentPage === 0 ? 0 : 1 }}
              />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-300/40 rounded-tr-3xl pointer-events-none" />
              <motion.div 
                className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-300/40 rounded-bl-3xl pointer-events-none" 
                animate={{ opacity: currentPage === 0 ? 0 : 1 }}
              />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-300/40 rounded-br-3xl pointer-events-none" />
            </motion.div>

            {/* Left Page Static Underlay */}
            {currentPage >= 1 && (
              <div className="absolute left-[26px] top-[22px] w-[514px] h-[636px] bg-[#ece9df] border-y border-l border-zinc-300 rounded-l shadow-inner z-1 pointer-events-none" />
            )}

            {/* Right Page Static Underlay */}
            {currentPage >= 1 && currentPage < PAGES_CONFIG.length - 1 && (
              <div className="absolute right-[26px] top-[22px] w-[514px] h-[636px] bg-[#ece9df] border-y border-r border-zinc-300 rounded-r shadow-inner z-1 pointer-events-none" />
            )}

            {/* Center Spine Ring Binder */}
            <motion.div 
              className="absolute left-1/2 top-4 bottom-4 w-6 -translate-x-1/2 bg-gradient-to-r from-[#12070c] via-[#241018] to-[#12070c] z-50 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] rounded-md flex flex-col justify-around items-center py-6"
              animate={{
                opacity: currentPage === 0 ? 0 : 1,
                scaleY: currentPage === 0 ? 0.8 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative w-10 h-3 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-8 h-2 bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-400 rounded-full border border-zinc-600/30 shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
                  <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-zinc-950/80" />
                  <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-zinc-950/80" />
                </div>
              ))}
            </motion.div>

            {/* Dynamic Render of Sheets */}
            {Array.from({ length: totalSheets }).map((_, i) => {
              const isFlipped = currentPage >= i * 2 + 1;
              const frontPage = PAGES_CONFIG[i * 2];
              const backPage = PAGES_CONFIG[i * 2 + 1];
              const isVisible = isSheetVisible(i);

              return (
                <motion.div
                  key={i}
                  className="absolute right-[26px] top-[22px] w-[514px] h-[636px] cursor-pointer"
                  onClick={() => {
                    if (!isFlipped) {
                      setPage(i * 2 + 1);
                    } else {
                      setPage(Math.max(0, i * 2 - 1));
                    }
                  }}
                  animate={{
                    rotateY: isFlipped ? -180 : 0,
                    z: flippingSheet === i ? [0, 60, 0] : 0,
                    scaleX: flippingSheet === i ? [1, 0.92, 1] : 1,
                    skewY: flippingSheet === i ? [0, direction * -4, 0] : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                    zIndex: getZIndex(i),
                    willChange: "transform",
                    boxShadow: isVisible ? "0 12px 36px rgba(0,0,0,0.3)" : "none",
                    visibility: isVisible ? "visible" : "hidden",
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                >
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 bg-[#fbf9f5] rounded-r border-y border-r border-zinc-300 overflow-hidden"
                    style={{ 
                      transform: "translateZ(1px)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      backgroundImage: frontPage.type === "cover" ? "none" : paperGridBackground,
                      backgroundSize: "16px 16px"
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-black pointer-events-none z-30 rounded-r"
                      animate={{ opacity: flippingSheet === i ? [0, 0.35, 0] : 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-30"
                      initial={{ x: direction > 0 ? "-100%" : "100%" }}
                      animate={{
                        x: flippingSheet === i ? (direction > 0 ? ["-100%", "100%"] : ["100%", "-100%"]) : (direction > 0 ? "-100%" : "100%")
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    
                    <div className={frontPage.type === "cover" ? "w-full h-full bg-gradient-to-b from-[#A64D79] to-[#661d43] relative" : "w-full h-full p-8 relative"}>
                      <PageContent 
                        page={frontPage} 
                        isLeft={false} 
                        isMobile={false} 
                        duration={duration} 
                        onProceed={onProceed} 
                        playChime={playChime} 
                      />
                    </div>
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute inset-0 bg-[#fbf9f5] rounded-l border-y border-l border-zinc-300 overflow-hidden"
                    style={{
                      transform: "rotateY(180deg) translateZ(1px)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      backgroundImage: paperGridBackground,
                      backgroundSize: "16px 16px"
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-black pointer-events-none z-30 rounded-l"
                      animate={{ opacity: flippingSheet === i ? [0, 0.35, 0] : 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-30"
                      initial={{ x: direction > 0 ? "-100%" : "100%" }}
                      animate={{
                        x: flippingSheet === i ? (direction > 0 ? ["-100%", "100%"] : ["100%", "-100%"]) : (direction > 0 ? "-100%" : "100%")
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    
                    <div className="w-full h-full p-8 relative">
                      <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-zinc-950/15 to-transparent pointer-events-none z-20" />
                      <PageContent 
                        page={backPage} 
                        isLeft={true} 
                        isMobile={false} 
                        duration={duration} 
                        onProceed={onProceed} 
                        playChime={playChime} 
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ================= MOBILE SWIPEABLE STACK LAYOUT ================= */}
          <div 
            className="block md:hidden relative w-full max-w-[340px] h-[520px] bg-[#2b101c] rounded-2xl p-2 shadow-2xl border border-pink-950/30 overflow-visible select-none"
            style={{ perspective: "1500px" }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#1a0a11] z-20 flex flex-col justify-around py-4 items-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 rounded-full bg-gradient-to-r from-zinc-400 to-zinc-600 shadow border border-zinc-800/40" />
              ))}
            </div>

            <div 
              className="relative w-full h-full rounded-lg overflow-visible"
              style={{ transformStyle: "preserve-3d" }}
            >
              <AnimatePresence custom={direction}>
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={mobilePageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.35}
                  onDragEnd={(e, info) => {
                    const threshold = 40;
                    if (info.offset.x < -threshold && currentPage < PAGES_CONFIG.length - 1) {
                      setPage(currentPage + 1);
                    } else if (info.offset.x > threshold && currentPage > 0) {
                      setPage(currentPage - 1);
                    }
                  }}
                  style={{ 
                    backfaceVisibility: "hidden", 
                    transformStyle: "preserve-3d",
                    backgroundImage: paperGridBackground,
                    backgroundSize: "16px 16px",
                    willChange: "transform",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                  }}
                  className="absolute inset-y-0 left-4 right-0 flex flex-col p-5 bg-[#fbf9f5] rounded-lg border border-zinc-300/80 shadow-md pl-6"
                >
                  <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-zinc-950/15 to-transparent pointer-events-none z-10 rounded-l-lg" />

                  <motion.div
                    className="absolute inset-0 bg-black pointer-events-none z-30 rounded-lg"
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0.35 }}
                    transition={{ duration: 0.6 }}
                  />

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-30"
                    initial={{ x: direction > 0 ? "-100%" : "100%" }}
                    animate={{
                      x: ["-100%", "100%"]
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />

                  <div className={PAGES_CONFIG[currentPage].type === "cover" ? "w-full h-full bg-gradient-to-b from-[#A64D79] to-[#661d43] absolute inset-0 flex flex-col justify-center items-center rounded-lg" : "flex-1 flex flex-col justify-between"}>
                    <PageContent 
                      page={PAGES_CONFIG[currentPage]} 
                      isLeft={currentPage % 2 !== 0} 
                      isMobile={true} 
                      duration={duration} 
                      onProceed={onProceed} 
                      playChime={playChime} 
                    />
                  </div>

                  <div className="mt-auto pt-2 border-t border-zinc-200/50 flex justify-between items-center text-[8px] font-mono text-zinc-400 select-none">
                    <span>SELAZAR HATI</span>
                    <span>HALAMAN {currentPage + 1} DARI {PAGES_CONFIG.length}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ========================================================
            NAVIGATION ARROWS & PAGE DOTS WIDGET
            ======================================================== */}
        <div className="z-10 flex flex-col items-center gap-3 select-none">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                  setPage(Math.max(0, currentPage - 1));
                } else {
                  const prevPage = currentPage % 2 !== 0 
                    ? (currentPage === 1 ? 0 : currentPage - 2)
                    : Math.max(0, currentPage - 3);
                  setPage(prevPage);
                }
              }}
              disabled={currentPage === 0}
              className="w-10 h-10 rounded-full bg-pink-950/40 border border-pink-900/40 hover:border-pink-500/30 text-pink-300 flex items-center justify-center shadow-lg transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2">
              {PAGES_CONFIG.map((_, pageIdx) => (
                <button
                  key={pageIdx}
                  onClick={() => setPage(pageIdx)}
                  className={`rounded-full transition-all duration-300 ${
                    currentPage === pageIdx
                      ? "w-2.5 h-2.5 bg-[#ffb3c6] shadow-[0_0_8px_#ffb3c6]"
                      : "w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                  setPage(Math.min(PAGES_CONFIG.length - 1, currentPage + 1));
                } else {
                  if (currentPage === 0) setPage(1);
                  else if (currentPage % 2 !== 0) setPage(currentPage + 2);
                  else setPage(currentPage + 1);
                }
              }}
              disabled={currentPage === PAGES_CONFIG.length - 1}
              className="w-10 h-10 rounded-full bg-pink-950/40 border border-pink-900/40 hover:border-pink-500/30 text-pink-300 flex items-center justify-center shadow-lg transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <span className="text-[10px] uppercase font-mono tracking-widest text-[#ffe5ec]/60 font-bold mt-1">
            {currentPage === 0 
              ? "Klik Buku Untuk Membuka" 
              : `Terbuka Halaman ${currentPage === PAGES_CONFIG.length - 1 ? PAGES_CONFIG.length - 1 : `${currentPage} & ${currentPage + 1}`}`}
          </span>
        </div>

      </div>
    </section>
  );
}
