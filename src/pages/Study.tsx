import React from "react";
import ScrollAnimation from "../components/ScrollAnimation";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

interface Course {
  key: string;
  icon: string;
  path: string;
  color: string; // প্রতিটি কোর্সের জন্য আলাদা থিম কালার
}

const Study: React.FC = () => {
  const { t, lang } = useLanguage();

  const courses: Course[] = [
    { key: "ssc", icon: "📘", path: "/ssc", color: "from-blue-500 to-cyan-500" },
    { key: "hsc", icon: "📚", path: "/hsc", color: "from-purple-500 to-indigo-500" },
    { key: "admission", icon: "🎓", path: "/admission", color: "from-orange-500 to-red-500" },
    { key: "quran", icon: "📖", path: "#", color: "from-emerald-500 to-teal-500" },
    { key: "english", icon: "🇬🇧", path: "#", color: "from-pink-500 to-rose-500" },
    { key: "islamic", icon: "🕌", path: "#", color: "from-amber-500 to-yellow-600" },
  ];

  const handleClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (path === "#") {
      e.preventDefault();
      // একটি সুন্দর টোস্ট বা কাস্টম অ্যালার্ট এখানে ভালো দেখাবে
      alert(t("study.coming.soon"));
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-900 py-4 lg:py-16 px-3 lg:px-4 transition-colors">
      
      <SEO 
        title={lang === "bn" ? "হোম - কাফআহ স্টাডি কর্নার" : "Home - Kafa'ah Study Corner"} 
        image="https://study.kafaahbd.com/stufy.jpg"
        url="/"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10 lg:mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 lg:mb-4 tracking-tight"
          >
            {t("nav.study")}
          </motion.h1>
          <div className="h-1.5 w-20 lg:w-24 bg-green-500 mx-auto rounded-full mb-4 lg:mb-6"></div>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            {lang === "bn" 
              ? "আপনার কাঙ্ক্ষিত কোর্সটি নির্বাচন করে আজই প্রস্তুতি শুরু করুন ইনশাআল্লাহ।" 
              : "Select your desired course and start your preparation today, InshaAllah."}
          </p>
        </header>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {courses.map((course, idx) => (
            <ScrollAnimation key={idx}>
              <Link
                to={course.path}
                onClick={(e) => handleClick(course.path, e)}
                className="group relative flex flex-col items-center justify-center text-center h-full bg-white dark:bg-gray-900 p-8 lg:p-12 rounded-3xl lg:rounded-[3rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all hover:-translate-y-2"
              >
                {/* Background Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.07] rounded-3xl lg:rounded-[3rem] transition-opacity`}></div>

                {/* Icon Container */}
                <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg transform group-hover:rotate-6 transition-transform`}>
                  <span className="text-3xl lg:text-4xl drop-shadow-md">{course.icon}</span>
                </div>

                {/* Content */}
                <h2 className="text-xl lg:text-2xl font-black text-gray-800 dark:text-gray-100 mb-2 text-center">
                  {t(`study.${course.key}`)}
                </h2>
                
                <div className="flex justify-center items-center gap-2">
                  {course.path === "#" ? (
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] lg:text-xs font-bold rounded-full uppercase tracking-wider">
                      {t("study.coming.soon")}
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 text-xs lg:text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      {lang === "bn" ? "প্রবেশ করুন" : "Get Started"}
                      <i className="fas fa-chevron-right text-[10px] lg:text-xs"></i>
                    </span>
                  )}
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        {/* Support Section */}
        <footer className="mt-12 lg:mt-20 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-gray-500 dark:text-gray-500 text-xs lg:text-sm mb-3 lg:mb-4">
              {lang === "bn" ? "নতুন কোনো কোর্সের প্রয়োজন?" : "Need a new course?"}
            </p>
            <a 
              href="https://wa.me/01837103985" 
              className="flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl lg:rounded-2xl text-gray-700 dark:text-gray-300 font-bold hover:shadow-md transition-shadow text-sm lg:text-base"
            >
              <i className="fab fa-whatsapp text-green-500 text-lg lg:text-xl"></i>
              {lang === "bn" ? "আমাদের জানান" : "Request Course"}
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Study;