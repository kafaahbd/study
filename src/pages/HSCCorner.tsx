import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import ScrollAnimation from "../components/ScrollAnimation";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

interface Subject {
  name: string;
  path: string;
}

interface Group {
  name: string;
  icon: string;
  subjects: Subject[];
  gradient: string;
}

const HSCCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const groups: Group[] = [
    {
      name: t("study.hsc.common"),
      icon: "📚",
      gradient: "from-blue-600 to-indigo-700",
      subjects: [
        { name: t("study.hsc.subjects.bangla"), path: "/exam?group=hsc&subject=bangla" },
        { name: t("study.hsc.subjects.english"), path: "/exam?group=hsc&subject=english" },
        { name: t("study.hsc.subjects.ict"), path: "/exam?group=hsc&subject=ict" },
      ],
    },
    {
      name: t("study.hsc.science"),
      icon: "🔬",
      gradient: "from-emerald-600 to-teal-700",
      subjects: [
        { name: t("study.hsc.subjects.physics"), path: "/exam?group=hsc&subject=physics" },
        { name: t("study.hsc.subjects.chemistry"), path: "/exam?group=hsc&subject=chemistry" },
        { name: t("study.hsc.subjects.biology"), path: "/exam?group=hsc&subject=biology" },
        { name: t("study.hsc.subjects.highermath"), path: "/exam?group=hsc&subject=highermath" },
      ],
    },
    {
      name: t("study.hsc.arts"),
      icon: "🎨",
      gradient: "from-orange-500 to-red-600",
      subjects: [
        { name: t("study.hsc.subjects.history"), path: "/exam?group=hsc&subject=history" },
        { name: t("study.hsc.subjects.islamic"), path: "/exam?group=hsc&subject=islamic" },
        { name: t("study.hsc.subjects.civics"), path: "/exam?group=hsc&subject=civics" },
        { name: t("study.hsc.subjects.economics"), path: "/exam?group=hsc&subject=economics" },
        { name: t("study.hsc.subjects.geography"), path: "/exam?group=hsc&subject=geography" },
      ],
    },
    {
      name: t("study.hsc.commerce"),
      icon: "💼",
      gradient: "from-sky-600 to-blue-700",
      subjects: [
        { name: t("study.hsc.subjects.accounting"), path: "/exam?group=hsc&subject=accounting" },
        { name: t("study.hsc.subjects.management"), path: "/exam?group=hsc&subject=management" },
        { name: t("study.hsc.subjects.finance"), path: "/exam?group=hsc&subject=finance" },
        { name: t("study.hsc.subjects.business"), path: "/exam?group=hsc&subject=business" },
        { name: t("study.hsc.subjects.marketing"), path: "/exam?group=hsc&subject=marketing" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-4 transition-colors">
      <Helmet>
        <title>{lang === "bn" ? "এইচএসসি কর্নার - কাফআহ" : "HSC Corner - Kafa'ah"}</title>
      </Helmet>

      <div className="w-[95%] lg:w-[95%] mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <Link
            to="/"
            className="group inline-flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors mb-6"
          >
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {t("study.back")}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                {t("study.hsc.title")}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                {t("study.hsc.subtitle")}
              </p>
            </div>
            {/* Live Indicator Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Academic 2026
            </div>
          </div>
        </header>

        {/* Groups Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {groups.map((group, groupIdx) => (
            <ScrollAnimation key={groupIdx}>
              <div className="group bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
                
                {/* Group Header with Gradient */}
                <div className={`bg-gradient-to-br ${group.gradient} p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                      {group.icon}
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">{group.name}</h2>
                  </div>
                </div>

                {/* Subjects List */}
                <div className="p-6 space-y-3 flex-grow">
                  {group.subjects.map((subject, subIdx) => (
                    <Link
                      key={subIdx}
                      to={subject.path}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all group/sub"
                    >
                      <span className="font-bold text-gray-700 dark:text-gray-300 group-hover/sub:text-blue-600 dark:group-hover/sub:text-blue-400 transition-colors">
                        {subject.name}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover/sub:bg-blue-600 group-hover/sub:text-white transition-all">
                        <i className="fas fa-chevron-right text-[10px]"></i>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Improved Support Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Decorative background circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border border-blue-500/30">
              <i className="fas fa-rocket"></i>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tight">
              {lang === "bn" ? "নতুন কন্টেন্ট আসছে!" : "New Content Coming Soon!"}
            </h3>
            <p className="text-gray-400 font-medium max-w-2xl mx-auto mb-8">
              {lang === "bn"
                ? "ইনশাআল্লাহ্, এইচএসসি-র প্রতিটি বিষয়ের প্রশ্নব্যাংক এবং মডেল টেস্ট দ্রুত আপডেট করা হচ্ছে। আমাদের সাথেই থাকুন।"
                : "InshaAllah, question banks and model tests for every HSC subject are being updated rapidly. Stay tuned with us."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-gray-300 text-xs font-bold tracking-widest uppercase">
                Free Access
              </div>
              <div className="px-6 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-gray-300 text-xs font-bold tracking-widest uppercase">
                Interactive Tests
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HSCCorner;