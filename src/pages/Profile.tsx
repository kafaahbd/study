import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getUserExamHistory } from '../services/examService';

const Profile = () => {
  // ১. এখানে logout এর পাশাপাশি confirmLogout নিয়ে আসা হয়েছে
  const { user, isLoading, confirmLogout } = useAuth();
  const { t, lang } = useLanguage();
  
  const [stats, setStats] = useState<any[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserExamHistory();
        setStats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsStatsLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const totalExams = stats.length;

  const avgScore = totalExams > 0 
    ? Math.round(
        stats.reduce((acc, curr) => {
          const actualScore = Number(curr.score) > Number(curr.total_questions) ? Number(curr.correct_answers) : Number(curr.score);
          const percentage = (actualScore / Number(curr.total_questions)) * 100;
          return acc + percentage;
        }, 0) / totalExams
      )
    : 0;

  const activeDays = totalExams > 0 
    ? new Set(stats.map(s => new Date(s.created_at).toDateString())).size 
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGroupName = (group: string) => {
    const groups: Record<string, string> = {
      Science: lang === 'bn' ? 'বিজ্ঞান' : 'Science',
      Arts: lang === 'bn' ? 'মানবিক' : 'Arts',
      Commerce: lang === 'bn' ? 'বাণিজ্য' : 'Commerce',
    };
    return groups[group] || group;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 transition-colors">
      <div className="w-[95%] lg:w-[75%] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('profile.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
              {lang === 'bn' ? 'আপনার ব্যক্তিগত ড্যাশবোর্ড' : 'Your personal dashboard'}
            </p>
          </div>
          
          {/* ২. এখানে onClick এ confirmLogout ফাংশনটি বসানো হয়েছে */}
          <button 
            onClick={confirmLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
          >
            <i className="fas fa-sign-out-alt"></i>
            {lang === 'bn' ? 'লগ আউট' : 'Logout'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Identity Card & Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden mb-2"
            >
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-green-500 to-emerald-600 opacity-10"></div>
              
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-blue-500 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-4 border-4 border-white dark:border-gray-700 shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-green-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest">@{user.username}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-around">
                  <div>
                    <span className="block text-[10px] font-black text-gray-400 uppercase">Level</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{user.study_level}</span>
                  </div>
                  <div className="border-l border-gray-100 dark:border-gray-700"></div>
                  <div>
                    <span className="block text-[10px] font-black text-gray-400 uppercase">Group</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{getGroupName(user.group)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <Link to="/dashboard" className="p-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg font-bold active:scale-95">
              <i className="fas fa-th-large"></i>
              <span>{lang === 'bn' ? 'ড্যাশবোর্ডে যান' : 'Go to Dashboard'}</span>
            </Link>

            <Link to="/exam" className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-3 hover:border-green-500 transition-all group shadow-sm font-bold active:scale-95">
              <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                <i className="fas fa-edit"></i>
              </div>
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-green-600">Start New Exam</span>
            </Link>
          </div>

          {/* Stats & History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: lang === 'bn' ? 'মোট পরীক্ষা' : 'Exams Taken', val: totalExams.toString().padStart(2, '0'), color: 'text-blue-500' },
                { label: lang === 'bn' ? 'গড় স্কোর' : 'Avg Score', val: `${avgScore}%`, color: 'text-purple-500' },
                { label: lang === 'bn' ? 'অ্যাক্টিভ দিন' : 'Active Days', val: activeDays.toString().padStart(2, '0'), color: 'text-orange-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <span className="text-2xl font-black block mb-1 text-gray-900 dark:text-white">{isStatsLoading ? '...' : stat.val}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}>{stat.label}</span>
                </div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <i className="fas fa-history text-green-600"></i>
                {lang === 'bn' ? 'সাম্প্রতিক পরীক্ষা' : 'Recent Exams'}
              </h3>

              <div className="space-y-4">
                {isStatsLoading ? (
                   <p className="text-center py-4 text-gray-400">Loading activity...</p>
                ) : stats.length > 0 ? (
                  stats.slice(0, 5).map((exam, index) => {
                    const displayScore = Number(exam.score) > Number(exam.total_questions) ? Number(exam.correct_answers) : Number(exam.score);
                    const accuracy = Math.round((displayScore/Number(exam.total_questions))*100);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="font-black text-gray-800 dark:text-gray-200">{exam.subject_name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formatDate(exam.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-green-600">{displayScore}/{exam.total_questions}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {accuracy}%
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-10">
                     <p className="text-gray-400 font-medium">{lang === 'bn' ? 'এখনো কোনো পরীক্ষা দেওয়া হয়নি' : 'No exams taken yet'}</p>
                     <Link to="/exam" className="text-green-500 font-bold text-sm underline mt-2 block">Take your first exam</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 bg-gray-100 dark:bg-gray-800/50 rounded-3xl p-6 text-center border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-xs text-gray-500 font-medium italic">
            {lang === 'bn' ? 'প্রোফাইল এডিট এবং পারফরম্যান্স গ্রাফ শীঘ্রই যুক্ত করা হবে।' : 'Profile editing and performance graphs will be added soon.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;