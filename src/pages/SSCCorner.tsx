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
  hoverText: string;   // হোভার করলে টেক্সট কালার
  hoverBorder: string; // হোভার করলে বর্ডার কালার
  bgIcon: string;      // হোভার করলে আইকন ব্যাকগ্রাউন্ড
}

const SSCCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const groups: Group[] = [
    {
      name: t("study.common"),
      icon: "📚",
      gradient: "from-blue-600 to-indigo-700",
      hoverText: "group-hover/sub:text-blue-600",
      hoverBorder: "hover:border-blue-500/30",
      bgIcon: "group-hover/sub:bg-blue-600",
      subjects: [
        { name: t("study.subjects.bangla"), path: "/exam?group=ssc&subject=bangla" },
        { name: t("study.subjects.english"), path: "/exam?group=ssc&subject=english" },
        { name: t("study.subjects.ict"), path: "/exam?group=ssc&subject=ict" },
        { name: t("study.subjects.math"), path: "/exam?group=ssc&subject=math" },
        { name: t("study.subjects.islam"), path: "/exam?group=ssc&subject=islam" },
      ],
    },
    {
      name: t("study.science"),
      icon: "🔬",
      gradient: "from-emerald-600 to-teal-700",
      hoverText: "group-hover/sub:text-emerald-600",
      hoverBorder: "hover:border-emerald-500/30",
      bgIcon: "group-hover/sub:bg-emerald-600",
      subjects: [
        { name: t("study.subjects.physics"), path: "/exam?group=ssc&subject=physics" },
        { name: t("study.subjects.chemistry"), path: "/exam?group=ssc&subject=chemistry" },
        { name: t("study.subjects.biology"), path: "/exam?group=ssc&subject=biology" },
        { name: t("study.subjects.bgs"), path: "/exam?group=ssc&subject=bgs" },
      ],
    },
    {
      name: t("study.arts"),
      icon: "🎨",
      gradient: "from-orange-500 to-red-600",
      hoverText: "group-hover/sub:text-orange-600",
      hoverBorder: "hover:border-orange-500/30",
      bgIcon: "group-hover/sub:bg-orange-600",
      subjects: [
        { name: t("study.subjects.history"), path: "/exam?group=ssc&subject=history" },
        { name: t("study.subjects.civics"), path: "/exam?group=ssc&subject=civics" },
        { name: t("study.subjects.geography"), path: "/exam?group=ssc&subject=geography" },
        { name: t("study.subjects.bgs"), path: "/exam?group=ssc&subject=bgs" },
      ],
    },
    {
      name: t("study.commerce"),
      icon: "💼",
      gradient: "from-sky-600 to-blue-700",
      hoverText: "group-hover/sub:text-sky-600",
      hoverBorder: "hover:border-sky-500/30",
      bgIcon: "group-hover/sub:bg-sky-600",
      subjects: [
        { name: t("study.subjects.accounting"), path: "/exam?group=ssc&subject=accounting" },
        { name: t("study.subjects.business"), path: "/exam?group=ssc&subject=business" },
        { name: t("study.subjects.finance"), path: "/exam?group=ssc&subject=finance" },
        { name: t("study.subjects.bgs"), path: "/exam?group=ssc&subject=bgs" },
      ],
    },
    {
      name: t("study.optional"),
      icon: "⭐",
      gradient: "from-purple-600 to-fuchsia-700",
      hoverText: "group-hover/sub:text-purple-600",
      hoverBorder: "hover:border-purple-500/30",
      bgIcon: "group-hover/sub:bg-purple-600",
      subjects: [
        { name: t("study.subjects.highermath"), path: "/exam?group=ssc&subject=highermath" },
        { name: t("study.subjects.agriculture"), path: "/exam?group=ssc&subject=agriculture" },
        { name: t("study.subjects.health"), path: "/exam?group=ssc&subject=health" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 transition-colors">
      <Helmet>
        <title>{lang === "bn" ? "এসএসসি কর্নার - কাফআহ" : "SSC Corner - Kafa'ah"}</title>
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
                {t("study.ssc.title")}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                {t("study.ssc.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-black uppercase tracking-widest border border-green-200 dark:border-green-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              2026 Edition
            </div>
          </div>
        </header>

        {/* Groups Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {groups.map((group, groupIdx) => (
            <ScrollAnimation key={groupIdx}>
              <div className={`group bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden ${group.hoverBorder} transition-all duration-300`}>
                
                {/* Group Header with Gradient */}
                <div className={`bg-gradient-to-br ${group.gradient} p-6 text-white`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      {group.icon}
                    </div>
                    <h2 className="text-xl font-black tracking-tight">{group.name}</h2>
                  </div>
                </div>

                {/* Subjects List */}
                <div className="p-4 md:p-6 space-y-2">
                  {group.subjects.map((subject, subIdx) => (
                    <Link
                      key={subIdx}
                      to={subject.path}
                      className={`flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-transparent ${group.hoverBorder} hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all group/sub`}
                    >
                      <span className={`font-bold text-gray-700 dark:text-gray-300 ${group.hoverText} transition-colors`}>
                        {subject.name}
                      </span>
                      <div className={`w-8 h-8 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm ${group.bgIcon} group-hover/sub:text-white transition-all`}>
                        <i className="fas fa-chevron-right text-[10px]"></i>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Update Info Box */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-6 shadow-lg shadow-gray-100 dark:shadow-none"
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            <i className="fas fa-info-circle"></i>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-black text-gray-800 dark:text-white mb-1 uppercase tracking-tight">
              {lang === "bn" ? "আপডেট তথ্য" : "Update Information"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {lang === "bn"
                ? "খুব শীঘ্রই প্রতিটি বিষয়ের কন্টেন্ট বা প্রশ্নব্যাংক যুক্ত করা হবে। বর্তমানে কিছু লিঙ্ক খালি থাকতে পারে।"
                : "Question banks for each subject will be added soon. Some links might be empty currently."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SSCCorner;