import { usePrediction } from "../hooks/usePrediction";
import ImageUpload from "../components/ImageUpload";
import LoadingAnimation from "../components/LoadingAnimation";
import PredictionResult from "../components/PredictionResult";

export default function Dashboard() {
  const { result, loading, error, predict, reset } = usePrediction();

  const handleImageSelect = (file) => {
    reset();
    predict(file);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#4dd8e8 1px, transparent 1px), linear-gradient(90deg, #4dd8e8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl">
              🌪️
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">
                Cyclone Intelligence
              </h1>
              <p className="text-gray-500 text-xs">SIH26070 · AI/ML Research Console</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Model Online
          </div>
        </header>

        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Tropical Cyclone Classification
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Satellite Image Analysis
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Upload an INSAT-3D satellite image. The model analyzes cloud structure
            and spiral formation to classify cyclone intensity in real time.
          </p>
        </div>

        {/* Main panel */}
        <div className="bg-[#0f1420]/80 backdrop-blur border border-gray-800 rounded-2xl p-10 shadow-2xl">
          <ImageUpload onImageSelect={handleImageSelect} disabled={loading} />

          <div className="mt-8 flex justify-center min-h-[100px]">
            {loading && <LoadingAnimation />}
            {error && (
              <p className="text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-4 py-3 text-sm max-w-sm text-center">
                {error}
              </p>
            )}
            {result && !loading && <PredictionResult result={result} />}
          </div>
        </div>

        {/* Footer stats strip */}
        <div className="grid grid-cols-3 gap-4 mt-10 text-center">
          <div className="bg-[#0f1420]/60 border border-gray-800 rounded-xl py-4">
            <p className="text-cyan-400 font-bold text-lg">6</p>
            <p className="text-gray-500 text-xs mt-1">Storm Categories</p>
          </div>
          <div className="bg-[#0f1420]/60 border border-gray-800 rounded-xl py-4">
            <p className="text-cyan-400 font-bold text-lg">ResNet50</p>
            <p className="text-gray-500 text-xs mt-1">Transfer Learning</p>
          </div>
          <div className="bg-[#0f1420]/60 border border-gray-800 rounded-xl py-4">
            <p className="text-cyan-400 font-bold text-lg">Grad-CAM</p>
            <p className="text-gray-500 text-xs mt-1">Explainable AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}