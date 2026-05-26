import { useState, useRef, useCallback } from "react";
import { FiUploadCloud, FiTrash2, FiImage, FiX } from "react-icons/fi";

const BannerUploader = ({ onUpload, onCancel }) => {
  const [banners, setBanners] = useState([]);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview({ url, file });
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleUpload = () => {
    if (!preview) return;
    const newBanner = {
      id: Date.now(),
      url: preview.url,
      name: preview.file.name,
    };
    setBanners((prev) => [newBanner, ...prev]);
    setPreview(null);

    // TODO: Backend integration
    // const formData = new FormData();
    // formData.append("banner", preview.file);
    // await api.post("/banners/upload", formData);
    if (onUpload) onUpload(newBanner);
  };

  const handleDelete = (id) => {
    setBanners((prev) => {
      const banner = prev.find((b) => b.id === id);
      if (banner) URL.revokeObjectURL(banner.url);
      return prev.filter((b) => b.id !== id);
    });

    // TODO: Backend integration
    // await api.delete(`/banners/${id}`);
  };

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  return (
    <div className=" bg-[#F5F3FA] flex items-start justify-center p-10 px-6 font-sans rounded-lg">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#1A1025] mb-6 tracking-tight">
          Upload New Banner
        </h1>

        <div className="flex gap-6">
          {/* Left: Upload + Preview */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Drop zone */}
            <div>
              <p className="text-sm font-medium text-[#1A1025] mb-2">Banner Image</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2
                  ${dragging
                    ? "border-[#652D8B] bg-[#ede7f6]"
                    : "border-[#C5B8D8] bg-white hover:border-[#652D8B] hover:bg-[#faf7fd]"
                  }`}
              >
                <FiImage className="text-[#A78CC8] size-9" />
                <span className="text-sm text-[#8B6BAE] font-medium">
                  {dragging ? "Chhere din..." : "Upload Banner"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-xs text-[#9E8AB2] mt-2">Recommended: 361×144px</p>
            </div>

            {/* Preview box */}
            <div>
              <p className="text-sm font-medium text-[#1A1025] mb-2">Preview</p>
              <div className="w-full h-48 rounded-2xl border-2 border-dashed border-[#C5B8D8] bg-white flex items-center justify-center overflow-hidden relative">
                {preview ? (
                  <>
                    <img
                      src={preview.url}
                      alt="Preview"
                      className="w-full  object-fill"
                    />
                    <button
                      onClick={clearPreview}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition"
                    >
                      <FiX className="size-4 text-[#652D8B]" />
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-[#C0AFCF]">Preview </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-1">
              <button
                onClick={handleUpload}
                disabled={!preview}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#652D8B] text-white font-semibold text-sm hover:bg-[#7B3BAD] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiUploadCloud className="size-4" />
                Upload Banner
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-3 rounded-xl border border-[#C5B8D8] text-[#1A1025] font-semibold text-sm hover:bg-[#EDE7F6] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right: Uploaded banners list */}
          <div className="w-72 mt-8 flex flex-col gap-3">
            {banners.length === 0 ? (
              <div className="w-full h-36 rounded-xl border-2 border-dashed border-[#C5B8D8] flex items-center justify-center">
                <span className="text-xs text-[#C0AFCF] text-center px-3">
                  Upload banners will appear here. You can manage them by deleting or replacing as needed.
                </span>
              </div>
            ) : (
              banners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative rounded-xl overflow-hidden shadow-sm group"
                >
                  <img
                    src={banner.url}
                    alt={banner.name}
                    className="w-full h-20 object-cover"
                  />
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="absolute top-1.5 right-1.5 bg-white/80 hover:bg-red-500 hover:text-white rounded-full p-1 shadow transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 className="size-3.5" />
                  </button>
                  {/* Name tooltip */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1 opacity-0 group-hover:opacity-100 transition-all">
                    <p className="text-white text-[10px] truncate">{banner.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerUploader;