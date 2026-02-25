import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
    </button>
  );
};
export default ThemeToggle;