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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          🌪️ Cyclone Category Predictor
        </h1>
        <p className="text-gray-400 text-sm">
          Upload a satellite image to predict the tropical cyclone category
        </p>
      </div>

      <ImageUpload onImageSelect={handleImageSelect} disabled={loading} />

      <div className="mt-6 w-full flex justify-center">
        {loading && <LoadingAnimation />}
        {error && (
          <p className="text-red-400 bg-red-950 border border-red-800 rounded-lg px-4 py-2 text-sm">
            {error}
          </p>
        )}
        {result && !loading && <PredictionResult result={result} />}
      </div>
    </div>
  );
}