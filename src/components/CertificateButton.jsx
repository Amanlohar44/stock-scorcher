import { downloadCertificate } from "../utils/generateCertificate";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CertificateButton() {
  const handleDownload = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

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

      await downloadCertificate(
  name,
  certificateId
);

      alert("✅ Certificate Downloaded Successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition"
    >
      🎓 Download Certificate
    </button>
  );
}