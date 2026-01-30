"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import { useRouter } from "next/navigation";
import { Loader2, Lightbulb, ArrowLeft, Aperture } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PhotoBooth() {
    const webcamRef = useRef<Webcam>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const router = useRouter();
    const [model, setModel] = useState<any>(null);

    useEffect(() => {
        const loadModel = async () => {
            setIsModelLoading(true);
            try {
                await tf.ready();
                const net = await handpose.load();
                setModel(net);
            } catch (err) {
                console.error(err);
            } finally {
                setIsModelLoading(false);
            }
        };
        loadModel();
    }, []);

    const detect = async (net: any) => {
        if (webcamRef.current?.video?.readyState === 4) {
            const video = webcamRef.current.video;
            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            const hand = await net.estimateHands(video);
            if (hand.length > 0) {
                const GE = new fp.GestureEstimator([fp.Gestures.VictoryGesture]);
                const gesture = await GE.estimate(hand[0].landmarks, 8);

                if (gesture.gestures?.length > 0) {
                    const bestGesture = gesture.gestures.reduce((prev: any, current: any) =>
                        (prev.confidence > current.confidence) ? prev : current
                    );
                    if (bestGesture?.name === "victory" && countdown === null) {
                        startCountdown();
                    }
                }
            }
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (model && photos.length < 4 && !isModelLoading) {
            interval = setInterval(() => detect(model), 500);
        }
        return () => clearInterval(interval);
    }, [model, photos, countdown, isModelLoading]);

    const startCountdown = () => {
        if (countdown !== null) return;
        let count = 3;
        setCountdown(count);
        const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count === 0) {
                clearInterval(timer);
                capture();
                setCountdown(null);
            }
        }, 1000);
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) setPhotos((prev) => [...prev, imageSrc]);
    }, [webcamRef]);

    useEffect(() => {
        if (photos.length === 4) {
            localStorage.setItem("capturedPhotos", JSON.stringify(photos));
            setTimeout(() => router.push("/result"), 1000);
        }
    }, [photos, router]);

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200 rounded-full blur-[120px] opacity-40"
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-200 rounded-full blur-[120px] opacity-40"
                />
            </div>

            <header className="relative z-10 w-full max-w-3xl flex items-center justify-between mb-6 px-2">
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                </Link>
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
                        <Aperture className="animate-spin-slow" size={18} />
                    </span>
                    <h1 className="text-gray-900 font-bold tracking-wider text-lg">FOTLINE STUDIO</h1>
                </div>
                <div className="w-[50px]"></div>
            </header>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-2xl perspective-1000 z-10"
            >
                <div className={`relative bg-[#1a1a1a] transition-all duration-500 shadow-2xl overflow-hidden ring-1 ring-white/10 ${'w-[280px] h-[580px] mx-auto rounded-[3rem] border-[12px] border-[#2a2a2a] md:w-full md:h-auto md:aspect-[16/10] md:rounded-t-2xl md:border-[8px]'}`}>
                    <div className="relative aspect-[16/10] bg-black w-full overflow-hidden">
                        <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2a2a2a] rounded-b-3xl z-50 flex items-center justify-center">
                            <div className="w-10 h-1 bg-[#0f0f0f] rounded-full"></div>
                        </div>

                        <div className="relative h-full md:aspect-[16/10] bg-black w-full overflow-hidden">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                mirrored={true}
                                videoConstraints={{ facingMode: "user" }}
                                style={{ transform: "scaleX(1)" }}
                                className="w-full h-full object-cover"
                            />

                            <AnimatePresence>
                                {isModelLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm text-zinc-900 z-30"
                                    >
                                        <Loader2 className="w-12 h-12 animate-spin text-pink-500 mb-4" />
                                        <p className="text-zinc-500 text-sm tracking-widest uppercase font-medium">Initializing AI...</p>
                                    </motion.div>
                                )}

                                {countdown === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0.8 }} animate={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white z-50"
                                    />
                                )}

                                {countdown !== null && countdown > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-40">
                                        <motion.span
                                            key={countdown}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1.5, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="text-gray-900 text-[150px] font-black drop-shadow-xl"
                                        >
                                            {countdown}
                                        </motion.span>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {!isModelLoading && (
                            <>
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md text-gray-900 text-xs font-medium px-4 py-1.5 rounded-full border border-white/40 flex items-center gap-2 z-20 shadow-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Pose "Peace" ✌️ to capture
                                </div>
                                <div className="absolute top-4 right-4 text-gray-500 bg-white/50 p-1.5 rounded-full backdrop-blur-sm">
                                    <Lightbulb size={18} className={isModelLoading ? "text-gray-400" : "text-yellow-500"} />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-[#2a2a2a] rounded-b-xl flex items-center justify-center z-50 shadow-md">
                        <div className="w-2 h-2 bg-[#0f0f0f] rounded-full ring-1 ring-gray-600"></div>
                        <div className={`w-1 h-1 rounded-full ml-3 ${!isModelLoading ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
                    </div>
                </div>

                <div className="relative mx-auto w-[102%] h-4 bg-gradient-to-b from-[#333] to-[#1a1a1a] rounded-b-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex justify-center">
                    <div className="w-20 h-1 bg-[#1a1a1a] rounded-b-md shadow-inner opacity-50"></div>
                </div>
            </motion.div>

            <div className="mt-8 z-10 w-full max-w-2xl">
                <div className="flex items-center justify-between bg-white/60 backdrop-blur-xl border border-white/40 p-3 rounded-2xl shadow-sm">
                    <div className="flex gap-3">
                        {[...Array(4)].map((_, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`relative w-14 h-10 rounded-lg overflow-hidden border ${photos[idx] ? 'border-pink-500 ring-2 ring-pink-100' : 'border-gray-200 bg-gray-50/50'}`}
                            >
                                {photos[idx] ? (
                                    <img src={photos[idx]} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-medium font-mono">{idx + 1}</div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-xs font-medium tracking-wider">
                            {photos.length} / 4 READY
                        </span>
                        {photos.length > 0 && (
                            <button
                                onClick={() => setPhotos([])}
                                className="px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}