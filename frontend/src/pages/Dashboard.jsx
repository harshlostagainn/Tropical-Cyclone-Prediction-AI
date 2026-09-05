import { useMemo } from "react";
import { usePrediction } from "../hooks/usePrediction";
import ImageUpload from "../components/ImageUpload";
import LoadingAnimation from "../components/LoadingAnimation";
import PredictionResult from "../components/PredictionResult";

export default function Dashboard() {
  const { result, loading, error, predict, reset } = usePrediction();

  const bubbles = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => {
      const size = Math.random() * 20 + 3;
      return {
        id: i,
        size,
        left: Math.random() * 100,
        duration: Math.random() * 6 + 3,
        delay: Math.random() * 8,
        blur: size > 14 ? 0 : 0.3,
      };
    });
  }, []);

  const handleImageSelect = (file) => {
    reset();
    predict(file);
  };

  return (
    <div className="min-h-screen bg-[#020612] text-slate-100 relative overflow-hidden font-body selection:bg-cyan-400 selection:text-black">
      {/* 🌊 OCEAN AMBIENT GRADIENT */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#082b4c] via-[#030d1d] to-[#01040a] pointer-events-none" />

      {/* Underwater light refraction */}
      <div className="caustics" />
      <div className="shimmer-band" />

      {/* 🫧 RISING BUBBLES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              filter: b.blur ? `blur(${b.blur}px)` : "none",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-cyan-900/40 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-bold text-2xl shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md">
              🌀
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-display font-semibold text-xl tracking-tight">
                  Cyclone Intelligence Console
                </h1>
                <span className="px-2 py-0.5 text-[10px] bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 rounded font-medium">
                  v2.4
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                SIH26070 · INSAT-3D Remote Sensing AI Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#071326]/80 border border-cyan-900/50 p-2.5 px-4 rounded-xl backdrop-blur-md">
            <div className="text-right border-r border-cyan-900/80 pr-4 hidden sm:block">
              <p className="text-[10px] text-slate-500">Geospatial Focus</p>
              <p className="text-xs text-cyan-400 font-medium">19.0760° N, 72.8777° E</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-200 font-medium">System Ready</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-5 bg-[#061224]/80 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between relative group hover:border-cyan-500/50 transition-all">
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-semibold tracking-wide text-cyan-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  Satellite Optical Stream
                </h2>
                <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                  Channel IR-1
                </span>
              </div>

              <ImageUpload onImageSelect={handleImageSelect} disabled={loading} />
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#030a16]/90 border border-slate-800/80 text-xs text-slate-400 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Sensor Band:</span>
                <span className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
                  INSAT-3D Thermal/IR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Target Analytics:</span>
                <span className="text-slate-200 font-medium">Eye Formation & Wind Speed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Resolution Standard:</span>
                <span className="text-slate-200 font-medium">128 × 128 Pixels</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#061224]/80 backdrop-blur-2xl border border-cyan-900/40 rounded-3xl p-6 min-h-[420px] flex flex-col justify-center items-center relative shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

            {loading && <LoadingAnimation />}

            {error && (
              <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/40 max-w-md text-center backdrop-blur-md">
                <div className="text-red-400 text-2xl mb-2">⚠️</div>
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-center text-2xl text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)] animate-pulse">
                  🛰️
                </div>
                <p className="text-sm text-slate-300">Awaiting Satellite Imagery Feed…</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Upload an IR frame on the left panel to execute deep learning classification.
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="w-full space-y-6">
                <PredictionResult result={result} />
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-[#061224]/60 border border-cyan-900/30 rounded-2xl p-4 backdrop-blur-md hover:border-cyan-500/30 transition-all">
            <p className="text-cyan-400 font-display font-semibold text-2xl">6 Categories</p>
            <p className="text-slate-400 text-xs mt-1">Saffir-Simpson & IMD Intensity Scale</p>
          </div>
          <div className="bg-[#061224]/60 border border-cyan-900/30 rounded-2xl p-4 backdrop-blur-md hover:border-cyan-500/30 transition-all">
            <p className="text-cyan-400 font-display font-semibold text-2xl">ResNet-50</p>
            <p className="text-slate-400 text-xs mt-1">Deep Transfer Learning Model Core</p>
          </div>
          <div className="bg-[#061224]/60 border border-cyan-900/30 rounded-2xl p-4 backdrop-blur-md hover:border-cyan-400/30 transition-all">
            <p className="text-cyan-400 font-display font-semibold text-2xl">Grad-CAM XAI</p>
            <p className="text-slate-400 text-xs mt-1">Explainable Attention Heatmaps</p>
          </div>
        </div>
      </div>
    </div>
  );
}