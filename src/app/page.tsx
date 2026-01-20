"use client";
import Link from "next/link";
import { Camera, Zap, Sparkles, ArrowRight, Aperture } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-white relative overflow-hidden flex flex-col font-sans selection:bg-pink-200">
      <div className="absolute inset-0 w-full h-full bg-[#FAFAFA]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-pink-200/40 via-purple-200/40 to-blue-200/40 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <nav className="relative z-50 w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Aperture size={18} />
          </span>
          <span className="font-bold text-xl tracking-tight text-black">
            FOTLINE<span className="text-pink-500">.</span>
          </span>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 flex-1 text-center mt-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">AI Gesture Control Ready</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6"
        >
          Studio Quality Photos, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Right from Your Browser.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Fotline mengubah webcam kamu menjadi photobooth profesional.
          Tanpa install, tanpa sentuh tombol. Cukup gaya ✌️ dan senyum.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          <Link
            href="/photobooth"
            className="relative px-10 py-5 bg-black rounded-full flex items-center gap-4 text-white font-bold text-lg hover:scale-105 transition-transform"
          >
            <Camera size={24} />
            <span>Mulai Foto Sekarang</span>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 relative w-full max-w-3xl h-[300px] md:h-[400px]"
        >
          <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20 w-[60%] md:w-[45%] bg-white p-2 pb-8 rounded-xl shadow-2xl border border-gray-200 hover:-translate-y-2 transition-transform duration-500">
            <div className="bg-gray-900 rounded-lg overflow-hidden aspect-[4/5] relative group">
              <img src="https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
              <span className="absolute top-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-mono border border-white/20">REC ●</span>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20 flex gap-1 items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-white font-bold">DETECTING ✌️</span>
              </div>
            </div>
          </div>

          <div className="absolute left-[10%] md:left-[20%] top-10 z-10 w-[30%] md:w-[25%] bg-white p-2 pb-6 rounded-lg shadow-xl border border-gray-100 -rotate-12 opacity-60 hover:opacity-100 hover:rotate-[-15deg] hover:scale-110 transition-all duration-300">
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop" className="w-full h-32 md:h-48 object-cover grayscale rounded bg-gray-100" />
          </div>

          <div className="absolute right-[10%] md:right-[20%] top-10 z-10 w-[30%] md:w-[25%] bg-white p-2 pb-6 rounded-lg shadow-xl border border-gray-100 rotate-12 opacity-60 hover:opacity-100 hover:rotate-[15deg] hover:scale-110 transition-all duration-300">
            <img src="https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=400&auto=format&fit=crop" className="w-full h-32 md:h-48 object-cover grayscale rounded bg-gray-100" />
          </div>
        </motion.div>
      </section>

      <footer className="w-full border-t border-gray-100 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-4xl mx-auto flex justify-around text-center px-4">
          <div className="flex flex-col items-center gap-1">
            <Zap size={20} className="text-gray-400 mb-1" />
            <span className="text-xs font-bold text-gray-800">Instant Process</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sparkles size={20} className="text-gray-400 mb-1" />
            <span className="text-xs font-bold text-gray-800">AI Enhancement</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Aperture size={20} className="text-gray-400 mb-1" />
            <span className="text-xs font-bold text-gray-800">Privacy First</span>
          </div>
        </div>
      </footer>
    </main>
  );
}