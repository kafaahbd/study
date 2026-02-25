import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import ScrollAnimation from "../components/ScrollAnimation";
import { Helmet } from "react-helmet-async"; // ← ইম্পোর্ট যোগ করুন

// টাইপ ডিফিনেশন
interface Subject {
  name: string;
  path: string;
}

interface Group {
  name: string;
  icon: string;
  subjects: Subject[];
}

const HSCCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const groups: Group[] = [
    {
      name: t("study.hsc.common"),
      icon: "📚",
      subjects: [
        { name: t("study.hsc.subjects.bangla"), path: "/exam?group=hsc&subject=bangla" },
        { name: t("study.hsc.subjects.english"), path: "/exam?group=hsc&subject=english" },
        { name: t("study.hsc.subjects.ict"), path: "/exam?group=hsc&subject=ict" },
      ],
    },
    {
      name: t("study.hsc.science"),
      icon: "🔬",
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
    <div className="min-h-screen bg-geometric-light dark:bg-geometric-dark py-16 px-4">
      <Helmet>
        {lang === "bn" ? (
          <>
            <title>এইচএসসি কর্নার - কাফআহ | বিজ্ঞান, মানবিক ও বাণিজ্য গ্রুপ</title>
            <meta
              name="description"
              content="এইচএসসি পরীক্ষার্থীদের জন্য পদার্থ, রসায়ন, জীববিজ্ঞান, হিসাববিজ্ঞান, অর্থনীতি ইত্যাদি বিষয়ের অধ্যায়ভিত্তিক টেস্ট।"
            />
            <meta property="og:title" content="এইচএসসি কর্নার - কাফআহ" />
            <meta property="og:description" content="এইচএসসির সব গ্রুপের জন্য অধ্যায়ভিত্তিক মডেল টেস্ট।" />
          </>
        ) : (
          <>
            <title>HSC Corner - Kafa'ah | Science, Arts & Commerce Groups</title>
            <meta
              name="description"
              content="Chapter-wise tests for HSC examinees: Physics, Chemistry, Biology, Accounting, Economics, and more."
            />
            <meta property="og:title" content="HSC Corner - Kafa'ah" />
            <meta property="og:description" content="Chapter-wise model tests for all HSC groups." />
          </>
        )}
        <meta property="og:url" content="https://kafaahbd.github.io/study-corner/hsc" />
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
            {t("study.hsc.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("study.hsc.subtitle")}
          </p>
        </div>

        {/* Groups Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {groups.map((group, groupIdx) => (
            <ScrollAnimation key={groupIdx}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition h-full">
                {/* Group Header */}
                <div className="bg-green-600 dark:bg-blue-700 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{group.icon}</span>
                    <h2 className="text-xl font-bold">{group.name}</h2>
                  </div>
                </div>

                {/* Subjects List */}
                <div className="p-4">
                  {group.subjects.map((subject, subIdx) => (
                    <Link
                      key={subIdx}
                      to={subject.path}
                      target="_self"
                      className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition flex items-center justify-between group border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-blue-400">
                        {subject.name}
                      </span>
                      <i className="fas fa-arrow-right text-gray-400 group-hover:text-green-600 dark:group-hover:text-blue-400 text-sm"></i>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-green-50 dark:bg-blue-900/20 border border-green-200 dark:border-blue-800 rounded-2xl p-6 text-center">
          <i className="fas fa-info-circle text-green-600 dark:text-blue-400 text-3xl mb-3"></i>
          <p className="text-gray-700 dark:text-gray-300">
            {lang === "bn"
              ? "এইচএসসি প্রতিটি সাবজেক্টের জন্য কন্টেন্ট খুব শীঘ্রই যোগ করা হবে ইনশাআল্লাহ। বর্তমানে লিঙ্কগুলো খালি আছে, যা পরবর্তীতে আপডেট করা হবে"
              : "Content for each HSC subject will be added very soon InshaAllah. Currently the links are empty which will be updated later."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HSCCorner;