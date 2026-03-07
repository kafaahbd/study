import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-widest text-center md:text-left">
            {lang === 'en' 
              ? '© 2026 Kafa’ah Islamic and Multiproject Company. All rights reserved.' 
              : '© ২০২৬ Kafa’ah Islamic and Multiproject Company. সর্বস্বত্ব সংরক্ষিত।'}
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Platform Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;