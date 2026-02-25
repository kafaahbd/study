import ScrollAnimation from "../components/ScrollAnimation";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";


// কোর্স আইটেমের টাইপ
interface Course {
  key: string;
  icon: string;
  path: string;
}

const Study: React.FC = () => {
  const { t, lang } = useLanguage();

  const courses: Course[] = [
    { key: "ssc", icon: "📘", path: "/ssc" },
    { key: "hsc", icon: "📚", path: "/hsc" },
    { key: "admission", icon: "🎓", path: "/admission" },
    { key: "quran", icon: "📖", path: "#" },
    { key: "english", icon: "🇬🇧", path: "#" },
    { key: "islamic", icon: "🕌", path: "#" },
  ];

  const handleClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (path === "#") {
      e.preventDefault();
      alert(t("study.coming.soon"));
    }
  };

  return (
    <div className="min-h-screen bg-geometric-light dark:bg-geometric-dark py-16 px-4">
      
        {lang === "bn" ? (
          <>
            <title>কাফআহ স্টাডি কর্নার | SSC, HSC ও এডমিশন প্রস্তুতি</title>
            <meta
              name="description"
              content="এসএসসি, এইচএসসি ও এডমিশন পরীক্ষার জন্য অনলাইন মডেল টেস্ট দিন। বাংলা ও ইংরেজি উভয় ভাষায় সম্পূর্ণ ফ্রি ইনশাআল্লাহ।"
            />
            <meta property="og:title" content="কাফআহ স্টাডি কর্নার" />
            <meta
              property="og:description"
              content="এসএসসি, এইচএসসি ও এডমিশন পরীক্ষার অনলাইন মডেল টেস্ট - সম্পূর্ণ ফ্রি।"
            />
          </>
        ) : (
          <>
            <title>
              Kafa'ah Study Corner | SSC, HSC & Admission Preparation
            </title>
            <meta
              name="description"
              content="Take online model tests for SSC, HSC, and Admission exams. Completely free in both Bangla and English, InshaAllah."
            />
            <meta property="og:title" content="Kafa'ah Study Corner" />
            <meta
              property="og:description"
              content="Online model tests for SSC, HSC, and Admission exams - completely free."
            />
          </>
        )}
        <meta
          property="og:url"
          content="https://kafaahbd.github.io/kafaahbd/study"
        />
     
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          {t("nav.study")}
        </h1>
        {/* <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          {t('projects.study.desc')}
        </p> */}
        <br />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <ScrollAnimation key={idx}>
              <Link
                to={course.path}
                onClick={(e) => handleClick(course.path, e)}
                className="block bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center group"
              >
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-blue-600/70 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{course.icon}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {t(`study.${course.key}`)}
                </h2>
                {course.path === "#" && (
                  <p className="text-sm text-green-600 dark:text-blue-400 mt-2">
                    {t("study.coming.soon")}
                  </p>
                )}
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Study;