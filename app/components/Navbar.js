'use client';

import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import ReactCountryFlag from "react-country-flag";
import LoginModal from './LoginModal';
import Notification from './Notification';
import { useCart } from '../../contexts/CartContext';

const languages = [
    { code: 'en', name: 'English', flag: 'US' },
    { code: 'ar', name: 'العربية', flag: 'SA' },
    { code: 'ur', name: 'اردو', flag: 'PK' },
    { code: 'zh', name: '中文', flag: 'CN' },
    { code: 'tr', name: 'Türkçe', flag: 'TR' },
    { code: 'ms', name: 'Bahasa Melayu', flag: 'MY' },
    { code: 'id', name: 'Bahasa Indonesia', flag: 'ID' },
];

const asianCountries = [
    { name: "Pakistan", code: "PK" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "China", code: "CN" }
];

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { cartCount } = useCart();
    const t = useTranslations('common');

    // Extract locale from URL path
    const getLocaleFromPath = (path) => {
        const firstSegment = path?.split('/')[1];
        const isSupportedLocale = languages.some(lang => lang.code === firstSegment);
        return isSupportedLocale ? firstSegment : 'en';
    };
    const locale = getLocaleFromPath(pathname);

    // State for dropdown toggles
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);
    const [leaveTimer, setLeaveTimer] = useState(null);

    // Set current language based on URL locale
    const [currentLanguage, setCurrentLanguage] = useState(() =>
        languages.find(lang => lang.code === locale) || languages[0]
    );

    // Selected country state
    const [selectedCountry, setSelectedCountry] = useState({
        name: 'All Asian Countries', // Static name for SSR
        code: 'AS'
    });

    // Update derived state when dependencies change
    useEffect(() => {
        setSelectedCountry(prev => ({ ...prev, name: t('all_asian_countries') }));
    }, [t]);

    useEffect(() => {
        const lang = languages.find(l => l.code === locale);
        if (lang) setCurrentLanguage(lang);
    }, [locale]);

    // Filter countries based on search
    const filteredCountries = asianCountries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Language change handler
    const changeLanguage = (lang) => {
        if (!lang || !lang.code) return;

        const segments = pathname.split('/').filter(Boolean);
        const firstSegment = segments[0];
        const isLocale = languages.some(l => l.code === firstSegment);

        const pathSegments = isLocale ? segments.slice(1) : segments;
        const newPath = `/${lang.code}/${pathSegments.join('/')}`;

        router.push(newPath);
        setIsLanguageDropdownOpen(false);
        showNotificationMessage(`Language changed to ${lang.name}`, 'success');
    };

    // Show notification message
    const showNotificationMessage = (message, type = 'success') => {
        setNotification({ message, type });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    // Handle sign in
    const handleSignIn = (formData) => {
        const user = { name: formData.name || formData.email.split('@')[0], email: formData.email };
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoggedIn(true);
        setUserName(user.name);
        setIsLoginModalOpen(false);
        showNotificationMessage('Successfully signed in!', 'success');
    };

    // Handle sign out
    const handleSignOut = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserName("");
        showNotificationMessage('Successfully signed out', 'success');
    };

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    // Load user data from localStorage on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setIsLoggedIn(true);
            setUserName(user.name || user.email.split('@')[0]);
        }

        // Close dropdowns when clicking outside
        const handleClickOutside = (event) => {
            if (!event.target.closest('.language-selector') && !event.target.closest('.country-selector')) {
                setIsCountryDropdownOpen(false);
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-blue-700">
            {/* Top Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-2">
                    {/* Logo */}
                    <Link href={`/${locale}`}>
                        <Image
                            src="/logo.png"
                            width={250}
                            height={100}
                            alt="Tijarah.pk"
                            className="h-20 w-24"
                            unoptimized={true}
                            priority
                        />
                    </Link>

                    {/* Location Selector */}
                    <div className="relative mx-2 w-48 country-selector">
                        <div
                            className="flex items-center cursor-pointer hover:bg-blue-600 p-2 rounded-md"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        >
                            <div className="mr-2 text-blue-200">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-blue-200">{t('deliver_to')}</span>
                                <span className="text-sm font-medium text-white truncate w-32">
                                    {selectedCountry.name}
                                </span>
                            </div>
                        </div>

                        {isCountryDropdownOpen && (
                            <div className="absolute z-50 mt-1 w-72 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                                <div className="p-2 sticky top-0 bg-white border-b">
                                    <input
                                        type="text"
                                        placeholder={t('search_countries')}
                                        className="w-full p-2 border rounded-md text-sm text-black"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {filteredCountries.map((country) => (
                                    <div
                                        key={country.code}
                                        className="flex items-center p-2 text-sm hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSelectedCountry(country);
                                            setIsCountryDropdownOpen(false);
                                        }}
                                    >
                                        <ReactCountryFlag
                                            countryCode={country.code}
                                            svg
                                            style={{ width: '1.5em', marginRight: '0.75em' }}
                                        />
                                        <span className="text-gray-800">{country.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-4">
                        <form onSubmit={handleSearch} className="relative flex shadow-sm">
                            <input
                                type="text"
                                placeholder={t('search_tijarah_pk')}
                                className="w-full py-2 px-4 bg-white text-gray-900 placeholder-gray-500 rounded-l-md border-y border-l border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 px-5 text-white rounded-r-md hover:bg-blue-600 border-y border-r border-blue-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Right Navigation Icons */}
                    <div className="flex items-center space-x-5 text-white">
                        {/* Language Selector */}
                        <div className="relative language-selector">
                            <button
                                className="flex flex-col items-center text-sm hover:text-blue-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                                }}
                            >
                                <ReactCountryFlag
                                    countryCode={currentLanguage.flag}
                                    svg
                                    style={{ width: '1.5em', height: '1.5em' }}
                                />
                                <span className="uppercase">{currentLanguage.code}</span>
                            </button>

                            {isLanguageDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <p className="px-4 py-2 text-xs font-bold text-gray-400 border-b">
                                        {t('select_language')}
                                    </p>
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${currentLanguage.code === lang.code ? 'bg-blue-50 font-bold text-blue-600' : ''
                                                }`}
                                            onClick={() => changeLanguage(lang)}
                                        >
                                            <ReactCountryFlag
                                                countryCode={lang.flag}
                                                svg
                                                style={{ width: '1.2em', marginRight: '10px' }}
                                            />
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Account */}
                        {isLoggedIn ? (
                            <div className="relative group">
                                <div className="text-sm hover:text-blue-200 cursor-pointer">
                                    <p className="text-[10px]">{t('hello')}, {userName}</p>
                                    <p className="font-bold">{t('account')}</p>
                                </div>
                                <div className="absolute right-0 mt-0 pt-2 w-48 hidden group-hover:block z-50">
                                    <div className="bg-white text-black rounded shadow-xl py-2">
                                        <Link
                                            href={`/${locale}/profile`}
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            {t('your_profile')}
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            {t('sign_out')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="text-sm hover:text-blue-200 text-left"
                            >
                                <p className="text-[10px]">{t('hello_sign_in')}</p>
                                <p className="font-bold">{t('account_label')}</p>
                            </button>
                        )}

                        {/* Returns & Orders */}
                        <Link
                            href={`/${locale}/returns-orders`}
                            className="text-sm hover:text-blue-200 text-left"
                        >
                            <p className="text-[10px]">{t('returns')}</p>
                            <p className="font-bold">{t('and_orders')}</p>
                        </Link>

                        {/* Cart */}
                        <Link
                            href={`/${locale}/cart`}
                            className="flex items-end relative hover:text-blue-200"
                        >
                            <div className="relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 right-0 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="font-bold text-sm ml-1">{t('cart_label')}</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Categories Bar */}
            <div className="bg-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center space-x-4 text-sm font-medium py-1">
                        {/* Categories Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => {
                                if (leaveTimer) {
                                    clearTimeout(leaveTimer);
                                    setLeaveTimer(null);
                                }
                                setIsCategoriesOpen(true);
                            }}
                            onMouseLeave={() => {
                                const timer = setTimeout(() => {
                                    setIsCategoriesOpen(false);
                                }, 500); // Increased to 500ms for better UX
                                setLeaveTimer(timer);
                            }}
                        >
                            <button className="flex items-center hover:outline hover:outline-1 p-1">
                                <svg
                                    className="h-5 w-5 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                {t('all_categories')}
                            </button>

                            {/* Categories Dropdown Menu */}
                            {isCategoriesOpen && (
                                <div
                                    className="absolute z-50 left-0 mt-0 w-56 bg-white text-black shadow-xl rounded-b-md"
                                    onMouseEnter={() => {
                                        if (leaveTimer) {
                                            clearTimeout(leaveTimer);
                                            setLeaveTimer(null);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        const timer = setTimeout(() => {
                                            setIsCategoriesOpen(false);
                                        }, 500);
                                        setLeaveTimer(timer);
                                    }}
                                >
                                    <Link
                                        href={`/${locale}/categories/electronics`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100"
                                    >
                                        {t('electronics')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/fashion`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100"
                                    >
                                        {t('fashion')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/home`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100"
                                    >
                                        {t('home_kitchen')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/books`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100"
                                    >
                                        {t('books_media')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/beauty`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100"
                                    >
                                        {t('beauty_personal_care')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/sports`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100"
                                    >
                                        {t('sports_outdoors')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/toys`}
                                        className="block px-4 py-2 hover:bg-blue-50"
                                    >
                                        {t('toys_games')}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <Link
                            href={`/${locale}/deals`}
                            className="hover:outline hover:outline-1 p-1"
                        >
                            {t('todays_deals')}
                        </Link>
                        <Link
                            href={`/${locale}/customer-service`}
                            className="hover:outline hover:outline-1 p-1"
                        >
                            {t('customer_service')}
                        </Link>
                        <Link
                            href={`/${locale}/sell`}
                            className="hover:outline hover:outline-1 p-1"
                        >
                            {t('sell')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSignIn={handleSignIn}
            />

            {/* Notification */}
            {showNotification && (
                <div className="fixed top-4 right-4 z-50">
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setShowNotification(false)}
                    />
                </div>
            )}
        </nav>
    );
};

export default Navbar;