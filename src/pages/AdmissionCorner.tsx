import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import ScrollAnimation from "../components/ScrollAnimation";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

interface Subject {
  name: string;
  path: string;
}

interface Category {
  name: string;
  icon: string;
  gradient: string;
  accent: string;      // text color class
  hoverBorder: string; // hover border color class
  subjects: Subject[];
}

const AdmissionCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const categories: Category[] = [
    {
      name: t("study.admission.engineering"),
      icon: "⚙️",
      gradient: "from-blue-600 to-cyan-600",
      accent: "group-hover/sub:text-blue-600 dark:group-hover/sub:text-blue-400",
      hoverBorder: "hover:border-blue-500/30",
      subjects: [
        { name: t("study.admission.physics"), path: "/exam?group=admission&subject=engineering-physics" },
        { name: t("study.admission.chemistry"), path: "/exam?group=admission&subject=engineering-chemistry" },
        { name: t("study.admission.highermath"), path: "/exam?group=admission&subject=engineering-highermath" },
        { name: t("study.admission.english"), path: "/exam?group=admission&subject=engineering-english" },
      ],
    },
    {
      name: t("study.admission.medical"),
      icon: "🏥",
      gradient: "from-red-500 to-rose-600",
      accent: "group-hover/sub:text-red-600 dark:group-hover/sub:text-red-400",
      hoverBorder: "hover:border-red-500/30",
      subjects: [
        { name: t("study.admission.physics"), path: "/exam?group=admission&subject=medical-physics" },
        { name: t("study.admission.chemistry"), path: "/exam?group=admission&subject=medical-chemistry" },
        { name: t("study.admission.biology"), path: "/exam?group=admission&subject=medical-biology" },
        { name: t("study.admission.english"), path: "/exam?group=admission&subject=medical-english" },
        { name: t("study.admission.gk"), path: "/exam?group=admission&subject=medical-gk" },
      ],
    },
    {
      name: t("study.admission.university"),
      icon: "🏛️",
      gradient: "from-purple-600 to-fuchsia-600",
      accent: "group-hover/sub:text-purple-600 dark:group-hover/sub:text-purple-400",
      hoverBorder: "hover:border-purple-500/30",
      subjects: [
        { name: t("study.admission.bangla"), path: "/exam?group=admission&subject=university-bangla" },
        { name: t("study.admission.english"), path: "/exam?group=admission&subject=university-english" },
        { name: t("study.admission.gk"), path: "/exam?group=admission&subject=university-gk" },
        { name: t("study.hsc.subjects.history"), path: "/exam?group=admission&subject=university-history" },
        { name: t("study.hsc.subjects.economics"), path: "/exam?group=admission&subject=university-economics" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 transition-colors">
      <Helmet>
        <title>{lang === "bn" ? "এডমিশন কর্নার - কাফআহ" : "Admission Corner - Kafa'ah"}</title>
      </Helmet>

      <div className="w-[95%] lg:w-[95%] mx-auto">
        {/* Header Section */}
        <header className="mb-16">
          <Link
            to="/"
            className="group inline-flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors mb-6"
          >
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            {t("study.back")}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-10">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {t("study.admission.title")}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                {t("study.admission.subtitle")}
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
              <div className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex items-center gap-2">
                <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tighter uppercase">Curriculum 2026 Ready</span>
              </div>
            </div>
          </div>
        </header>

        {/* Categories Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <ScrollAnimation key={idx}>
              <div className="group bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500 h-full flex flex-col">
                
                {/* Header */}
                <div className={`bg-gradient-to-br ${category.gradient} p-8 text-white relative`}>
                  <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl transform group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <div className="relative z-10">
                    <span className="text-sm font-black uppercase tracking-[0.2em] opacity-80 mb-2 block">Admission</span>
                    <h2 className="text-2xl font-black">{category.name}</h2>
                  </div>
                </div>

                {/* Subjects List */}
                <div className="p-6 space-y-2 flex-grow">
                  {category.subjects.map((subject, subIdx) => (
                    <Link
                      key={subIdx}
                      to={subject.path}
                      className={`flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 border border-transparent ${category.hoverBorder} hover:shadow-md transition-all group/sub`}
                    >
                      <span className={`font-bold text-gray-700 dark:text-gray-300 ${category.accent} transition-colors`}>
                        {subject.name}
                      </span>
                      <i className={`fas fa-chevron-right text-[10px] text-gray-300 ${category.accent}`}></i>
                    </Link>
                  ))}
                </div>

                {/* Footer Badge */}
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center">
                      <i className={`fas fa-bolt text-xs ${category.accent.split(' ')[0].replace('group-hover/sub:', '')}`}></i>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500 dark:text-gray-400">
                      Tests & Sheets coming soon
                    </span>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            { icon: "fa-calendar-check", label: lang === 'bn' ? "এডমিশন ক্যালেন্ডার" : "Calendar", color: "text-blue-500" },
            { icon: "fa-vial", label: lang === 'bn' ? "লাইভ মডেল টেস্ট" : "Live Tests", color: "text-purple-500" },
            { icon: "fa-chart-pie", label: lang === 'bn' ? "পারফরম্যান্স রিপোর্ট" : "Analysis", color: "text-emerald-500" },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-6 shadow-sm"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl ${feature.color}`}>
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <div>
                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{feature.label}</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Upcoming</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Note */}
        <div className="mt-16 bg-green-50/50 dark:bg-blue-900/10 rounded-[2.5rem] p-10 border border-green-100 dark:border-blue-900/30 text-center">
          <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-6 shadow-sm">
             <i className="fas fa-info-circle text-green-600 dark:text-blue-400"></i>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed italic">
            "{lang === "bn"
              ? "ইঞ্জিনিয়ারিং, মেডিকেল ও ইউনিভার্সিটি এডমিশনের জন্য সম্পূর্ণ প্রস্তুতি খুব শীঘ্রই আসছে ইনশাআল্লাহ।"
              : "Complete preparation for Engineering, Medical, and University Admission will be available very soon InshaAllah."}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionCorner;