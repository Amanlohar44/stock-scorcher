import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaAward,
  FaShieldAlt,
} from "react-icons/fa";

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();

  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = async (id = certificateId) => {
    if (!id.trim()) {
      alert("Please enter a valid Certificate ID");
      return;
    }

    setLoading(true);
    setCertificate(null);
    setNotFound(false);

    try {
      const docRef = doc(db, "certificates", id.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCertificate(docSnap.data());
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Certificate Verification Error:", error);
      alert("Something went wrong while verifying the certificate.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setCertificateId(id);
      handleVerify(id);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-yellow-400 selection:text-black">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-zinc-950 border border-yellow-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
            <FaAward /> StockScorcher Credentials
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Verify Certificate 🛡️
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Enter the unique institutional certificate ID to check authenticity on-chain/database.
          </p>
        </div>

        {/* Input & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter ID (e.g. SSC-12345678)"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            className="flex-1 bg-black border border-yellow-500/30 rounded-2xl px-5 py-4 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-yellow-400 transition"
          />

          <button
            onClick={() => handleVerify()}
            disabled={loading}
            className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black text-xs hover:bg-yellow-300 transition cursor-pointer shadow-lg flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
          >
            <FaSearch /> {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-8 space-y-3">
            <div className="h-8 w-8 mx-auto rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin" />
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase">
              Querying Institutional Ledger...
            </p>
          </div>
        )}

        {/* Success / Verified State */}
        {certificate && (
          <div className="bg-zinc-900/80 rounded-3xl p-6 sm:p-8 border border-green-500/40 shadow-xl space-y-6">
            <div className="flex items-center gap-3 text-green-400 text-xl sm:text-2xl font-black">
              <FaCheckCircle className="shrink-0" />
              <span>Certificate Authenticated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-black/40 p-5 rounded-2xl border border-white/5">
              <div className="space-y-1">
                <span className="text-zinc-400 text-xs font-semibold">Student Name</span>
                <p className="font-bold text-white text-base">{certificate.studentName || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-xs font-semibold">Account Email</span>
                <p className="font-bold text-white truncate">{certificate.email || "N/A"}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-zinc-400 text-xs font-semibold">Masterclass Course</span>
                <p className="font-black text-yellow-400 text-base">{certificate.course || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-xs font-semibold">Completion Date</span>
                <p className="font-bold text-white">{certificate.completionDate || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-xs font-semibold">Certificate ID</span>
                <p className="font-mono font-bold text-yellow-400">{certificate.certificateId || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-xs font-semibold">Issued By</span>
                <p className="font-bold text-white">{certificate.issuedBy || "StockScorcher Academy"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-xs font-semibold">Founder / Director</span>
                <p className="font-bold text-white">{certificate.founder || "Aman Lohar"}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-semibold pt-2">
              <FaShieldAlt className="text-green-400" /> Cryptographically Verified Official Credential
            </div>
          </div>
        )}

        {/* Invalid / Not Found State */}
        {notFound && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 text-center space-y-3">
            <div className="flex justify-center items-center gap-3 text-red-400 text-xl sm:text-2xl font-black">
              <FaTimesCircle />
              <span>Invalid Certificate ID</span>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm">
              No matching records were found in the database. Please verify the ID and try again.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}