import React from "react";
import { useNavigate } from "react-router-dom";
import Latex from "react-latex-next";
import QuestionCard from "./QuestionCard";
import { motion, AnimatePresence } from "framer-motion"; // অ্যানিমেশনের জন্য (ঐচ্ছিক কিন্তু দারুণ)

interface Props {
	state: any;
}

const PracticeMode: React.FC<Props> = ({ state }) => {
	const navigate = useNavigate();
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
		<div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-6 px-4 sm:px-6">
			{/* Header Section */}
			<div className="max-w-3xl mx-auto flex items-center justify-between mb-6">
				<button
					onClick={handleBack}
					className="group flex items-center text-gray-500 hover:text-green-600 transition-colors font-medium"
				>
					<i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
					{lang === "bn" ? "পেছনে" : "Back"}
				</button>

				<img
					src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
					alt="Kafa'ah"
					className="h-8 md:h-10 object-contain"
				/>

				<div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold tracking-wider uppercase">
					{lang === "bn" ? "প্র্যাকটিস" : "Practice"}
				</div>
			</div>

			{/* Progress Section */}
			<div className="max-w-3xl mx-auto mb-8">
				<div className="flex justify-between items-end mb-2">
					<h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
						{lang === "bn" ? "প্রশ্ন নম্বর" : "Question"}{" "}
						{currentQuestionIndex + 1}
					</h3>
					<span className="text-sm font-bold text-green-600">
						{Math.round(progress)}%
					</span>
				</div>
				<div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${progress}%` }}
						className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
					/>
				</div>
			</div>

			{/* Main Question Card Container */}
			<main className="max-w-full flex justify-center mx-auto">
				<div className="w-[95%] lg:w-[70%] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300">
					{/* Question Title */}
					<div className="mb-8">
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
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

					{/* Explanation Section */}
					<AnimatePresence>
						{hasChecked && practiceMessage && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-xl overflow-hidden"
							>
								<div className="flex items-center mb-2 text-blue-700 dark:text-blue-400 font-bold uppercase text-xs tracking-widest">
									<i className="fas fa-info-circle mr-2"></i>
									{lang === "bn" ? "ব্যাখ্যা" : "Explanation"}
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
								onClick={() =>
									handleCheckAnswer(
										currentQuestion.id,
										userAnswers[currentQuestion.id],
									)
								}
								disabled={!userAnswers[currentQuestion?.id]}
								className="w-full py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-30 transition-all font-bold text-lg shadow-lg active:scale-95"
							>
								{lang === "bn" ? "উত্তর চেক করুন" : "Check Answer"}
							</button>
						) : (
							<button
								onClick={handleNextOrResult}
								className="w-full py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-bold text-lg shadow-lg active:scale-95 flex items-center justify-center gap-2"
							>
								{isLast
									? lang === "bn"
										? "ফলাফল দেখুন"
										: "View Results"
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
			</main>
		</div>
	);
};

export default PracticeMode;
