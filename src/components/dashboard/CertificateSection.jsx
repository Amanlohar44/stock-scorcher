import { FaAward, FaDownload, FaEye } from "react-icons/fa";
import CertificateButton from "../CertificateButton";
import { previewCertificate } from "../../utils/generateCertificate";
import { auth } from "../../firebase";

export default function CertificateSection({ progress }) {

  const isCompleted = progress >= 100;

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        🏆 My Certificates
      </h1>

      <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-4">

              <FaAward className="text-5xl text-yellow-400" />

              <div>

                <h2 className="text-2xl font-bold">
                  Complete Stock Market Masterclass
                </h2>

                <p className="text-gray-400 mt-2">
                  {isCompleted
                    ? `Completion Date : ${new Date().toLocaleDateString()}`
                    : "Complete all lessons to unlock your certificate"}
                </p>

                <span
                  className={`inline-block mt-4 px-4 py-2 rounded-full font-semibold ${
                    isCompleted
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {isCompleted ? "✅ Completed" : "🔒 Locked"}
                </span>

              </div>

            </div>

          </div>

          <div className="flex gap-4">

            <button
              disabled={!isCompleted}
              onClick={() => {
                if (!isCompleted) return;

                const user = auth.currentUser;

                const name =
                  user?.displayName ||
                  user?.email?.split("@")[0] ||
                  "Student";

                previewCertificate(name);
              }}
              className={`px-6 py-3 rounded-xl font-bold ${
                isCompleted
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              <FaEye className="inline mr-2" />
              View
            </button>
                        {isCompleted ? (
              <CertificateButton />
            ) : (
              <button
                disabled
                className="bg-gray-600 text-gray-300 px-6 py-3 rounded-xl font-bold cursor-not-allowed"
              >
                <FaDownload className="inline mr-2" />
                Locked
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}