import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Social */}
          <div className="col-span-1 md:col-span-1">
            <img 
              src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" 
              alt="Kafa'ah" 
              className="h-12 w-auto mb-6"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              {lang === 'bn' 
                ? 'শিক্ষার্থীদের জন্য একটি আধুনিক এবং ফ্রি অনলাইন মডেল টেস্ট প্ল্যাটফর্ম।' 
                : 'A modern and free online model test platform for students.'}
            </p>
            <div className="flex space-x-4">
              {[
                { icon: 'fa-facebook-f', color: 'hover:bg-blue-600', link: 'https://www.facebook.com/kafaahbd' },
                { icon: 'fa-whatsapp', color: 'hover:bg-green-600', link: 'https://wa.me/8801837103985' },
                { icon: 'fa-youtube', color: 'hover:bg-red-600', link: '#' },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 transition-all ${social.color} hover:text-white shadow-sm`}
                >
                  <i className={`fab ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Study Corner */}
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">
              {t('nav.study')}
            </h3>
            <ul className="space-y-4">
              {[
                { name: t('study.ssc'), path: '/ssc' },
                { name: t('study.hsc'), path: '/hsc' },
                { name: t('study.admission'), path: '/admission' },
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.path} className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">
              {lang === 'bn' ? 'লিঙ্ক' : 'Links'}
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? 'পরিচিতি' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? 'যোগাযোগ' : 'Contact'}
                </Link>
              </li>
              <li>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLScM3Usiy57D08kuVwDl__6vaR6YjRTCrIvGoCFH_U5wwF8kKw/viewform" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-blue-400 transition-colors"
                >
                  {lang === 'bn' ? 'আমাদের সাথে যোগ দিন' : 'Join Our Team'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Note */}
          <div className="bg-green-50/50 dark:bg-gray-900/50 p-6 rounded-3xl border border-green-100 dark:border-gray-800">
            <h3 className="text-sm font-black text-green-700 dark:text-blue-400 uppercase tracking-widest mb-3">
              Kafa'ah Notice
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
              {lang === 'bn' 
                ? 'আমাদের লক্ষ্য দ্বীন ও দুনিয়ার শিক্ষার মাঝে একটি সুন্দর সমন্বয় ইনশাআল্লাহ।' 
                : 'Our goal is to create a beautiful harmony between Deen and worldly education, InshaAllah.'}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-tighter">
            {lang === 'en' 
              ? '© 2026 Kafa’ah Islamic and Multiproject Company. All rights reserved.' 
              : '© ২০২৬ Kafa’ah Islamic and Multiproject Company. সর্বস্বত্ব সংরক্ষিত।'}
          </p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;