import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import ScrollAnimation from "../components/ScrollAnimation";
import { Helmet } from "react-helmet-async";

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

const SSCCorner: React.FC = () => {
  const { t, lang } = useLanguage();

  const groups: Group[] = [
    {
      name: t("study.common"),
      icon: "📚",
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
      subjects: [
        { name: t("study.subjects.highermath"), path: "/exam?group=ssc&subject=highermath" },
        { name: t("study.subjects.agriculture"), path: "/exam?group=ssc&subject=agriculture" },
        { name: t("study.subjects.health"), path: "/exam?group=ssc&subject=health" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-geometric-light dark:bg-geometric-dark py-16 px-4">
      <Helmet>
        {lang === "bn" ? (
          <>
            <title>এসএসসি কর্নার - কাফআহ | অধ্যায়ভিত্তিক মডেল টেস্ট</title>
            <meta
              name="description"
              content="এসএসসি পরীক্ষার্থীদের জন্য অধ্যায়ভিত্তিক মডেল টেস্ট। পদার্থ, রসায়ন, জীববিজ্ঞান, গণিত, ইংরেজিসহ সব বিষয়।"
            />
            <meta property="og:title" content="এসএসসি কর্নার - কাফআহ" />
            <meta property="og:description" content="এসএসসির সব গ্রুপের জন্য অধ্যায়ভিত্তিক মডেল টেস্ট।" />
          </>
        ) : (
          <>
            <title>SSC Corner - Kafa'ah | Chapter-wise Model Tests</title>
            <meta
              name="description"
              content="Chapter-wise model tests for SSC examinees. All subjects including Physics, Chemistry, Biology, Math, English."
            />
            <meta property="og:title" content="SSC Corner - Kafa'ah" />
            <meta property="og:description" content="Chapter-wise model tests for all SSC groups." />
          </>
        )}
        <meta property="og:url" content="https://kafaahbd.github.io/study-corner/ssc" />
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
            {t("study.ssc.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("study.ssc.subtitle")}
          </p>
        </div>

        {/* Groups Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {groups.map((group, groupIdx) => (
            <ScrollAnimation key={groupIdx}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
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
                      className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition flex items-center justify-between group"
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
              ? "ইনশাআল্লাহ্, খুব শীঘ্রই প্রতিটি বিষয়ের কন্টেন্ট বা বিষয়বস্তু যুক্ত করা হবে। বর্তমানে লিঙ্কগুলো খালি আছে, যা পরবর্তীতে আপডেট করা হবে"
              : "Content for each subject will be added very soon InshaAllah. Currently the links are empty which will be updated later."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SSCCorner;