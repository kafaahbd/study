import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Latex from "react-latex-next";
import html2pdf from "html2pdf.js";

interface Props {
  state: any;
}

const PracticeCompleted: React.FC<Props> = ({ state }) => {
  const navigate = useNavigate();
  const reportTemplateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { lang, result, resetToSetup } = state;
  const handleBack = () => navigate(-1);

  if (!result) return null;

  const handleDownloadPdf = async () => {
    const element = reportTemplateRef.current;
    if (!element) return;

    setIsDownloading(true);
    element.classList.add("pdf-export-mode"); // পিডিএফ এর জন্য স্টাইল ফিক্স

    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Practice_Result_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg' as const, quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as const }
    };

    try {
      await html2pdf().set(options).from(element).save();
    } finally {
      element.classList.remove("pdf-export-mode");
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-8 px-4">
      {/* Navigation & Actions */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <button onClick={handleBack} className="flex items-center text-green-600 font-bold hover:opacity-75">
          <i className="fas fa-arrow-left mr-2"></i>
          {lang === "bn" ? "পেছনে" : "Back"}
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
          >
            <i className={isDownloading ? "fas fa-spinner animate-spin" : "fas fa-file-pdf"}></i>
            {lang === "bn" ? "PDF ডাউনলোড" : "Download PDF"}
          </button>
          <img
            src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
            alt="Kafa'ah"
            className="h-10 hidden sm:block"
          />
        </div>
      </div>

      {/* Result Container (PDF Reference) */}
      <div 
        ref={reportTemplateRef} 
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800"
      >
        {/* PDF Header */}
        <div className="text-center border-b-2 border-green-500 pb-6 mb-8">
          <img src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" alt="Logo" className="h-10 mx-auto mb-3" />
          <h1 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
            {lang === "bn" ? "প্র্যাকটিস রেজাল্ট" : "Practice Summary"}
          </h1>
        </div>

        {/* Score Summary */}
        <div className="flex justify-center mb-10">
          <div className="bg-green-50 dark:bg-green-900/20 px-10 py-6 rounded-3xl text-center border border-green-100 dark:border-green-800">
            <div className="text-6xl font-black text-green-600 mb-1">
              {result.correct} <span className="text-2xl text-gray-400">/ {result.total}</span>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              {lang === "bn" ? "সঠিক উত্তর" : "Correct Answers"}
            </p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-8">
          {result.results.map((item: any, idx: number) => {
            const userOptionText = item.userAnswer && item.options[item.userAnswer] ? item.options[item.userAnswer] : "";
            const correctOptionText = item.options[item.correctAnswer] || "";
            
            // Border logic based on status
            let accentColor = "border-gray-200 dark:border-gray-700";
            if (item.everWrong && item.isCorrect) accentColor = "border-yellow-400";
            else if (!item.isCorrect) accentColor = "border-red-500";
            else if (item.isCorrect) accentColor = "border-green-500";

            return (
              <div key={idx} className={`border-l-4 ${accentColor} pl-6 py-2 transition-all`}>
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {idx + 1}. <Latex>{item.question}</Latex>
                  </p>
                  {item.everWrong && item.isCorrect && (
                    <span className="flex-none ml-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-black rounded-full uppercase italic">
                      {lang === "bn" ? "সংশোধিত" : "Corrected"}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center gap-2 text-lg ${item.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-bold"}`}>
                    <i className={`fas ${item.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                    <p>
                      {lang === "bn" ? "আপনার উত্তর:" : "Your answer:"}{" "}
                      <Latex>{`${item.userAnswer ?? ""}. ${userOptionText}`}</Latex>
                    </p>
                  </div>

                  {!item.isCorrect && (
                    <div className="flex items-center gap-2 text-lg text-green-600 font-medium bg-green-50 dark:bg-green-900/10 p-2 rounded-lg border border-dashed border-green-200">
                      <i className="fas fa-check-double"></i>
                      <p>
                        {lang === "bn" ? "সঠিক উত্তর:" : "Correct answer:"}{" "}
                        <Latex>{`${item.correctAnswer}. ${correctOptionText}`}</Latex>
                      </p>
                    </div>
                  )}
                  
                  {item.explanation && (
                    <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm italic text-gray-600 dark:text-gray-400 border-l-2 border-indigo-400">
                       <Latex>{item.explanation}</Latex>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PDF Footer Info */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
           Generated by Kafa'ah Platform • {new Date().toLocaleString()}
        </div>
      </div>

      {/* Final Action */}
      <div className="mt-12 text-center pb-10">
        <button
          onClick={resetToSetup}
          className="px-12 py-4 bg-green-600 text-white font-black text-lg rounded-2xl hover:bg-green-700 transform transition hover:-translate-y-1 shadow-xl active:scale-95"
        >
          {lang === "bn" ? "আবার প্র্যাকটিস করুন" : "Practice Again"}
        </button>
      </div>

      <style>{`
        .pdf-export-mode {
          background-color: white !important;
          color: black !important;
        }
        .pdf-export-mode * {
          color: black !important;
          border-color: #e5e7eb !important;
        }
        .pdf-export-mode .text-green-600 { color: #16a34a !important; }
        .pdf-export-mode .text-red-600 { color: #dc2626 !important; }
        .pdf-export-mode .text-yellow-600 { color: #ca8a04 !important; }
        .pdf-export-mode .bg-green-50 { background-color: #f0fdf4 !important; }
      `}</style>
    </div>
  );
};

export default PracticeCompleted;