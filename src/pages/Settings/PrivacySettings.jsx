import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import TextEditor from "../../components/TextEditor";
import { LegalSkeleton } from "../../components/shimmer/LegalSkeleton";
import {
  useGetContentQuery,
  useSaveContentMutation,
} from "../../redux/api/profileApi";

const CONTENT_TYPE = "privacy_policy";

export default function PrivacyPolicyManagement() {
  const [content, setContent] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, isLoading, refetch } = useGetContentQuery(CONTENT_TYPE);
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation();

  const serverContent = data?.data?.content ?? "";
  if (!initialized && serverContent) {
    setContent(serverContent);
    setInitialized(true);
  }

  const handleSave = async () => {
    try {
      const res = await saveContent({ type: CONTENT_TYPE, content }).unwrap();
      if (res?.success) {
        setShowSuccess(true);
        refetch();
        toast.success(res?.message);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save privacy policy");
    }
  };

  if (isLoading) return <LegalSkeleton />;

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

        <div
          className={`h-8 flex justify-center transition-opacity duration-300 ${showSuccess ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100">
            <CheckCircle2 size={16} /> Privacy Policy updated successfully
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.99] ${
            isSaving
              ? "bg-purple-300 text-white cursor-not-allowed"
              : "bg-[#652D8B] text-white hover:bg-[#7b3aa8]"
          }`}
        >
          {isSaving ? "Saving..." : "Save Privacy Policy"}
        </button>
      </div>
    </div>
  );
}
