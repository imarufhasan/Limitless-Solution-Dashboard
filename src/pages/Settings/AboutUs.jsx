import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import TextEditor from "../../components/TextEditor";
import { LegalSkeleton } from "../../components/shimmer/LegalSkeleton";
import {
  useGetContentQuery,
  useSaveContentMutation,
} from "../../redux/api/profileApi";

const CONTENT_TYPE = "about_us";

export default function AboutUs() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { data, isLoading, refetch } = useGetContentQuery(CONTENT_TYPE);
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation();
  const [content, setContent] = useState(() => data?.data?.content || "");

  const handleSave = async () => {
    try {
      await saveContent({ type: CONTENT_TYPE, content }).unwrap();
      setShowSuccess(true);
      refetch();
      toast.success("About Us updated successfully");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save changes");
    }
  };

  if (isLoading) return <LegalSkeleton />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:p-12 font-sans text-slate-800">
      <div className="w-full max-w-225 mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">About Us</h1>
        <p className="text-gray-500 text-sm">
          Update the information displayed on your public About page.
        </p>
      </div>

      <div className="w-full max-w-225">
        <div className="w-full mb-6">
          <TextEditor
            content={content}
            onChange={(html) => setContent(html)}
            placeholder="Tell your story here..."
            minHeight="500px"
          />
        </div>

        <div className="h-8 flex justify-center items-center mb-4">
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-2 rounded-full text-sm font-bold border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 size={16} /> Changes saved successfully
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] tracking-wide ${
            isSaving
              ? "bg-purple-300 text-white cursor-not-allowed"
              : "bg-[#652D8B] text-white hover:bg-[#7b3aa8]"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
