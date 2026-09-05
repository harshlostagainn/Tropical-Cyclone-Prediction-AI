export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
      </div>
      <p className="text-gray-500 text-sm tracking-wide">Analyzing cloud structure...</p>
    </div>
  );
}