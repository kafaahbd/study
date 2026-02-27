import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Latex from "react-latex-next";
import QuestionCard from "./QuestionCard";
import { type Question } from "../typescriptfile/types";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  state: any;
}

const ReviewMode: React.FC<Props> = ({ state }) => {
  const navigate = useNavigate();
  const {
    lang,
    questions,
    mistakes,
    reviewIndex,
    userAnswers,
    practiceMessage,
    hasChecked,
    selectedOptionColor,
    handleAnswerSelect,
    handleReviewCheck,
    handleReviewNextOrResult,
    setHasChecked,
    setPracticeMessage,
    setSelectedOptionColor,
  } = state;

  const mistakeId = mistakes[reviewIndex];
  const question = questions.find((q: Question) => q.id === mistakeId);

  useEffect(() => {
    setHasChecked(false);
    setPracticeMessage("");
    setSelectedOptionColor({});
  }, [question?.id, setHasChecked, setPracticeMessage, setSelectedOptionColor]);

  if (!question) return null;

  const isLastMistake = reviewIndex === mistakes.length - 1;
  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-6 px-4 transition-colors duration-500">
      {/* Header Area */}
      <div className="w-[95%] lg:w-[70%] mx-auto flex items-center justify-between mb-8">
        <button 
          onClick={handleBack} 
          className="flex items-center text-gray-500 hover:text-red-500 transition-colors font-bold"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          {lang === "bn" ? "পেছনে" : "Back"}
        </button>
        
        <div className="flex flex-col items-center">
          <img
            src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
            alt="Kafa'ah"
            className="h-8 md:h-10 mb-1"
          />
          <span className="text-[10px] uppercase tracking-widest font-black text-red-500 animate-pulse">
            {lang === "bn" ? "ভুল সংশোধন" : "Fixing Mistakes"}
          </span>
        </div>

        <div className="bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
          <span className="text-xs font-bold text-red-600 dark:text-red-400">
            {lang === "bn" ? `বাকি: ${mistakes.length}` : `Left: ${mistakes.length}`}
          </span>
        </div>
      </div>

      {/* Main Review Card */}
      <main className="flex justify-center">
        <div className="w-[95%] lg:w-[70%] bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-red-100 dark:shadow-none border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-full -mr-16 -mt-16 transition-all"></div>

          {/* Question Header */}
          <div className="relative mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-bold text-gray-500">
                #{reviewIndex + 1}
              </span>
              <div className="h-[2px] flex-1 bg-gray-100 dark:bg-gray-800"></div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
              <Latex>{question.question}</Latex>
            </h2>
          </div>

          {/* Options Section */}
          <div className="relative z-10">
            <QuestionCard
              question={question}
              userAnswer={userAnswers[question.id]}
              onAnswerSelect={handleAnswerSelect}
              disabled={hasChecked}
              colorMap={selectedOptionColor}
            />
          </div>

          {/* Explanation Section */}
          <AnimatePresence>
            {hasChecked && practiceMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-2xl"
              >
                <div className="flex items-center mb-2 text-amber-700 dark:text-amber-500 font-black uppercase text-xs tracking-tighter">
                  <i className="fas fa-lightbulb mr-2"></i>
                  {lang === "bn" ? "সঠিক ব্যাখ্যা" : "Correct Explanation"}
                </div>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  <Latex>{practiceMessage}</Latex>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            {!hasChecked ? (
              <button
                onClick={() => handleReviewCheck(question.id, userAnswers[question.id])}
                disabled={!userAnswers[question.id]}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-30 transition-all font-black text-lg shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
              >
                {lang === "bn" ? "চেক করুন" : "Check Answer"}
              </button>
            ) : (
              <button
                onClick={handleReviewNextOrResult}
                className="w-full py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-black text-lg shadow-lg shadow-green-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
              >
                {isLastMistake
                  ? (lang === "bn" ? "ফলাফল দেখুন" : "View Results")
                  : (lang === "bn" ? "পরবর্তী ভুল" : "Next Mistake")}
                <i className={`fas ${isLastMistake ? 'fa-flag-checkered' : 'fa-chevron-right'}`}></i>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
          <i className="fab fa-whatsapp text-green-500"></i>
          <span className="text-xs font-medium text-gray-500">
            {lang === "bn" ? "সংশোধনে সাহায্য লাগবে?" : "Need help with correction?"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewMode;