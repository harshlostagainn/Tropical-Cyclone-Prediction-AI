export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="w-10 h-10 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Analyzing satellite image...</p>
    </div>
  );
}