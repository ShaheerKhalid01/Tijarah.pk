'use client';

import { useState, useCallback, useMemo } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// ✅ OPTIMIZED: Extract ErrorAlert component
const ErrorAlert = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-800 text-sm">{error}</p>
    </div>
  );
};

// ✅ OPTIMIZED: Extract EmailField component
const EmailField = ({ email, onChange }) => (
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
      Email Address
    </label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={onChange}
      placeholder="admin@example.com"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
      autoComplete="email"
    />
  </div>
);

// ✅ OPTIMIZED: Extract PasswordField component
const PasswordField = ({ password, onChange }) => (
  <div>
    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
      Password
    </label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={onChange}
      placeholder="••••••••"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
      autoComplete="current-password"
    />
  </div>
);

// ✅ OPTIMIZED: Extract SubmitButton component
const SubmitButton = ({ isLoading }) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 active:scale-95"
  >
    {isLoading ? 'Signing in...' : 'Sign In'}
  </button>
);

// ✅ OPTIMIZED: Extract FooterLinks component
const FooterLinks = ({ locale }) => (
  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
    <div className="text-center">
      <Link 
        href={`/${locale}`} 
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Back to Home
      </Link>
    </div>
    <div className="text-center text-xs text-gray-600">
      <p>Unauthorized access to this page is prohibited.</p>
    </div>
  </div>
);

// ✅ OPTIMIZED: Extract LoginCard component
const LoginCard = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-xl p-8">
        {children}
      </div>
    </div>
  </div>
);

// ✅ OPTIMIZED: Extract Header component
const LoginHeader = () => (
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">
      Admin Portal
    </h1>
    <p className="text-gray-600">Sign in to your admin account</p>
  </div>
);

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ OPTIMIZED: Memoized locale
  const locale = useMemo(() => params?.locale || 'en', [params?.locale]);

  // ✅ OPTIMIZED: Memoized email change handler
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  // ✅ OPTIMIZED: Memoized password change handler
  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  // ✅ OPTIMIZED: Memoized submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role: 'admin',
        redirect: false,
      });

      if (!result?.ok) {
        setError(result?.error || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Redirect to admin dashboard on success
      router.push(`/${locale}/admin/dashboard`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }, [email, password, locale, router]);

  return (
    <LoginCard>
      <LoginHeader />
      <ErrorAlert error={error} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <EmailField email={email} onChange={handleEmailChange} />
        <PasswordField password={password} onChange={handlePasswordChange} />
        <SubmitButton isLoading={isLoading} />
      </form>

      <FooterLinks locale={locale} />
    </LoginCard>
  );
}