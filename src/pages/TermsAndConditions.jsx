import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import TextEditor from "../components/TextEditor";
import { LegalSkeleton } from "../components/shimmer/LegalSkeleton";


export default function TermsConditionsManagement() {
  const [content, setContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  
  // Sync server data to the editor state on load
  // useEffect(() => {
  //   if (data?.data?.content) {
  //     setContent(data.data.content);
  //   }
  // }, [data]);

  // --- HANDLER ---
  // const handleSave = async () => {
  //   try {
  //     if (data?.data) {
  //       // If the record exists, perform an UPDATE
  //       await updateTerms({ content }).unwrap();
  //     } else {
  //       // If no record exists, perform a CREATE
  //       await createTerms({ content }).unwrap();
  //     }

  //     // Success Feedback Logic
  //     setShowSuccess(true);
  //     refetch(); // Manually refresh data since tags aren't used
  //     toast.success("Terms & Conditions saved successfully");

  //     // Hide success banner after 3 seconds
  //     setTimeout(() => setShowSuccess(false), 3000);
  //   } catch (err) {
  //     toast.error(err?.data?.message || "Failed to save changes");
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
          Terms & Conditions
        </h1>
        <p className="text-gray-500 text-sm">
          Manage the legal agreement between you and your users.
        </p>
      </div>

      <div className="w-full max-w-225">
        <div className="w-full mb-6">
          <TextEditor
            content={content}
            onChange={(html) => setContent(html)}
            placeholder="Type your Terms & Conditions content here..."
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
            <CheckCircle2 size={16} /> Terms & Conditions updated successfully
          </div>
        </div>

        {/* Save Button */}
        <button
          
          className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.99] ${
             "bg-[#5B2EFF] text-white hover:bg-[#5B2EFF]"
          }`}
        >
          Save Terms & Conditions
        </button>
      </div>
    </div>
  );
}
