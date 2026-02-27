import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo Section */}
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
                    <div className="hidden sm:block text-right">
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
                    onClick={logout}
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
      {/* Space to prevent content overlap */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;