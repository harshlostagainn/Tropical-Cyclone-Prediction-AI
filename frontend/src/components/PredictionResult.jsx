export default function PredictionResult({ result }) {
  if (!result) return null;

  const confidencePct = (result.confidence * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-b from-[#0e2530] to-[#0f1420] border border-cyan-900/50 rounded-2xl p-8 w-full max-w-sm text-center animate-[fadeIn_0.4s_ease]">
      <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.15em] mb-3">
        Predicted Category
      </p>
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">{result.category}</h2>

      <div className="w-full bg-gray-800/80 rounded-full h-1.5 mb-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${confidencePct}%` }}
        />
      </div>
      <p className="text-gray-400 text-sm">
        Confidence: <span className="text-white font-semibold">{confidencePct}%</span>
      </p>
    </div>
  );
}