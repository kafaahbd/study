import { useEffect, useState } from 'react';
import { getUserExamHistory } from '../services/examService';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

interface ExamHistory {
  subject_name: string;
  score: number | string;
  total_questions: number | string;
  correct_answers?: number;
  time_taken?: number;
  created_at: string;
}

const Dashboard = () => {
  const [history, setHistory] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getUserExamHistory();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("History load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  // --- ক্যালকুলেশন ফিক্সড ---
  const totalExams = history.length;
  
  const avgScore = totalExams > 0 
    ? Math.round(
        history.reduce((acc, curr) => {
          const score = Number(curr.score);
          const total = Number(curr.total_questions);
          
          // যদি score অলরেডি শতাংশ হয় (যেমন ৮০), তবে সেটিকে প্রাপ্ত নম্বর হিসেবে ধরা হবে না
          // আমরা চেক করছি score কি total এর চেয়ে বড়? যদি বড় হয় তবে সেটি শতাংশ ডাটা।
          const actualPercentage = score > total ? score : (score / total) * 100;
          
          return acc + actualPercentage;
        }, 0) / totalExams
      )
    : 0;

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 lg:py-10 px-3 lg:px-4 transition-colors">
      <SEO 
        title={lang === "bn" ? "ড্যাশবোর্ড - কাফআহ" : "Dashboard - Kafa'ah"} 
        description={lang === "bn" ? "আপনার পরীক্ষার পরিসংখ্যান এবং অগ্রগতি দেখুন।" : "View your exam statistics and progress."}
        image="https://raw.githubusercontent.com/kafaahbd/Eng2/refs/heads/main/studyy.jpg"
        url="/dashboard"
      />
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 lg:mb-10 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-sm lg:text-base">
              {lang === 'bn' ? 'আপনার সফলতার যাত্রা এখানে' : 'Track your learning journey here'}
            </p>
          </div>
          <div className="flex gap-2 lg:gap-3 w-full lg:w-auto">
             <Link to="/profile" className="flex-1 lg:flex-none text-center px-4 lg:px-6 py-2.5 lg:py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-bold rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 text-sm lg:text-base">
                {lang === 'bn' ? 'প্রোফাইল' : 'Profile'}
             </Link>
             <Link to="/exam" className="flex-1 lg:flex-none text-center px-4 lg:px-8 py-2.5 lg:py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl lg:rounded-2xl shadow-lg shadow-green-600/20 transition-all active:scale-95 text-sm lg:text-base">
                + {lang === 'bn' ? 'নতুন পরীক্ষা' : 'New Exam'}
             </Link>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <StatCard title="Total Exams" val={totalExams.toString().padStart(2, '0')} icon="fa-tasks" color="bg-blue-500" />
          <StatCard title="Average Score" val={`${avgScore}%`} icon="fa-chart-pie" color="bg-purple-500" />
          <StatCard title="Status" val={totalExams > 0 ? (avgScore > 70 ? 'Expert' : 'Active') : 'Newbie'} icon="fa-user-check" color="bg-orange-500" />
        </div>

        {/* History Table Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl lg:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5 lg:p-8 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
             <h2 className="text-lg lg:text-xl font-black text-gray-800 dark:text-white">Recent Activity</h2>
             <span className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase">{totalExams} Exams Found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px] lg:min-w-0">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-5 lg:px-8 py-4 lg:py-5">{lang === 'bn' ? 'বিষয়' : 'Subject'}</th>
                  <th className="px-5 lg:px-8 py-4 lg:py-5">{lang === 'bn' ? 'প্রাপ্ত নম্বর' : 'Score'}</th>
                  <th className="px-5 lg:px-8 py-4 lg:py-5">{lang === 'bn' ? 'সঠিকতা' : 'Accuracy'}</th>
                  <th className="px-5 lg:px-8 py-4 lg:py-5">{lang === 'bn' ? 'সময়' : 'Time'}</th>
                  <th className="px-5 lg:px-8 py-4 lg:py-5">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {history.map((item, i) => {
                  const s = Number(item.score);
                  const t = Number(item.total_questions);
                  const accuracy = s > t ? s : Math.round((s / t) * 100);
                  const displayScore = s > t ? (item.correct_answers || 0) : s;

                  return (
                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 lg:px-8 py-4 lg:py-5 font-bold text-gray-700 dark:text-gray-200 text-sm lg:text-base">{item.subject_name}</td>
                      <td className="px-5 lg:px-8 py-4 lg:py-5 font-black text-green-600 text-sm lg:text-base">{displayScore} / {t}</td>
                      <td className="px-5 lg:px-8 py-4 lg:py-5">
                         <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-16 lg:w-24 h-1.5 lg:h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden text-sm lg:text-base">
                               <div 
                                 className={`h-full rounded-full ${accuracy > 70 ? 'bg-green-500' : 'bg-orange-500'}`} 
                                 style={{ width: `${accuracy}%` }}
                               ></div>
                            </div>
                            <span className="text-[10px] lg:text-xs font-bold text-gray-400">{accuracy}%</span>
                         </div>
                      </td>
                      <td className="px-5 lg:px-8 py-4 lg:py-5 text-xs lg:text-sm font-bold text-gray-600 dark:text-gray-400">
                        {item.time_taken ? (
                          lang === 'bn' 
                            ? `${Math.floor(item.time_taken / 60)}মি. ${item.time_taken % 60}সে.`
                            : `${Math.floor(item.time_taken / 60)}m ${item.time_taken % 60}s`
                        ) : '--'}
                      </td>
                      <td className="px-5 lg:px-8 py-4 lg:py-5 text-xs lg:text-sm text-gray-500 font-medium">
                          {new Date(item.created_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {history.length === 0 && (
            <div className="p-20 text-center">
               <div className="text-4xl text-gray-200 mb-4"><i className="fas fa-history"></i></div>
               <p className="text-gray-400 font-medium italic">No exam records yet.</p>
               <Link to="/exam" className="mt-4 inline-block text-green-600 font-bold underline">Start your first test</Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  val: string;
  icon: string;
  color: string;
}

const StatCard = ({ title, val, icon, color }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5">
    <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-gray-200/50`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{val}</p>
    </div>
  </div>
);

export default Dashboard;