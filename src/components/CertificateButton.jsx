import generateCertificate from "../utils/generateCertificate";
import { auth } from "../firebase";

export default function CertificateButton() {
  const handleDownload = () => {
    const user = auth.currentUser;

    const name =
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "Student";

    generateCertificate(name);
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