import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage(t('verification.invalidToken') || 'Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || t('verification.failed') || 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, t]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('verification.verifying') || 'Verifying your email...'}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-check-circle text-3xl text-green-600"></i>
            </div>
            <h2 className="text-2xl font-bold mt-4">{t('verification.success') || 'Email Verified!'}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p>
            <Link
              to="/login"
              className="inline-block mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {t('verification.goToLogin') || 'Go to Login'}
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-exclamation-circle text-3xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold mt-4">{t('verification.failed') || 'Verification Failed'}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p>
            <Link
              to="/"
              className="inline-block mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {t('common.goHome') || 'Go Home'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;