import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

import * as examService from "../services/examService";
import {
	BookOpen,
	Play,
	Trash2,
	CheckCircle,
	AlertCircle,
	ArrowLeft,
	RefreshCw,
} from "lucide-react";

const Mistakes: React.FC = () => {
	const { lang } = useLanguage();

	const [subjects, setSubjects] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
	const [mistakes, setMistakes] = useState<any[]>([]);
	const [practiceMode, setPracticeMode] = useState(false);

	// Practice States
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isAnswered, setIsAnswered] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [practiceFinished, setPracticeFinished] = useState(false);

	useEffect(() => {
		fetchSubjects();
	}, []);

	const fetchSubjects = async () => {
		setLoading(true);
		try {
			const data = await examService.getMistakeSubjects();
			setSubjects(data);
		} catch (error) {
			console.error("Error fetching mistake subjects:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubjectClick = async (subjectName: string) => {
		setSelectedSubject(subjectName);
		try {
			const data = await examService.getMistakesBySubject(subjectName);
			setMistakes(data);
		} catch (error) {
			console.error("Error fetching mistakes:", error);
		}
	};

	const startPractice = () => {
		setPracticeMode(true);
		setCurrentIndex(0);
		setPracticeFinished(false);
		setIsAnswered(false);
		setSelectedOption(null);
	};

	const handleRestart = async () => {
		if (!selectedSubject) return;
		setLoading(true);
		try {
			const data = await examService.getMistakesBySubject(selectedSubject);
			setMistakes(data);
			if (data.length > 0) {
				setPracticeFinished(false);
				setPracticeMode(true);
				setCurrentIndex(0);
				setIsAnswered(false);
				setSelectedOption(null);
			} else {
				setPracticeFinished(false);
				setPracticeMode(false);
				setSelectedSubject(null);
				fetchSubjects();
			}
		} catch (error) {
			console.error("Error restarting practice:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAnswer = (option: string) => {
		if (isAnswered) return;
		const currentQuestion = mistakes[currentIndex].question_data;
		setSelectedOption(option);
		setIsAnswered(true);
		const correct = option === currentQuestion.correct_answer;
		setIsCorrect(correct);
	};

	const nextQuestion = async () => {
		// If correct, remove from database
		if (isCorrect) {
			try {
				await examService.deleteMistake(mistakes[currentIndex].id);
			} catch (error) {
				console.error("Error deleting mistake:", error);
			}
		}

		if (currentIndex < mistakes.length - 1) {
			setCurrentIndex((prev) => prev + 1);
			setIsAnswered(false);
			setSelectedOption(null);
		} else {
			setPracticeFinished(true);
		}
	};

	const resetPractice = () => {
		setPracticeMode(false);
		setSelectedSubject(null);
		setMistakes([]);
		fetchSubjects();
	};

	useEffect(() => {
		if (practiceMode && !practiceFinished) {
			document.body.classList.add("hide-mobile-nav");
		} else {
			document.body.classList.remove("hide-mobile-nav");
		}
		return () => document.body.classList.remove("hide-mobile-nav");
	}, [practiceMode, practiceFinished]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
				<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<AnimatePresence mode="wait">
					{!selectedSubject && !practiceMode && (
						<motion.div
							key="subjects"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
						>
							<div className="text-center mb-12">
								<h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
									{lang === "bn" ? "ভুল সংশোধন কেন্দ্র" : "Mistake Lab"}
								</h1>
								<p className="text-gray-500 dark:text-gray-400 font-medium">
									{lang === "bn"
										? "আপনার ভুল করা প্রশ্নগুলো এখানে প্র্যাকটিস করুন"
										: "Practice the questions you got wrong in exams"}
								</p>
							</div>

							{subjects.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{subjects.map((s, idx) => (
										<motion.button
											key={idx}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => handleSubjectClick(s.subject_name)}
											className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between group"
										>
											<div className="flex items-center gap-6">
												<div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
													<BookOpen size={28} />
												</div>
												<div className="text-left">
													<h3 className="text-xl font-black text-gray-900 dark:text-white">
														{s.subject_name}
													</h3>
													<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
														{lang === "bn" ? "ভুল সংশোধন করুন" : "Fix Mistakes"}
													</p>
												</div>
											</div>
											<div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
												<Play size={18} />
											</div>
										</motion.button>
									))}
								</div>
							) : (
								<div className="bg-white dark:bg-gray-800 rounded-[3rem] p-16 text-center shadow-2xl border border-gray-100 dark:border-gray-700">
									<div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
										<CheckCircle size={48} />
									</div>
									<h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
										{lang === "bn" ? "কোনো ভুল নেই!" : "No Mistakes Found!"}
									</h2>
									<p className="text-gray-500 dark:text-gray-400 font-medium">
										{lang === "bn"
											? "আপনি সব পরীক্ষায় দারুণ করেছেন। কোনো ভুল প্রশ্ন জমা নেই।"
											: "You've done great in all exams. No wrong questions are recorded."}
									</p>
								</div>
							)}
						</motion.div>
					)}

					{selectedSubject && !practiceMode && (
						<motion.div
							key="subject-details"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-700"
						>
							<button
								onClick={() => setSelectedSubject(null)}
								className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors mb-8 font-black text-xs uppercase tracking-widest"
							>
								<ArrowLeft size={16} /> {lang === "bn" ? "পিছনে" : "Back"}
							</button>

							<div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
								<div className="flex items-center gap-6">
									<div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
										<BookOpen size={32} />
									</div>
									<div>
										<h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
											{selectedSubject}
										</h2>
										<p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">
											{mistakes.length}{" "}
											{lang === "bn" ? "টি ভুল প্রশ্ন" : "Mistakes Recorded"}
										</p>
									</div>
								</div>
								<button
									onClick={startPractice}
									className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3"
								>
									<Play size={18} fill="currentColor" />{" "}
									{lang === "bn" ? "শুরু করুন" : "Start Practice"}
								</button>
							</div>

							<div className="space-y-4">
								<h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-2">
									{lang === "bn" ? "ভুল করা প্রশ্নগুলো" : "Questions to Fix"}
								</h3>
								{mistakes.map((m, idx) => (
									<div
										key={idx}
										className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-start gap-4"
									>
										<div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0 font-black text-xs">
											{idx + 1}
										</div>
										<p className="text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
											{m.question_data.question}
										</p>
									</div>
								))}
							</div>
						</motion.div>
					)}

					{practiceMode && !practiceFinished && (
						<motion.div
							key="practice"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-700"
						>
							<div className="flex justify-between items-center mb-10">
								<span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">
									{selectedSubject} • {lang === "bn" ? "প্রশ্ন" : "Question"}{" "}
									{currentIndex + 1}/{mistakes.length}
								</span>
								<button
									onClick={resetPractice}
									className="text-gray-400 hover:text-red-500 transition-colors"
								>
									<Trash2 size={20} />
								</button>
							</div>

							<div className="mb-10">
								<h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-8">
									{mistakes[currentIndex].question_data.question}
								</h2>

								<div className="grid grid-cols-1 gap-4">
									{Object.entries(
										mistakes[currentIndex].question_data.options,
									).map(([key, value]) => {
										const isSelected = selectedOption === key;
										const isCorrectOption =
											key ===
											mistakes[currentIndex].question_data.correct_answer;

										let buttonClass =
											"w-full p-6 rounded-3xl border-2 text-left font-bold transition-all flex items-center justify-between group ";

										if (!isAnswered) {
											buttonClass +=
												"border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300";
										} else {
											if (isCorrectOption) {
												buttonClass +=
													"border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
											} else if (isSelected) {
												buttonClass +=
													"border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
											} else {
												buttonClass +=
													"border-gray-100 dark:border-gray-700 opacity-50 text-gray-400";
											}
										}

										return (
											<button
												key={key}
												disabled={isAnswered}
												onClick={() => handleAnswer(key)}
												className={buttonClass}
											>
												<span className="flex items-center gap-4">
													<span
														className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${isSelected ? "bg-current text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}
													>
														{key}
													</span>
													{value as string}
												</span>
												{isAnswered && isCorrectOption && (
													<CheckCircle size={20} />
												)}
												{isAnswered && isSelected && !isCorrectOption && (
													<AlertCircle size={20} />
												)}
											</button>
										);
									})}
								</div>
							</div>

							{isAnswered && (
								<motion.div
									initial={{ opacity: 0, y: 20, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									transition={{ type: "spring", damping: 20, stiffness: 100 }}
									className="mb-10"
								>
									<div
										className={`p-8 rounded-[2rem] mb-8 ${isCorrect ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"} border border-current/10 shadow-inner`}
									>
										<div className="flex items-center gap-3 mb-6">
											<div
												className={`w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
											>
												{isCorrect ? (
													<CheckCircle size={20} />
												) : (
													<AlertCircle size={20} />
												)}
											</div>
											<span className="font-black uppercase text-sm tracking-[0.2em]">
												{isCorrect
													? lang === "bn"
														? "দারুণ! সঠিক উত্তর"
														: "Excellent! Correct"
													: lang === "bn"
														? "ভুল উত্তর"
														: "Wrong Answer"}
											</span>
										</div>

										<div className="space-y-6">
											{!isCorrect && (
												<div className="bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-current/5">
													<p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">
														{lang === "bn" ? "সঠিক উত্তর" : "Correct Answer"}
													</p>
													<p className="font-black text-lg">
														<span className="text-blue-600 dark:text-blue-400 mr-2">
															{
																mistakes[currentIndex].question_data
																	.correct_answer
															}
															.
														</span>
														{
															mistakes[currentIndex].question_data.options[
																mistakes[currentIndex].question_data
																	.correct_answer
															]
														}
													</p>
												</div>
											)}

											<div className="px-2">
												<p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">
													{lang === "bn" ? "ব্যাখ্যা" : "Explanation"}
												</p>
												<p className="font-bold leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
													{mistakes[currentIndex].question_data.explanation}
												</p>
											</div>
										</div>
									</div>

									<button
										onClick={nextQuestion}
										className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all active:scale-95"
									>
										{currentIndex < mistakes.length - 1
											? lang === "bn"
												? "পরবর্তী প্রশ্ন"
												: "Next Question"
											: lang === "bn"
												? "সব শেষ"
												: "All Done"}
									</button>
								</motion.div>
							)}
						</motion.div>
					)}

					{practiceFinished && (
						<motion.div
							key="finished"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-white dark:bg-gray-800 rounded-[3rem] p-16 text-center shadow-2xl border border-gray-100 dark:border-gray-700"
						>
							<div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-blue-500/40">
								<CheckCircle size={48} />
							</div>
							<h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
								{lang === "bn" ? "প্র্যাকটিস শেষ!" : "Practice Complete!"}
							</h2>
							<p className="text-gray-500 dark:text-gray-400 font-medium mb-12 max-w-md mx-auto">
								{lang === "bn"
									? "আপনি সফলভাবে ভুল প্রশ্নগুলো প্র্যাকটিস করেছেন। সঠিক উত্তর দেওয়া প্রশ্নগুলো আপনার লিস্ট থেকে মুছে ফেলা হয়েছে।"
									: "You've successfully practiced your mistakes. Correctly answered questions have been removed from your list."}
							</p>
							<div className="flex flex-col md:flex-row gap-4 justify-center">
								<button
									onClick={resetPractice}
									className="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
								>
									<ArrowLeft size={18} />{" "}
									{lang === "bn" ? "ফিরে যান" : "Go Back"}
								</button>
								<button
									onClick={handleRestart}
									className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95 flex items-center justify-center gap-3"
								>
									<RefreshCw size={18} />{" "}
									{lang === "bn" ? "আবার শুরু করুন" : "Restart"}
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Mistakes;
