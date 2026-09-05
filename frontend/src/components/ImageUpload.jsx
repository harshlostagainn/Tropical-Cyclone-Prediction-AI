import { useState } from "react";

export default function ImageUpload({ onImageSelect, disabled }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    onImageSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <label className="group cursor-pointer">
        <div className="flex items-center gap-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-6 py-3 rounded-xl border border-cyan-500/30 transition-all font-medium text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Satellite Image
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {preview && (
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={preview}
              alt="preview"
              className="w-56 h-56 object-cover rounded-xl border-2 border-gray-700"
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-500/20" />
          </div>
          <p className="text-gray-500 text-xs">{fileName}</p>
        </div>
      )}
    </div>
  );
}