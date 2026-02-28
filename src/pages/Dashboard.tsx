import { useEffect, useState } from 'react';
import { getUserExamHistory } from '../services/examService';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [history, setHistory] = useState<any[]>([]);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
              {lang === 'bn' ? 'আপনার সফলতার যাত্রা এখানে' : 'Track your learning journey here'}
            </p>
          </div>
          <div className="flex gap-3">
             <Link to="/profile" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50">
                {lang === 'bn' ? 'প্রোফাইল' : 'Profile'}
             </Link>
             <Link to="/exam" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-600/20 transition-all active:scale-95">
                + {lang === 'bn' ? 'নতুন পরীক্ষা' : 'New Exam'}
             </Link>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Exams" val={totalExams.toString().padStart(2, '0')} icon="fa-tasks" color="bg-blue-500" />
          <StatCard title="Average Score" val={`${avgScore}%`} icon="fa-chart-pie" color="bg-purple-500" />
          <StatCard title="Status" val={totalExams > 0 ? (avgScore > 70 ? 'Expert' : 'Active') : 'Newbie'} icon="fa-user-check" color="bg-orange-500" />
        </div>

        {/* History Table Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
             <h2 className="text-xl font-black text-gray-800 dark:text-white">Recent Activity</h2>
             <span className="text-xs font-bold text-gray-400 uppercase">{totalExams} Exams Found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Subject</th>
                  <th className="px-8 py-5">Score</th>
                  <th className="px-8 py-5">Accuracy</th>
                  <th className="px-8 py-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {history.map((item, i) => {
                  const s = Number(item.score);
                  const t = Number(item.total_questions);
                  // Accuracy ফিক্স: যদি s অলরেডি শতাংশ হয়
                  const accuracy = s > t ? s : Math.round((s / t) * 100);
                  // Score ডিসপ্লে ফিক্স: যদি ডাটাবেজে পুরনো ভুল ডাটা থাকে (যেমন ৮০/৫), তবে সেটি সঠিক করে দেখানো
                  const displayScore = s > t ? (item.correct_answers || 0) : s;

                  return (
                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-8 py-5 font-bold text-gray-700 dark:text-gray-200">{item.subject_name}</td>
                      <td className="px-8 py-5 font-black text-green-600">{displayScore} / {t}</td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full rounded-full ${accuracy > 70 ? 'bg-green-500' : 'bg-orange-500'}`} 
                                 style={{ width: `${accuracy}%` }}
                               ></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400">{accuracy}%</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">
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

const StatCard = ({ title, val, icon, color }: any) => (
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