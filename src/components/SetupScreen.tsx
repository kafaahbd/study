import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import type { ExamHookState } from "../typescriptfile/types";

interface Props {
  state: ExamHookState;
}

const SetupScreen: React.FC<Props> = ({ state }) => {
  const navigate = useNavigate();
  const {
    lang,
    chaptersForSubject,
    selectedChapters,
    setSelectedChapters,
    duration,
    setDuration,
    questionCount,
    setQuestionCount,
    mode,
    setMode,
    loadQuestions,
  } = state;

  const handleBack = () => navigate(-1);

  const selectAllChapters = () => {
    setSelectedChapters(
      chaptersForSubject.filter((ch) => ch.url !== "#").map((ch) => ch.name)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-2 lg:py-8 px-2 lg:px-4 transition-colors">
      {/* Top Header */}
      <div className="w-full lg:w-[70%] mx-auto flex items-center justify-between mb-4 lg:mb-8">
        <button onClick={handleBack} className="group flex items-center text-gray-500 hover:text-green-600 transition-colors font-bold text-xs lg:text-base">
          <i className="fas fa-arrow-left mr-1 lg:mr-2"></i>
          {lang === "bn" ? "পেছনে" : "Back"}
        </button>
        <img
          src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
          alt="Kafa'ah"
          className="h-6 lg:h-10"
        />
      </div>

      {/* Main Setup Card */}
      <div className="w-full lg:w-[70%] mx-auto bg-white dark:bg-gray-900 p-4 lg:p-10 rounded-2xl lg:rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-4 lg:mb-10">
          <h1 className="text-xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">
            {lang === "bn" ? "পরীক্ষা সেটআপ" : "Exam Setup"}
          </h1>
          <div className="h-1 w-12 lg:w-20 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* 1. Mode Selection (Practice vs Exam) */}
        <div className="mb-4 lg:mb-10">
          <h2 className="text-[9px] lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2 lg:mb-4">
            {lang === "bn" ? "১. মোড নির্বাচন" : "1. Select Mode"}
          </h2>
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            {([
              { id: "practice", label: lang === "bn" ? "প্র্যাকটিস" : "Practice", icon: "fa-laptop-code" },
              { id: "exam", label: lang === "bn" ? "এক্সাম" : "Exam", icon: "fa-stopwatch" }
            ] as const).map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-2 lg:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-0.5 lg:gap-2 ${
                  mode === m.id 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm" 
                  : "border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200"
                }`}
              >
                <i className={`fas ${m.icon} text-sm lg:text-xl`}></i>
                <span className="font-bold text-xs lg:text-base">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Chapter Selection */}
        <div className="mb-4 lg:mb-10">
          <div className="flex justify-between items-center mb-2 lg:mb-4">
            <h2 className="text-[9px] lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
              {lang === "bn" ? "২. অধ্যায়সমূহ" : "2. Chapters"}
            </h2>
            <button onClick={selectAllChapters} className="text-[9px] lg:text-xs font-bold text-green-600 hover:underline">
              {lang === "bn" ? "সবগুলো" : "Select All"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 lg:gap-3 max-h-[200px] lg:max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {chaptersForSubject.map((ch, index: number) => {
              const isDisabled = ch.url === "#";
              const isSelected = selectedChapters.includes(ch.name);
              
              return (
                <label
                  key={index}
                  className={`flex items-center space-x-2 p-2.5 lg:p-4 border-2 rounded-lg lg:rounded-xl cursor-pointer transition-all ${
                    isDisabled ? "opacity-40 cursor-not-allowed bg-gray-50" : 
                    isSelected ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-gray-50 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChapters([...selectedChapters, ch.name]);
                      } else {
                        setSelectedChapters(selectedChapters.filter((n: string) => n !== ch.name));
                      }
                    }}
                    className="w-3.5 h-3.5 lg:w-5 lg:h-5 rounded accent-green-600"
                  />
                  <span className="text-[10px] lg:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {ch.name} {isDisabled && (lang === "bn" ? "(শীঘ্রই)" : "(Soon)")}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Question Count & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 mb-4 lg:mb-10">
          <div>
            <h2 className="text-[9px] lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2 lg:mb-4">
              {lang === "bn" ? "৩. প্রশ্ন সংখ্যা" : "3. Questions"}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {[5, 15, 25,30, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`px-2.5 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-xl font-bold transition-all text-xs lg:text-base ${
                    questionCount === num 
                    ? "bg-green-600 text-white shadow-md shadow-green-200" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {mode === "exam" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-[9px] lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2 lg:mb-4">
                {lang === "bn" ? "৪. সময় (মিনিট)" : "4. Duration"}
              </h2>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2 lg:p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-lg lg:rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-green-500 text-xs lg:text-base"
              >
                {[10, 20, 30, 45, 60].map(t => (
                  <option key={t} value={t}>{t} {lang === "bn" ? "মিনিট" : "Mins"}</option>
                ))}
              </select>
            </motion.div>
          )}
        </div>

        {/* Start Button */}
        <button
          onClick={loadQuestions}
          disabled={selectedChapters.length === 0}
          className="w-full bg-green-600 dark:bg-green-500 text-white py-3 lg:py-5 rounded-xl lg:rounded-2xl text-base lg:text-xl font-black hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          {lang === "bn" ? "শুরু করুন" : "START EXAM"}
        </button>
      </div>

      {/* Footer Support */}
      <div className="mt-8 lg:mt-12 text-center pb-6 lg:pb-10">
        <a href="https://wa.me/+8801837103985" target="_blank">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
          <i className="fab fa-whatsapp text-green-500"></i>
          <span className="text-[10px] lg:text-xs font-medium text-gray-500">
            {lang === "bn" ? "যেকোনো সমস্যায় আমাদের জানান" : "Report any issues via WhatsApp"}
          </span>
        </div>
        </a>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SetupScreen;