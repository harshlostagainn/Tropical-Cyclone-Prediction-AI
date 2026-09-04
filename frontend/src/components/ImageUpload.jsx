import { useState } from "react";

export default function ImageUpload({ onImageSelect, disabled }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onImageSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-200 px-5 py-2 rounded-lg border border-gray-600 transition">
        <span>Choose Satellite Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="max-w-xs rounded-lg border border-gray-700"
        />
      )}
    </div>
  );
}