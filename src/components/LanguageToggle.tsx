import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      {lang === 'en' ? 'বাংলা' : 'EN'}
    </button>
  );
};
export default LanguageToggle;