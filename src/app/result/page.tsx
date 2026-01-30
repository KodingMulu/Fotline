"use client";
import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Download, Mail, ArrowLeft, Check, Aperture, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResultPage() {
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState("/assets/frame1.png");
    const resultRef = useRef<HTMLDivElement>(null);

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [isMobile, setIsMobile] = useState(false);
    const [mobileScale, setMobileScale] = useState(0.24);

    useEffect(() => {
        const saved = localStorage.getItem("capturedPhotos");
        if (saved) setPhotos(JSON.parse(saved));

        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                const newScale = Math.min((window.innerWidth - 40) / 600, 0.24);
                setMobileScale(newScale);
            } else {
                setIsMobile(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const generateImage = async () => {
        if (!resultRef.current) return null;

        try {
            const canvas = await html2canvas(resultRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                onclone: (clonedDoc) => {
                    const element = clonedDoc.getElementById("print-area");
                    if (element) {
                        element.style.transform = "none";
                        element.style.marginBottom = "0";
                    }
                }
            });
            return canvas.toDataURL("image/png");
        } catch (error) {
            console.error("Gagal generate gambar:", error);
            alert("Gagal memproses gambar.");
            return null;
        }
    };

    const handleDownload = async () => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        const imageBase64 = await generateImage();
        if (imageBase64) {
            const link = document.createElement("a");
            link.download = `fotline-result-${Date.now()}.png`;
            link.href = imageBase64;
            link.click();
        }
        setIsGenerating(false);
    };

    const handleSendEmail = async (email: string) => {
        setIsSending(true);
        const imageBase64 = await generateImage();
        if (!imageBase64) {
            setIsSending(false);
            return;
        }
        const cleanBase64 = imageBase64.split(',')[1];
        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, image: cleanBase64 })
            });
            if (res.ok) {
                alert("✅ Email berhasil dikirim!");
                setShowEmailModal(false);
            } else {
                const err = await res.json();
                alert(`❌ Gagal: ${err.error || 'Server error'}`);
            }
        } catch (e) {
            alert("Terjadi kesalahan koneksi.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="h-[100dvh] md:min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row items-center justify-center p-0 md:p-6 gap-0 md:gap-10 font-sans relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-200 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] opacity-30"></div>
            </div>

            <div className="absolute top-4 left-4 md:hidden z-30">
                <Link href="/" className="bg-white/50 backdrop-blur-md p-2 rounded-full text-gray-700 hover:text-gray-900 flex items-center gap-2 text-xs font-bold border border-white/20 shadow-sm">
                    <ArrowLeft size={14} /> Back
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 flex-1 md:flex-none flex items-center justify-center w-full md:w-auto md:p-4 pb-[180px] md:pb-4"
            >
                <div
                    className="relative shadow-xl md:shadow-2xl border-4 md:border-8 border-white bg-gray-200 rounded-lg overflow-hidden ring-1 ring-black/5"
                    style={isMobile ? {
                        width: 600 * mobileScale,
                        height: 1800 * mobileScale,
                    } : {

                    }}
                >
                    <div
                        id="print-area"
                        ref={resultRef}
                        className="relative flex flex-col items-center overflow-hidden"
                        style={isMobile ? {
                            backgroundColor: '#ffffff',
                            width: '600px',
                            height: '1800px',
                            transform: `scale(${mobileScale})`,
                            transformOrigin: 'top left',
                            marginBottom: '0',
                        } : {
                            backgroundColor: '#ffffff',
                            width: '600px',
                            height: '1800px',
                            transform: 'scale(0.32)',
                            transformOrigin: 'top center',
                            marginBottom: '-1220px'
                        }}
                    >
                        <div className="absolute inset-0 flex flex-col items-center pt-[165px] gap-[12px] z-0">
                            {photos.map((src, i) => (
                                <div
                                    key={i}
                                    style={{
                                        backgroundImage: `url(${src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        width: '570px',
                                        height: '390px',
                                        backgroundColor: '#f3f4f6'
                                    }}
                                    className="filter contrast-110"
                                />
                            ))}
                        </div>

                        <img
                            src={selectedFrame}
                            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                            alt="frame overlay"
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 50 : 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 z-20 w-full md:static md:w-full md:max-w-sm"
            >
                <div className="bg-white/90 backdrop-blur-xl md:bg-white/80 p-5 pb-8 md:p-8 rounded-t-3xl md:rounded-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-xl border-t md:border border-white/50">
                    <div className="hidden md:flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <div className="bg-black text-white p-2 rounded-lg"><Aperture size={20} /></div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Your Photos</h2>
                            <p className="text-xs text-gray-500">Siap untuk disimpan!</p>
                        </div>
                    </div>

                    <div className="mb-5 md:mb-8">
                        <label className="text-xs md:text-sm font-bold text-gray-700 mb-2 md:mb-3 block text-center md:text-left">Choose Layout Style</label>
                        <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
                            {[1, 2, 3, 4].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setSelectedFrame(`/assets/frame${num}.png`)}
                                    className={`relative group w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedFrame.includes(`frame${num}`) ? 'border-black ring-2 ring-gray-200 ring-offset-2' : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <img src={`/assets/frame${num}.png`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" style={{ backgroundColor: '#f9fafb' }} />
                                    {selectedFrame.includes(`frame${num}`) && (
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                            <div className="bg-white rounded-full p-1 shadow-sm">
                                                <Check className="w-[10px] h-[10px] md:w-[12px] md:h-[12px]" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:flex md:flex-col gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="col-span-1 w-full flex items-center justify-center gap-2 bg-black text-white py-3 md:py-4 rounded-xl font-bold text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gray-200 disabled:opacity-70"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                            {isGenerating ? "Processing..." : "Download Image"}
                        </button>

                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="col-span-1 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 md:py-4 rounded-xl font-bold text-xs md:text-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            <Mail size={16} /> Send via Email
                        </button>

                        <div className="hidden md:block pt-4 mt-4 border-t border-gray-100">
                            <Link href="/" className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 py-2 font-medium text-xs transition">
                                <ArrowLeft size={14} /> Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {showEmailModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-6 animate-in fade-in duration-200">
                    <div className="bg-white p-6 md:p-8 rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0">
                        <div className="absolute top-0 left-0 w-full h-1 md:h-2 bg-gradient-to-r from-pink-500 to-purple-500"></div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Kirim ke Email</h3>
                        <p className="text-gray-500 text-xs md:text-sm mb-6">Hasil foto akan dikirim sebagai lampiran.</p>

                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            handleSendEmail(e.target.email.value);
                        }}>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
                                <input name="email" type="email" required className="w-full bg-gray-50 border border-gray-200 p-3 md:p-4 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm" placeholder="name@example.com" />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowEmailModal(false)} className="flex-1 py-3 text-gray-600 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition">Cancel</button>
                                <button disabled={isSending} type="submit" className="flex-1 py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isSending ? <Loader2 className="animate-spin" size={16} /> : "Kirim"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}