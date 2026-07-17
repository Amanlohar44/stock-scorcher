import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();

  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = async (id = certificateId) => {
    if (!id.trim()) {
      alert("Please enter Certificate ID");
      return;
    }

    setLoading(true);
    setCertificate(null);
    setNotFound(false);

    try {
      const docRef = doc(
        db,
        "certificates",
        id.trim()
      );

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCertificate(docSnap.data());
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setCertificateId(id);
      handleVerify(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-3xl bg-zinc-900 border border-yellow-500 rounded-2xl p-8">

        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">
          Verify Certificate
        </h1>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Enter Certificate ID (Example: SSC-12345678)"
            value={certificateId}
            onChange={(e) =>
              setCertificateId(e.target.value)
            }
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4 outline-none"
          />

          <button
            onClick={() => handleVerify()}
            className="bg-yellow-400 text-black px-8 rounded-xl font-bold hover:bg-yellow-300"
          >
            <FaSearch />
          </button>

        </div>
                {loading && (
          <p className="text-center mt-8 text-yellow-400">
            Verifying certificate...
          </p>
        )}

        {certificate && (
          <div className="mt-8 bg-zinc-800 rounded-2xl p-8 border border-green-500">

            <div className="flex items-center gap-3 text-green-400 text-2xl font-bold">
              <FaCheckCircle />
              Certificate Verified
            </div>

            <div className="mt-6 space-y-4 text-lg">

              <p>
                <span className="font-bold text-yellow-400">
                  Student Name :
                </span>{" "}
                {certificate.studentName}
              </p>

              <p>
                <span className="font-bold text-yellow-400">
                  Email :
                </span>{" "}
                {certificate.email}
              </p>

              <p>
                <span className="font-bold text-yellow-400">
                  Course :
                </span>{" "}
                {certificate.course}
              </p>

              <p>
                <span className="font-bold text-yellow-400">
                  Completion Date :
                </span>{" "}
                {certificate.completionDate}
              </p>

              <p>
                <span className="font-bold text-yellow-400">
                  Certificate ID :
                </span>{" "}
                {certificate.certificateId}
              </p>

              <p>
                <span className="font-bold text-yellow-400">
                  Issued By :
                </span>{" "}
                {certificate.issuedBy}
              </p>

              <p>
                <span className="font-bold text-yellow-400">
                  Founder :
                </span>{" "}
                {certificate.founder}
              </p>

            </div>

          </div>
        )}

        {notFound && (
          <div className="mt-8 bg-red-900 border border-red-500 rounded-2xl p-8 text-center">

            <div className="flex justify-center items-center gap-3 text-red-300 text-2xl font-bold">
              <FaTimesCircle />
              Invalid Certificate
            </div>

            <p className="mt-4 text-gray-300">
              No certificate was found with this Certificate ID.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}