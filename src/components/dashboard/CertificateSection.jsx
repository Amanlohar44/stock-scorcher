import React, { useState, useEffect } from "react";
import { FaAward, FaDownload, FaEye, FaCertificate, FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import CertificateButton from "../CertificateButton";
import { previewCertificate } from "../../utils/generateCertificate";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CertificateSection({ progress = 0 }) {
  const [testPassed, setTestPassed] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const user = auth.currentUser;
  const isCourseCompleted = progress >= 100;
  const currentProgress = Math.min(Math.max(progress, 0), 100);

  // Fetch test pass status from Firestore
  useEffect(() => {
    const fetchTestStatus = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "progress", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().testPassed) {
          setTestPassed(true);
        }
      } catch (err) {
        console.error("Error fetching test status:", err);
      }
    };
    fetchTestStatus();
  }, [user]);

  // Quiz Questions
  const questions = [
    {
      id: 1,
      question: "What does a Bull Market represent in trading?",
      options: [
        "A market with falling prices and pessimism",
        "A market with rising prices and optimism",
        "A sideways market with no price momentum",
        "A government-regulated market crash"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "What does RSI stand for in technical analysis?",
      options: [
        "Risk System Index",
        "Rapid Stock Indicator",
        "Relative Strength Index",
        "Return on Stock Investment"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "Which order type executes immediately at the current market price?",
      options: [
        "Limit Order",
        "Stop Loss Order",
        "Market Order",
        "GTT Order"
      ],
      correct: 2
    }
  ];

  const handleSelectOption = (qIdx, optIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  const handleSubmitQuiz = async () => {
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setQuizSubmitted(true);

    // If passed (at least 2 out of 3 correct)
    if (calculatedScore >= 2) {
      setTestPassed(true);
      if (user) {
        try {
          const docRef = doc(db, "progress", user.uid);
          await setDoc(docRef, { testPassed: true }, { merge: true });
        } catch (err) {
          console.error("Error saving test result:", err);
        }
      }
    }
  };

  const isCertificateUnlocked = isCourseCompleted && testPassed;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">

      {/* Header Banner */}
      <div className="bg-[#060606] rounded-3xl border border-yellow-500/30 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-yellow-400/5 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
              <FaCertificate size={12} /> Achievements & Certification
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              My <span className="text-yellow-400">Certificates</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm font-light mt-1 max-w-xl">
              Complete 100% course modules and pass the final trading assessment test to unlock and download your verified Stock Scorcher professional certificate.
            </p>
          </div>

          <div className="bg-[#030303] border border-white/10 px-6 py-4 rounded-2xl text-center shadow-inner">
            <span className="text-2xl md:text-3xl font-black text-yellow-400 block">{currentProgress}%</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Course Status</span>
          </div>
        </div>
      </div>

      {/* Certificate Card */}
      <div className="bg-[#060606] border border-yellow-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-yellow-400/60">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div className="flex items-start sm:items-center gap-5">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-4xl sm:text-5xl shrink-0 shadow-lg">
              <FaAward />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Complete Stock Market Masterclass
              </h2>

              <p className="text-zinc-400 text-xs sm:text-sm font-light">
                {!isCourseCompleted
                  ? `🔒 Course Progress: ${currentProgress}% (Reach 100% to unlock test)`
                  : !testPassed
                  ? `📝 Course 100% Completed! Final Assessment Test Required.`
                  : `🎉 Unlocked & Verified on: ${new Date().toLocaleDateString()}`}
              </p>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isCertificateUnlocked
                      ? "bg-green-500/10 border border-green-500/30 text-green-400"
                      : "bg-yellow-500/10 border border-yellow-500/35 text-yellow-400"
                  }`}
                >
                  {isCertificateUnlocked
                    ? "✅ Verified & Unlocked"
                    : isCourseCompleted
                    ? "📝 Take Test to Unlock"
                    : "🔒 Locked (Complete Course)"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
            {!isCertificateUnlocked ? (
              <button
                disabled={!isCourseCompleted}
                onClick={() => {
                  if (!isCourseCompleted) return;
                  setShowQuizModal(true);
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                }}
                className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isCourseCompleted
                    ? "bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:scale-105"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                }`}
              >
                <FaQuestionCircle size={14} /> {isCourseCompleted ? "Take Final Assessment Test" : "Complete Course First"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    const user = auth.currentUser;
                    const name =
                      user?.displayName ||
                      user?.email?.split("@")[0] ||
                      "Student";
                    previewCertificate(name);
                  }}
                  className="flex-1 sm:flex-none bg-yellow-400 text-black px-6 py-3.5 rounded-2xl font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:scale-105"
                >
                  <FaEye size={14} /> Preview Certificate
                </button>

                <div className="flex-1 sm:flex-none">
                  <CertificateButton />
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-yellow-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-yellow-400">🎓 Final Trading Assessment Test</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Answer correctly (at least 2/3) to unlock your certificate.</p>
              </div>
              <button
                onClick={() => setShowQuizModal(false)}
                className="h-8 w-8 rounded-xl bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-6">
                {questions.map((q, qIdx) => (
                  <div key={q.id} className="bg-zinc-900/60 border border-white/10 p-5 rounded-2xl space-y-3">
                    <h4 className="text-sm font-bold text-white">
                      Q{qIdx + 1}. {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            selectedAnswers[qIdx] === optIdx
                              ? "bg-yellow-400/10 border-yellow-400 text-yellow-300 font-bold"
                              : "bg-[#060606] border-white/10 text-zinc-300 hover:border-white/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIdx}`}
                            checked={selectedAnswers[qIdx] === optIdx}
                            onChange={() => {}}
                            className="accent-yellow-400"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < questions.length}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    Object.keys(selectedAnswers).length === questions.length
                      ? "bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  Submit Assessment Test
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6 py-6">
                {score >= 2 ? (
                  <div className="space-y-4">
                    <div className="h-16 w-16 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 text-2xl font-bold">
                      <FaCheckCircle />
                    </div>
                    <h4 className="text-2xl font-black text-white">Congratulations! You Passed! 🎉</h4>
                    <p className="text-zinc-400 text-xs">
                      Your score: <strong className="text-yellow-400">{score}/{questions.length}</strong>. Your certificate has been successfully unlocked!
                    </p>
                    <button
                      onClick={() => setShowQuizModal(false)}
                      className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer shadow-lg"
                    >
                      View & Download Certificate →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-16 w-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-2xl font-bold">
                      <FaTimesCircle />
                    </div>
                    <h4 className="text-2xl font-black text-white">Test Not Passed</h4>
                    <p className="text-zinc-400 text-xs">
                      Your score: <strong className="text-red-400">{score}/{questions.length}</strong>. You need at least 2 correct answers to unlock the certificate. Please try again!
                    </p>
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                      }}
                      className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer"
                    >
                      Retry Test
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}