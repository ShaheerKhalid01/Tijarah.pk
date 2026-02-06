'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// ✅ OPTIMIZED: Move validation regex patterns outside
const VALIDATION_PATTERNS = {
  EMAIL: /\S+@\S+\.\S+/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
};

const MIN_PASSWORD_LENGTH = 6;

// ✅ OPTIMIZED: Extract FormField component
const FormField = ({ label, id, name, type = 'text', placeholder, value, onChange, error, autoComplete }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// ✅ OPTIMIZED: Extract TermsCheckbox component
const TermsCheckbox = ({ locale }) => (
  <div className="flex items-start">
    <input
      type="checkbox"
      id="terms"
      required
      className="mt-1 mr-2"
    />
    <label htmlFor="terms" className="text-sm text-gray-600">
      I agree to the{' '}
      <Link href={`/${locale}/terms`} className="text-blue-600 hover:text-blue-700">
        Terms and Conditions
      </Link>{' '}
      and{' '}
      <Link href={`/${locale}/privacy`} className="text-blue-600 hover:text-blue-700">
        Privacy Policy
      </Link>
    </label>
  </div>
);

// ✅ OPTIMIZED: Extract SubmitButton component
const SubmitButton = ({ isLoading }) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 active:scale-95"
  >
    {isLoading ? 'Creating Account...' : 'Create Account'}
  </button>
);

// ✅ OPTIMIZED: Extract RegisterHeader component
const RegisterHeader = () => (
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">
      Create Account
    </h1>
    <p className="text-gray-600">Join Tijarah.pk today</p>
  </div>
);

// ✅ OPTIMIZED: Extract RegisterCard component
const RegisterCard = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-xl p-8">
        {children}
      </div>
    </div>
  </div>
);

// ✅ OPTIMIZED: Extract FooterLinks component
const FooterLinks = ({ locale }) => (
  <div className="mt-6 pt-6 border-t border-gray-200">
    <div className="text-center text-sm text-gray-600">
      Already have an account?{' '}
      <Link href={`/${locale}/login`} className="text-blue-600 hover:text-blue-700 font-medium">
        Sign In
      </Link>
    </div>
    <div className="text-center mt-3">
      <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-700 text-sm">
        Back to Home
      </Link>
    </div>
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ✅ OPTIMIZED: Memoized locale
  const locale = useMemo(() => params?.locale || 'en', [params?.locale]);

  // ✅ OPTIMIZED: Memoized validation function
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!VALIDATION_PATTERNS.EMAIL.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!VALIDATION_PATTERNS.PHONE.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ✅ OPTIMIZED: Memoized input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // ✅ OPTIMIZED: Memoized submit handler with better error handling
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Registration failed');
      }

      toast.success('Registration successful! Please sign in.');
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, locale, router]);

  return (
    <RegisterCard>
      <RegisterHeader />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          autoComplete="name"
        />

        <FormField
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          autoComplete="email"
        />

        <FormField
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          placeholder="+92 300 1234567"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          autoComplete="tel"
        />

        <FormField
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <FormField
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <TermsCheckbox locale={locale} />

        <SubmitButton isLoading={isLoading} />
      </form>

      <FooterLinks locale={locale} />
    </RegisterCard>
  );
}