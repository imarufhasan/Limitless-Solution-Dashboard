import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import TextEditor from "../components/TextEditor";
import { LegalSkeleton } from "../components/shimmer/LegalSkeleton";


export default function PrivacyPolicyManagement() {
  const [content, setContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);


 
  // Sync data from API to state


  // --- HANDLER ---
  // const handleSave = async () => {
  //   try {
  //     if (data?.data) {
  //       // If data exists, we UPDATE
  //       await updatePrivacy({ content }).unwrap();
  //     } else {
  //       // If no data exists yet, we CREATE
  //       await createPrivacy({ content }).unwrap();
  //     }

  //     // UI Success Feedback
  //     setShowSuccess(true);
  //     refetch(); // Manually refresh since providesTags/invalidatesTags are not used
  //     setTimeout(() => setShowSuccess(false), 3000);
  //     toast.success("Privacy Policy saved successfully");
  //   } catch (err) {
  //     toast.error(err?.data?.message || "Failed to save privacy policy");
  //   }
  // };

  // --- LOADING STATE (SHIMMER) ---
  // if (isLoading) {
  //   return <LegalSkeleton />;
  // }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:p-12 font-sans text-slate-800">
      <div className="w-full max-w-225 mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm">
          Update how you handle user data and legal compliance.
        </p>
      </div>

      <div className="w-full max-w-225">
        <div className="w-full mb-6">
          <TextEditor
            content={content}
            onChange={(html) => setContent(html)}
            placeholder="Type your Privacy Policy content here..."
            minHeight="500px"
          />
        </div>

        {/* Status Message Area */}
        <div
          className={`h-8 flex justify-center transition-opacity duration-300 ${
            showSuccess ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100">
            <CheckCircle2 size={16} /> Privacy Policy updated successfully
          </div>
        </div>

        {/* Action Button */}
        <button
          // onClick={handleSave}
          // disabled={isSaving}
          className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.99] ${
           
              "bg-[#652D8B] text-white hover:bg-[#652D8B]"
          }`}
        >
           Save Privacy Policy
        </button>
      </div>
    </div>
  );
}
