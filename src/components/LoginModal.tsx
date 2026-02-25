import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { t } = useLanguage();
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(identifier, password);
      onClose();
      // Reset form
      setIdentifier('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <h2 className="text-2xl font-bold mb-6">
          {t('modal.login')}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-md">
            <p className="text-red-700 dark:text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {t('modal.emailOrUsername')}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
              placeholder={t('modal.emailOrUsernamePlaceholder')}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              {t('modal.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 dark:bg-blue-600 text-white py-2 rounded-md hover:bg-green-700 dark:hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t('modal.loggingIn')}
              </span>
            ) : (
              t('modal.login')
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-sm text-green-600 dark:text-blue-400 hover:underline focus:outline-none"
          >
            {t('modal.createAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;