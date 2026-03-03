import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const { user, confirmLogout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItemClass = (path: string) => `
    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
    ${isActive(path) 
      ? 'bg-green-100 text-green-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm' 
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
  `;

  return (
    <>
      {/* Main Header: Sticky on PC, Relative on Mobile */}
      <nav className="md:fixed relative top-0 w-full z-[100] backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Left Side: Logo & Desktop Navigation */}
            <div className="flex items-center space-x-4 md:space-x-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0"
              >
                <Link to="/" className="flex items-center group">
                  <img 
                    src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" 
                    alt="Kafa'ah" 
                    className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
                  />
                </Link>
              </motion.div>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/" className={navItemClass('/')}>
                  <BookOpen size={18} />
                  <span>Study</span>
                </Link>
                <Link to="/forum" className={navItemClass('/forum')}>
                  <MessageSquare size={18} />
                  <span>Forum</span>
                </Link>
                <Link to="/mistakes" className={navItemClass('/mistakes')}>
                  <Zap size={18} />
                  <span>{lang === 'bn' ? 'ভুল সংশোধন' : 'Mistakes'}</span>
                </Link>
              </div>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 md:space-x-6">
              {/* Toggle Buttons Container */}
              <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <LanguageToggle />
                <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <ThemeToggle />
              </div>
              
              {user ? (
                <div className="flex items-center space-x-3 md:space-x-4">
                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 group"
                  >
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-black text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {user.name}
                      </p>
                    </div>
                    {/* Avatar Icon */}
                    <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-green-200 dark:shadow-none transition-all group-hover:scale-110 group-hover:rotate-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={confirmLogout}
                    className="flex items-center justify-center h-9 w-9 md:h-10 md:w-auto md:px-5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition-all active:scale-95"
                    title={t('nav.logout')}
                  >
                    <i className="fas fa-sign-out-alt md:mr-2"></i>
                    <span className="hidden md:inline">{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-green-600 dark:bg-blue-600 text-white font-black text-sm rounded-xl shadow-lg shadow-green-200 dark:shadow-none active:scale-95 transition-all hover:bg-green-700 flex items-center"
                >
                  <i className="fas fa-user-circle mr-2 text-lg"></i>
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation: Sticky/Fixed at bottom */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-[2rem] shadow-2xl p-2 flex justify-around items-center">
          <Link to="/" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/') ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-gray-500'}`}>
            <BookOpen size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Study</span>
          </Link>
          <Link to="/forum" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/forum') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500'}`}>
            <MessageSquare size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Forum</span>
          </Link>
          <Link to="/mistakes" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive('/mistakes') ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'text-gray-500'}`}>
            <Zap size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'bn' ? 'ভুল' : 'Mistakes'}</span>
          </Link>
        </div>
      </div>

      {/* Desktop Space to prevent content overlap */}
      <div className="hidden md:block h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;