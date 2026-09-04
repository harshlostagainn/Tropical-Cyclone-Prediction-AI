export default function PredictionResult({ result }) {
  if (!result) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm text-center">
      <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Predicted Category</p>
      <h2 className="text-2xl font-bold text-cyan-400 mb-3">{result.category}</h2>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
        <div
          className="bg-cyan-400 h-2 rounded-full"
          style={{ width: `${result.confidence * 100}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm">
        Confidence: {(result.confidence * 100).toFixed(2)}%
      </p>
    </div>
  );
}