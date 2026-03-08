import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageSquare, Zap } from 'lucide-react';
import { getProfileColor } from '../typescriptfile/utils';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { user, confirmLogout } = useAuth();
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    // Only auto-hide on mobile
    if (window.innerWidth >= 768) {
        setNavHidden(false);
        return;
    }
    const autoHidePaths = ['/exam', '/post/', '/mistakes', '/practice', '/result', '/create-post'];
    const shouldHide = autoHidePaths.some(path => location.pathname.includes(path));
    setNavHidden(shouldHide);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', icon: BookOpen, label: t('nav.study'), color: 'green' },
    { path: '/forum', icon: MessageSquare, label: t('nav.forum'), color: 'blue' },
    { path: '/mistakes', icon: Zap, label: t('nav.mistakes'), color: 'purple' },
  ];

  const activeColors: Record<string, { bg: string; icon: string; label: string; dot: string }> = {
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-950/40',  icon: 'text-emerald-600 dark:text-emerald-400', label: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
    blue:   { bg: 'bg-blue-50 dark:bg-blue-950/40',        icon: 'text-blue-600 dark:text-blue-400',       label: 'text-blue-700 dark:text-blue-300',       dot: 'bg-blue-500'    },
    purple: { bg: 'bg-violet-50 dark:bg-violet-950/40',    icon: 'text-violet-600 dark:text-violet-400',   label: 'text-violet-700 dark:text-violet-300',   dot: 'bg-violet-500'  },
  };

  const desktopLinkClass = (path: string) => `
    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
    ${isActive(path)
      ? 'bg-green-100 text-green-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
  `;

  const isExamPage = location.pathname.includes('/exam');

  return (
    <>
      {/* ── TOP HEADER ── */}
      {!isExamPage && (
        <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/40 shadow-[0_1px_12px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">

            <div className="flex items-center gap-5 md:gap-8">
              <Link to="/" className="flex-shrink-0 group">
                <img
                  src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
                  alt="Kafa'ah"
                  className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(({ path, icon: Icon, label }) => (
                  <Link key={path} to={path} className={desktopLinkClass(path)}>
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
              <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <LanguageToggle />
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
                <ThemeToggle />
              </div>

              {user ? (
                <div className="flex items-center gap-3 md:gap-4">
                  <Link to="/profile" className="flex items-center gap-3 group">
                    <span className="hidden lg:block text-right">
                      <p className="text-sm font-black text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {user.name}
                      </p>
                    </span>
                    <div className={`relative h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-tr ${user.profile_color || getProfileColor(user.name)} flex items-center justify-center text-white font-black shadow-lg shadow-green-200 dark:shadow-none transition-all group-hover:scale-110 group-hover:rotate-3 border-2 border-white dark:border-gray-800`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <button
                    onClick={confirmLogout}
                    className="flex items-center justify-center h-9 w-9 md:h-10 md:w-auto md:px-5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition-all active:scale-95"
                    title={t('nav.logout')}
                  >
                    <i className="fas fa-sign-out-alt md:mr-2" />
                    <span className="hidden md:inline">{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-green-600 dark:bg-blue-600 text-white font-black text-sm rounded-xl shadow-lg shadow-green-200 dark:shadow-none active:scale-95 transition-all hover:bg-green-700 flex items-center"
                >
                  <i className="fas fa-user-circle mr-2 text-lg" />
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      )}

      {/* Exact spacer — no extra white space */}
      {!isExamPage && <div className="h-16 md:h-20" />}

      {/* ── MOBILE BOTTOM NAV ── */}
      <AnimatePresence>
        <motion.div
          key="bottom-nav"
          initial={{ x: 0 }}
          animate={{ x: navHidden ? '-100%' : 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-[100] flex"
          style={{ padding: '0 12px calc(12px + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex-1">
            <div
              className="relative flex items-center justify-around px-2 py-1.5 rounded-[24px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg dark:shadow-[0_-1px_0_rgba(0,0,0,0.3),0_8px_32px_rgba(0,0,0,0.4)]"
            >
              <NavItems navLinks={navLinks} isActive={isActive} activeColors={activeColors} setNavHidden={setNavHidden} />
            </div>
          </div>
        </motion.div>

        {navHidden && (
          <motion.button
            key="peek-btn"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={() => setNavHidden(false)}
            className="md:hidden fixed bottom-4 left-0 z-[110] h-12 w-10 rounded-r-2xl flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-l-0 border-gray-200/50 dark:border-white/10 shadow-lg"
            aria-label="Show navigation"
          >
            <i className="fas fa-chevron-right text-gray-400 text-lg" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

// Extracted nav items to avoid duplication between light/dark containers
const NavItems = ({
  navLinks,
  isActive,
  activeColors,
  setNavHidden
}: {
  navLinks: { path: string; icon: React.ElementType; label: string; color: string }[];
  isActive: (p: string) => boolean;
  activeColors: Record<string, { bg: string; icon: string; label: string; dot: string }>;
  setNavHidden: (hidden: boolean) => void;
}) => (
  <>
    {navLinks.map(({ path, icon: Icon, label, color }) => {
      const active = isActive(path);
      const c = activeColors[color];
      return (
        <Link
          key={path}
          to={path}
          className="relative flex-1 flex flex-col items-center gap-[1px] py-2 rounded-[20px] select-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <AnimatePresence>
            {active && (
              <motion.div
                layoutId={`nav-bg-${color}`}
                className={`absolute inset-0 rounded-[20px] ${c.bg}`}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.8 }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative z-10"
            animate={active ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.6 }}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.5 : 1.8}
              className={`transition-colors duration-200 ${active ? c.icon : 'text-gray-400 dark:text-gray-500'}`}
            />
          </motion.div>

          <motion.span
            className={`relative z-10 text-[9px] font-black uppercase tracking-[0.06em] transition-colors duration-200 ${active ? c.label : 'text-gray-400 dark:text-gray-500'}`}
            animate={{ opacity: active ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>

          <AnimatePresence>
            {active && (
              <motion.span
                layoutId="nav-dot"
                className={`absolute bottom-1 w-[4px] h-[4px] rounded-full ${c.dot}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 400, mass: 0.5 }}
              />
            )}
          </AnimatePresence>
        </Link>
      );
    })}

    {/* Hide Arrow Button (1/4 width) */}
    <div className="w-px h-7 bg-gray-700/60 mx-0.5 rounded-full flex-shrink-0" />
    <button
      onClick={() => setNavHidden(true)}
      className="relative flex flex-col items-center justify-center py-2 rounded-[20px] select-none w-1/4 max-w-[40px]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <i className="fas fa-chevron-left text-gray-400 text-lg" />
    </button>
  </>
);

export default Navbar;
