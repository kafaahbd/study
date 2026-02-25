import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, isLoading } = useAuth();
  const { t, lang } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

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

  const getStudyLevelName = (level: string) => {
    return level === 'SSC' ? 'SSC' : 'HSC';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {t('profile.title')}
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('profile.email')}
                </label>
                <p className="text-lg">{user.email}</p>
              </div>

              {user.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t('profile.phone')}
                  </label>
                  <p className="text-lg">{user.phone}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('profile.studyLevel')}
                </label>
                <p className="text-lg">{getStudyLevelName(user.study_level)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('profile.group')}
                </label>
                <p className="text-lg">{getGroupName(user.group)}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('profile.memberSince')}
                </label>
                <p className="text-lg">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;