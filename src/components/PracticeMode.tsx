import React from "react";
import { useNavigate } from "react-router-dom";
import Latex from "react-latex-next";
import QuestionCard from "./QuestionCard";
import { motion, AnimatePresence } from "framer-motion"; // অ্যানিমেশনের জন্য (ঐচ্ছিক কিন্তু দারুণ)

import type { ExamHookState } from "../typescriptfile/types";

interface Props {
	state: ExamHookState;
}

const PracticeMode: React.FC<Props> = ({ state }) => {
	const navigate = useNavigate();

	React.useEffect(() => {
		document.body.classList.add("hide-mobile-nav");
		return () => document.body.classList.remove("hide-mobile-nav");
	}, []);

	const {
		lang,
		questions,
		currentQuestionIndex,
		userAnswers,
		practiceMessage,
		hasChecked,
		selectedOptionColor,
		handleAnswerSelect,
		handleCheckAnswer,
		handleNextOrResult,
	} = state;

	const currentQuestion = questions[currentQuestionIndex];
	const isLast = currentQuestionIndex === questions.length - 1;
	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

	const handleBack = () => navigate(-1);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-2 px-2 sm:px-4">
			{/* Header Section */}
			<div className="max-w-3xl mx-auto flex items-center justify-between mb-3">
				<button
					onClick={handleBack}
					className="group flex items-center text-gray-500 hover:text-green-600 transition-colors font-medium text-xs"
				>
					<i className="fas fa-arrow-left mr-1 group-hover:-translate-x-1 transition-transform"></i>
					{lang === "bn" ? "পেছনে" : "Back"}
				</button>

				<img
					src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
					alt="Kafa'ah"
					className="h-6 md:h-10 object-contain"
				/>

				<div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[9px] font-bold tracking-wider uppercase">
					{lang === "bn" ? "প্র্যাকটিস" : "Practice"}
				</div>
			</div>

			{/* Progress Section */}
			<div className="max-w-3xl mx-auto mb-4">
				<div className="flex justify-between items-end mb-1">
					<h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
						{lang === "bn" ? "প্রশ্ন নম্বর" : "Question"}{" "}
						{currentQuestionIndex + 1}
					</h3>
					<span className="text-[10px] font-bold text-green-600">
						{Math.round(progress)}%
					</span>
				</div>
				<div className="h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${progress}%` }}
						className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
					/>
				</div>
			</div>

			{/* Main Question Card Container */}
			<main className="max-w-7xl mx-auto">
				<div className={`grid grid-cols-1 ${hasChecked && practiceMessage ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-4 transition-all duration-500`}>
					
					{/* Left Side: Question & Options */}
					<div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 md:p-10 rounded-2xl md:rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none transition-all duration-300 ${!hasChecked || !practiceMessage ? 'max-w-3xl mx-auto w-full' : ''}`}>
						{/* Question Title */}
						<div className="mb-4">
							<h2 className="text-base md:text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
								<Latex>{currentQuestion?.question}</Latex>
							</h2>
						</div>

						{/* Options */}
						<QuestionCard
							question={currentQuestion}
							userAnswer={userAnswers[currentQuestion?.id]}
							onAnswerSelect={handleAnswerSelect}
							disabled={hasChecked}
							colorMap={selectedOptionColor}
						/>

						{/* Mobile Explanation (Visible only on mobile) */}
						<div className="lg:hidden">
							<AnimatePresence>
								{hasChecked && practiceMessage && (
									<motion.div
										initial={{ opacity: 0, y: 10, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										transition={{ type: "spring", damping: 20, stiffness: 100 }}
										className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-xl overflow-hidden shadow-inner"
									>
										<div className="flex items-center mb-2 text-blue-700 dark:text-blue-400 font-black uppercase text-[10px] tracking-[0.2em]">
											<i className="fas fa-info-circle mr-1"></i>
											{lang === "bn" ? "ব্যাখ্যা" : "Explanation"}
										</div>
										<div className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-xs whitespace-pre-wrap">
											<Latex>{practiceMessage}</Latex>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 mt-6">
							{!hasChecked ? (
								<button
									onClick={() =>
										handleCheckAnswer(
											currentQuestion.id,
											userAnswers[currentQuestion.id],
										)
									}
									disabled={!userAnswers[currentQuestion?.id]}
									className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-30 transition-all font-bold text-sm shadow-md active:scale-95"
								>
									{lang === "bn" ? "উত্তর চেক করুন" : "Check Answer"}
								</button>
							) : (
								<button
									onClick={handleNextOrResult}
									className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-sm shadow-md active:scale-95 flex items-center justify-center gap-2"
								>
									{isLast
										? lang === "bn"
											? "ভুল সংশোধন করুন"
											: "Fix Mistakes"
										: lang === "bn"
											? "পরবর্তী প্রশ্ন"
											: "Next Question"}
									<i
										className={`fas ${isLast ? "fa-flag-checkered" : "fa-arrow-right"}`}
									></i>
								</button>
							)}
						</div>
					</div>

					{/* Right Side: Explanation (Visible only on PC) */}
					<AnimatePresence>
						{hasChecked && practiceMessage && (
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 50 }}
								className="hidden lg:block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none"
							>
								<div className="flex items-center mb-6 text-blue-700 dark:text-blue-400 font-black uppercase text-sm tracking-[0.3em]">
									<i className="fas fa-info-circle mr-3 text-xl"></i>
									{lang === "bn" ? "বিস্তারিত ব্যাখ্যা" : "Detailed Explanation"}
								</div>
								<div className="h-[2px] w-20 bg-blue-500 mb-8"></div>
								<div className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-lg whitespace-pre-wrap">
									<Latex>{practiceMessage}</Latex>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</main>
		</div>
	);
};

export default PracticeMode;
