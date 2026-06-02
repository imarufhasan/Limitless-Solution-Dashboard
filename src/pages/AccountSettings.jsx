import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import TextEditor from "../components/TextEditor";
import { LegalSkeleton } from "../components/shimmer/LegalSkeleton";

export default function AboutUsManagement() {
  const [content, setContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);



  // Sync server data to local state when page loads


  // --- HANDLER ---
  const handleSave = async () => {
    try {
      if (data?.data) {
        // If content exists in DB, use UPDATE
        await updateAboutUs({ content }).unwrap();
      } else {
        // If DB is empty, use CREATE
        await createAboutUs({ content }).unwrap();
      }

      // Success Logic
      setShowSuccess(true);
      refetch(); // Manually refresh the GET query
      setTimeout(() => setShowSuccess(false), 3000);
      toast.success("About Us updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save changes");
    }
  };

  // if (isLoading) {
  //   return <LegalSkeleton />;
  // }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:p-12 font-sans text-slate-800">
      <div className="w-full max-w-225 mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">About Us</h1>
        <p className="text-gray-500 text-sm">
          Update the information displayed on your public About page.
        </p>
      </div>

      {/* Editor Container */}
      <div className="w-full max-w-225">
        <div className="w-full mb-6">
          <TextEditor
            content={content}
            onChange={(html) => setContent(html)}
            placeholder="Tell your story here..."
            minHeight="500px"
          />
        </div>

        {/* Status Message Area */}
        <div className="h-8 flex justify-center items-center mb-4">
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-2 rounded-full text-sm font-bold border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 size={16} /> Changes saved successfully
            </div>
          )}
        </div>

        {/* Save Action */}
        <div className="w-full">
          <button
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] tracking-wide ${
            
                 "bg-[#652D8B] text-white hover:bg-[#652D8B] shadow-slate-200"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
