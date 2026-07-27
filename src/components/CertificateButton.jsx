import { useState } from "react";
import { downloadCertificate } from "../utils/generateCertificate";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Loader2, Award } from "lucide-react";

export default function CertificateButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Please log in to download your certificate.");
        setLoading(false);
        return;
      }

      const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Student";

      const certificateId =
        "SSC-" + Date.now().toString().slice(-8);

      await setDoc(doc(db, "certificates", certificateId), {
        certificateId,
        studentName: name,
        email: user.email,
        course: "Stock Market Mastery Course",
        completionDate: new Date().toLocaleDateString("en-GB"),
        issuedBy: "Stock Scorcher",
        founder: "Aman Lohar",
        createdAt: new Date(),
      });

      await downloadCertificate(name, certificateId);

      alert("✅ Certificate Downloaded Successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating your certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="w-full group inline-flex items-center justify-center gap-2.5 bg-yellow-400 hover:bg-yellow-500 text-black py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-yellow-400/20 active:scale-95 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Generating Certificate...</span>
        </>
      ) : (
        <>
          <Award className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span>Download Completion Certificate</span>
        </>
      )}
    </button>
  );
}