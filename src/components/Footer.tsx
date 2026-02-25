import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and social */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <img 
            src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" 
            alt="Kafa'ah" 
            className="h-12 w-auto mb-4 md:mb-0"
          />
          <div className="flex space-x-6">
            <a href="https://www.facebook.com/kafaahbd" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
              <i className="fab fa-facebook-f text-2xl"></i>
            </a>
            <a href="https://wa.me/8801837103985" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600">
              <i className="fab fa-whatsapp text-2xl"></i>
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-600">
              <i className="fab fa-youtube text-2xl"></i>
            </a>
          </div>
        </div>

        {/* Footer links line 1 - Study Corner related */}
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
          <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400">
            {t('nav.study')}
          </Link>
          <span>|</span>
          <Link to="/ssc" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400">
            {t('study.ssc')}
          </Link>
          <span>|</span>
          <Link to="/hsc" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400">
            {t('study.hsc')}
          </Link>
          <span>|</span>
          <Link to="/admission" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400">
            {t('study.admission')}
          </Link>
        </div>

        {/* Footer links line 2 - Info links (if needed) */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
          <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400">
            {lang === 'bn' ? 'পরিচিতি' : 'About'}
          </Link>
          <span>|</span>
          <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400">
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact'}
          </Link>
          <span>|</span>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLScM3Usiy57D08kuVwDl__6vaR6YjRTCrIvGoCFH_U5wwF8kKw/viewform" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400"
          >
            {lang === 'bn' ? 'যোগ দিন' : 'Join Us'}
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-500">
          {lang === 'en' 
            ? '© 2025 Kafa’ah Islamic and Multiproject Company. All rights reserved.' 
            : '© ২০২৫ Kafa’ah Islamic and Multiproject Company. সর্বস্বত্ব সংরক্ষিত।'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;