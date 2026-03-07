import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageSquare, Zap, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { user, confirmLogout } = useAuth();
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  const isActive = (path: string) => location.pathname === path;

  // Threshold-based scroll hide — no jitter
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      if (diff > 6 && currentY > 80) setNavHidden(true);
      else if (diff < -6) setNavHidden(false);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      {/* ── TOP HEADER ── */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/40 dark:border-gray-800/40 shadow-[0_1px_12px_rgba(0,0,0,0.05)]">
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
                    <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-green-200 dark:shadow-none transition-all group-hover:scale-110 group-hover:rotate-3">
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

      {/* Exact spacer — no extra white space */}
      <div className="h-16 md:h-20" />

      {/* ── MOBILE BOTTOM NAV ── */}
      <AnimatePresence>
        {!navHidden ? (
          <motion.div
            key="bottom-nav"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.6 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[100]"
            style={{ padding: '0 12px calc(12px + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Light mode pill */}
            <div
              className="relative flex items-center justify-around px-2 py-1.5 rounded-[24px] dark:hidden"
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 -1px 0 rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <NavItems navLinks={navLinks} isActive={isActive} activeColors={activeColors} user={user} />
            </div>
            {/* Dark mode pill */}
            <div
              className="relative flex items-center justify-around px-2 py-1.5 rounded-[24px] hidden dark:flex"
              style={{
                background: 'rgba(10,10,20,0.88)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 -1px 0 rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <NavItems navLinks={navLinks} isActive={isActive} activeColors={activeColors} user={user} />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="peek-btn"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={() => setNavHidden(false)}
            className="md:hidden fixed bottom-5 right-4 z-[110] h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}
            aria-label="Show navigation"
          >
            <Menu size={18} strokeWidth={2.5} className="text-gray-700" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Content clearance for bottom nav — only when nav is visible */}
      <div className={`md:hidden transition-all duration-500 ease-in-out ${navHidden ? 'h-0' : 'h-[80px]'}`} />
    </>
  );
};

// Extracted nav items to avoid duplication between light/dark containers
const NavItems = ({
  navLinks,
  isActive,
  activeColors,
  user,
}: {
  navLinks: { path: string; icon: React.ElementType; label: string; color: string }[];
  isActive: (p: string) => boolean;
  activeColors: Record<string, { bg: string; icon: string; label: string; dot: string }>;
  user: { name: string } | null;
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

    {user && (
      <>
        <div className="w-px h-7 bg-gray-200/70 dark:bg-gray-700/60 mx-0.5 rounded-full flex-shrink-0" />
        <motion.div
          whileTap={{ scale: 0.85 }}
          transition={{ type: 'spring', damping: 16, stiffness: 420 }}
          className="flex-shrink-0 ml-1"
        >
          <Link to="/profile" className="relative block">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-[15px] shadow-md shadow-emerald-200/40 dark:shadow-none ring-[2px] ring-white/70 dark:ring-gray-800/80">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -top-0.5 -right-0.5 h-[11px] w-[11px] rounded-full bg-emerald-400 border-2 border-white dark:border-gray-950" />
          </Link>
        </motion.div>
      </>
    )}
  </>
);

export default Navbar;