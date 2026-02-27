import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useExamState } from "../hooks/useExamState";
import { getGroupName, getSubjectName } from "../typescriptfile/utils";
import SetupScreen from "../components/SetupScreen";
import ExamMode from "../components/ExamMode";
import PracticeMode from "../components/PracticeMode";
import ReviewMode from "../components/ReviewMode";
import PracticeCompleted from "../components/PracticeCompleted";
import FinishedResult from "../components/FinishedResult";

const ExamCenter: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupParam = searchParams.get("group");
  const subjectParam = searchParams.get("subject");

  const state = useExamState();
  const { lang, examState, setGroupSubject, chaptersForSubject } = state;

  useEffect(() => {
    if (!groupParam || !subjectParam) {
      navigate("/");
    } else {
      setGroupSubject(groupParam, subjectParam);
    }
  }, [groupParam, subjectParam, navigate, setGroupSubject]);

  const groupName = getGroupName(groupParam, lang);
  const subjectName = getSubjectName(subjectParam, lang);

  const pageTitle = `${subjectName} - ${groupName} | ${lang === "bn" ? "কাফআহ পরীক্ষা কেন্দ্র" : "Kafa'ah Exam Center"}`;
  const pageDescription =
    lang === "bn"
      ? `${subjectName} অধ্যায়ভিত্তিক মডেল টেস্ট দিন। সম্পূর্ণ ফ্রি ইনশাআল্লাহ।`
      : `Take chapter-wise model tests for ${subjectName}. Completely free InshaAllah.`;
  const pageUrl = `https://kafaahbd.github.io/study-corner/exam?group=${groupParam}&subject=${subjectParam}`;

  // If no chapters for subject, show error
  if (chaptersForSubject.length === 0 && groupParam && subjectParam) {
    return (
      <div className="min-h-screen bg-geometric-light dark:bg-geometric-dark py-8 px-4">
        <Helmet>
          <title>{lang === "bn" ? "সাবজেক্ট পাওয়া যায়নি" : "Subject Not Found"} | Kafa'ah</title>
        </Helmet>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {lang === "bn" ? "সাবজেক্ট পাওয়া যায়নি" : "Subject Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {lang === "bn"
              ? "এই সাবজেক্টের জন্য এখনো কোনো অধ্যায় সংযুক্ত করা হয়নি।"
              : "No chapters have been added for this subject yet."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-green-600 dark:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {lang === "bn" ? "পেছনে যান" : "Go Back"}
          </button>
        </div>
        <div className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8">
          {lang === "bn"
            ? "প্রশ্ন বা উত্তরে ভুল পেলে দয়া করে আমাদের WhatsApp জানাবেন ।"
            : "Please let us know via WhatsApp if you find any mistakes."}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaahlogo5.png"
        />
      </Helmet>

      {examState === "setup" && <SetupScreen state={state} />}
      {examState === "running_exam" && <ExamMode state={state} />}
      {examState === "running_practice" && <PracticeMode state={state} />}
      {examState === "practice_review" && <ReviewMode state={state} />}
      {examState === "practice_completed" && <PracticeCompleted state={state} />}
      {examState === "finished" && <FinishedResult state={state} />}
    </>
  );
};

export default ExamCenter;