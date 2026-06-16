import { useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiImage, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useDeleteBannerMutation,
  useGetAllBannersQuery,
  useUploadBannersMutation,
} from "../redux/api/bannerApi";

const BannerUploader = () => {
  const [preview, setPreview] = useState(null); // single { url, file }
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { data, isLoading } = useGetAllBannersQuery({ page: 1, limit: 10 });
  const [uploadBanners, { isLoading: isUploading }] =
    useUploadBannersMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const banners = data?.data || [];
  console.log("banners: ", banners?.length);

  // ── File Handling ──────────────────────────────────────
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview({ url: URL.createObjectURL(file), file });
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = "";
  };

  // const handleDrop = useCallback((e) => {
  //   e.preventDefault();
  //   setDragging(false);
  //   handleFile(e.dataTransfer.files[0]);
  // }, []);

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  // ── Upload ─────────────────────────────────────────────
  const handleUpload = async () => {
    if (!preview) return;
    try {
      const formData = new FormData();
      formData.append("banner", preview.file);
      await uploadBanners(formData).unwrap();
      URL.revokeObjectURL(preview.url);
      setPreview(null);
      toast.success("Banner uploaded successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload banner");
    }
  };

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete banner");
    }
  };

  return (
    <div className="bg-[#F5F3FA] p-8 font-sans rounded-lg">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-[#1A1025] mb-6 tracking-tight">
          Upload New Banner
        </h1>

        <div className="flex gap-6 items-start">
          {/* ── Left: Drop zone ── */}
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-sm font-medium text-[#1A1025] mb-2">
              Banner Image
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              // onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              className={`w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${
                  dragging
                    ? "border-[#652D8B] bg-[#ede7f6]"
                    : "border-[#C5B8D8] bg-white hover:border-[#652D8B] hover:bg-[#faf7fd]"
                }`}
            >
              <FiImage className="text-[#A78CC8] size-9" />
              <span className="text-sm text-[#8B6BAE] font-medium">
                {dragging ? "Drop here..." : "Upload Banner"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>
            <p className="text-xs text-[#9E8AB2] mt-2">
              Recommended: 361×144px
            </p>
          </div>

          {/* ── Middle: Preview ── */}
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-sm font-medium text-[#1A1025] mb-2">Preview</p>
            <div className="w-full h-48 rounded-2xl border-2 border-dashed border-[#C5B8D8] bg-white flex items-center justify-center overflow-hidden relative">
              {preview ? (
                <>
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={clearPreview}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition"
                  >
                    <FiX className="size-4 text-[#652D8B]" />
                  </button>
                </>
              ) : (
                <span className="text-sm text-[#C0AFCF]">Preview</span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpload}
                disabled={!preview || isUploading}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#652D8B] text-white font-semibold text-sm hover:bg-[#7B3BAD] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiUploadCloud className="size-4" />
                {isUploading ? "Uploading..." : "Upload Banner"}
              </button>
              <button
                onClick={clearPreview}
                className="flex-1 py-3 rounded-xl border border-[#C5B8D8] text-[#1A1025] font-semibold text-sm hover:bg-[#EDE7F6] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* ── Right: Uploaded banners from API ── */}
          <div className="w-64 mt-8">
            <div className="h-105 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-[#C5B8D8]">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-20 rounded-xl bg-[#E8E0F0] animate-pulse"
                  />
                ))
              ) : banners.length === 0 ? (
                <div className="w-full h-36 rounded-xl border-2 border-dashed border-[#C5B8D8] flex items-center justify-center">
                  <span className="text-xs text-[#C0AFCF] text-center px-3">
                    Uploaded banners will appear here.
                  </span>
                </div>
              ) : (
                banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="relative rounded-xl overflow-hidden shadow-sm group"
                  >
                    <img
                      src={banner.url}
                      alt="banner"
                      className="w-full h-20 object-cover"
                    />
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="absolute top-1.5 right-1.5 bg-white/80 hover:bg-red-500 hover:text-white rounded-full p-1 shadow transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 className="size-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerUploader;
