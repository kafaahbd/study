import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import ScrollAnimation from "../components/ScrollAnimation";
import { Helmet } from "react-helmet-async";

// টাইপ ডিফিনেশন
interface Subject {
  name: string;
  path: string;
}

interface Category {
  name: string;
  icon: string;
  color: string;
  hoverColor: string;
  subjects: Subject[];
}

const AdmissionCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const categories: Category[] = [
    {
      name: t("study.admission.engineering"),
      icon: "⚙️",
      color: "bg-blue-600",
      hoverColor: "hover:text-blue-600 dark:hover:text-blue-400",
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
      color: "bg-red-600",
      hoverColor: "hover:text-red-600 dark:hover:text-red-400",
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
      color: "bg-purple-600",
      hoverColor: "hover:text-purple-600 dark:hover:text-purple-400",
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
    <div className="min-h-screen bg-geometric-light dark:bg-geometric-dark py-16 px-4">
      <Helmet>
        {lang === "bn" ? (
          <>
            <title>এডমিশন কর্নার - কাফআহ | ইঞ্জিনিয়ারিং, মেডিকেল ও বিশ্ববিদ্যালয়</title>
            <meta
              name="description"
              content="ইঞ্জিনিয়ারিং, মেডিকেল ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রস্তুতির জন্য অধ্যায়ভিত্তিক মডেল টেস্ট।"
            />
            <meta property="og:title" content="এডমিশন কর্নার - কাফআহ" />
            <meta property="og:description" content="ইঞ্জিনিয়ারিং, মেডিকেল ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রস্তুতি।" />
          </>
        ) : (
          <>
            <title>Admission Corner - Kafa'ah | Engineering, Medical & University</title>
            <meta
              name="description"
              content="Chapter-wise model tests for Engineering, Medical, and University admission exams."
            />
            <meta property="og:title" content="Admission Corner - Kafa'ah" />
            <meta property="og:description" content="Preparation for Engineering, Medical, and University admission exams." />
          </>
        )}
        <meta property="og:url" content="https://kafaahbd.github.io/study-corner/admission" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-green-600 dark:text-blue-400 hover:underline mb-4"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            {t("study.back")}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("study.admission.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("study.admission.subtitle")}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {categories.map((category, catIdx) => (
            <ScrollAnimation key={catIdx}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition h-full">
                <div className={`${category.color} p-4 text-white`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-xl font-bold">{category.name}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    {catIdx === 0
                      ? t("study.admission.engineering.subjects")
                      : catIdx === 1
                      ? t("study.admission.medical.subjects")
                      : t("study.admission.university.subjects")}
                  </h3>
                  {category.subjects.map((subject, subIdx) => (
                    <Link
                      key={subIdx}
                      to={subject.path}
                      target="_self"
                      className={`w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition flex items-center justify-between group border-b border-gray-100 dark:border-gray-700 last:border-0 ${category.hoverColor}`}
                    >
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-inherit">
                        {subject.name}
                      </span>
                      <i className="fas fa-arrow-right text-gray-400 group-hover:text-inherit text-sm"></i>
                    </Link>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
                    <i className="fas fa-clock mr-2"></i>
                    {lang === "bn"
                      ? "মডেল টেস্ট ও লেকচার শীট শীঘ্রই আসছে"
                      : "Model tests & lecture sheets coming soon"}
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
            <i className="fas fa-calendar-alt text-green-600 dark:text-blue-400 text-3xl mb-3"></i>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {lang === "bn" ? "এডমিশন ক্যালেন্ডার" : "Admission Calendar"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === "bn" ? "শীঘ্রই আসছে" : "Coming soon"}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
            <i className="fas fa-question-circle text-green-600 dark:text-blue-400 text-3xl mb-3"></i>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {lang === "bn" ? "মডেল টেস্ট" : "Model Tests"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === "bn" ? "শীঘ্রই আসছে" : "Coming soon"}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
            <i className="fas fa-chart-line text-green-600 dark:text-blue-400 text-3xl mb-3"></i>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {lang === "bn" ? "রেজাল্ট অ্যানালাইসিস" : "Result Analysis"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === "bn" ? "শীঘ্রই আসছে" : "Coming soon"}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-green-50 dark:bg-blue-900/20 border border-green-200 dark:border-blue-800 rounded-2xl p-6 text-center">
          <i className="fas fa-info-circle text-green-600 dark:text-blue-400 text-3xl mb-3"></i>
          <p className="text-gray-700 dark:text-gray-300">
            {lang === "bn"
              ? "ইঞ্জিনিয়ারিং, মেডিকেল ও ইউনিভার্সিটি এডমিশনের জন্য সম্পূর্ণ প্রস্তুতি খুব শীঘ্রই আসছে ইনশাআল্লাহ। বর্তমানে লিঙ্কগুলো খালি আছে, যা পরবর্তীতে আপডেট করা হবে ।"
              : "Complete preparation for Engineering, Medical, and University Admission will be available very soon InshaAllah. Currently the links are empty which will be updated later."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionCorner;