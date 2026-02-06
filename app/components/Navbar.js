'use client';

import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useSafeTranslations } from '../../hooks/useSafeTranslations';
import ReactCountryFlag from "react-country-flag";
import LoginModal from './LoginModal';
import Notification from './Notification';

const LANGUAGES = [
    { code: 'en', name: 'English', flag: 'US' },
    { code: 'ur', name: 'اردو', flag: 'PK' },
    { code: 'zh', name: '中文', flag: 'CN' },
    { code: 'tr', name: 'Türkçe', flag: 'TR' },
    { code: 'ms', name: 'Bahasa Melayu', flag: 'MY' },
    { code: 'id', name: 'Bahasa Indonesia', flag: 'ID' },
];

const ASIAN_COUNTRIES = [
    { name: "Pakistan", code: "PK" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "China", code: "CN" }
];

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { t, isReady } = useSafeTranslations('common');

    // Extract locale from URL path
    const getLocaleFromPath = (path) => {
        const firstSegment = path?.split('/')[1];
        const isSupportedLocale = LANGUAGES.some(lang => lang.code === firstSegment);
        return isSupportedLocale ? firstSegment : 'en';
    };
    const locale = useMemo(() => getLocaleFromPath(pathname), [pathname]);

    // ✅ SEPARATE states for country search and product search
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countrySearchQuery, setCountrySearchQuery] = useState('');

    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showNotification, setShowNotification] = useState(false);
    const [leaveTimer, setLeaveTimer] = useState(null);

    // ✅ Search suggestions state
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // ✅ NEW: Debounce timer ref
    const debounceTimerRef = useRef(null);

    // Derive current language directly from locale - no state needed
    const currentLanguage = useMemo(() =>
        LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0],
        [locale]
    );

    // Selected country state
    const [selectedCountry, setSelectedCountry] = useState({
        name: 'All Asian Countries',
        code: 'AS'
    });

    // Track if we've already set the initial country name
    const hasSetInitialCountry = useRef(false);

    // Update country name when translations change
    useEffect(() => {
        if (isReady && !hasSetInitialCountry.current) {
            const countryName = t('all_asian_countries', 'All Asian Countries');
            setSelectedCountry(prev => {
                // Only update if the name actually changed
                if (prev.name !== countryName) {
                    hasSetInitialCountry.current = true;
                    return { ...prev, name: countryName };
                }
                return prev;
            });
        }
    }, [isReady]);

    // ✅ Filter countries based on COUNTRY search
    const filteredCountries = ASIAN_COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
    );

    // ✅ FIXED: Fetch suggestions from API
    const fetchSuggestions = async (query) => {
        console.log('[Navbar] Fetching suggestions for:', query);
        setIsSearchLoading(true);
        setSearchError(null);

        try {
            const apiUrl = `/api/search/suggestions?q=${encodeURIComponent(query)}`;
            console.log('[Navbar] API URL:', apiUrl);

            const response = await fetch(apiUrl);
            console.log('[Navbar] Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('[Navbar] Success! Found:', data.suggestions?.length || 0, 'products');
                setSearchSuggestions(data.suggestions || []);
                setSearchError(null);
                setShowSearchSuggestions(true);
            } else {
                console.error('[Navbar] API error status:', response.status);
                setSearchSuggestions([]);
                setSearchError(`API Error: ${response.status}`);
                setShowSearchSuggestions(true);
            }
        } catch (error) {
            console.error('[Navbar] Fetch error:', error.message);
            setSearchSuggestions([]);
            setSearchError(`Error: ${error.message}`);
            setShowSearchSuggestions(true);
        } finally {
            setIsSearchLoading(false);
        }
    };

    // ✅ FIXED: Handle product search input change with DEBOUNCE
    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        console.log('[Navbar] Product search query:', query);
        setProductSearchQuery(query);
        setSearchError(null);

        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Show empty state while user is typing
        if (query.trim().length === 0) {
            console.log('[Navbar] Empty query - showing empty state');
            setShowSearchSuggestions(true);
            setSearchSuggestions([]);
            setIsSearchLoading(false);
            return;
        }

        // Set new timer - only call API after 300ms of no typing
        if (query.trim().length >= 1) {
            console.log('[Navbar] Setting debounce timer...');
            setIsSearchLoading(true);
            setShowSearchSuggestions(true);

            debounceTimerRef.current = setTimeout(() => {
                console.log('[Navbar] Debounce timer finished - calling API');
                fetchSuggestions(query);
            }, 300); // Wait 300ms after user stops typing
        }
    };

    // ✅ FIXED: Load initial suggestions on focus
    const handleSearchFocus = async () => {
        console.log('[Navbar] Search focused');
        setShowSearchSuggestions(true);

        // If search is empty, load all products
        if (productSearchQuery.trim().length === 0) {
            console.log('[Navbar] Loading initial products');
            await fetchSuggestions('');
        }
    };

    // Language change handler
    const changeLanguage = (lang) => {
        if (!lang || !lang.code) return;

        const segments = pathname.split('/').filter(Boolean);
        const firstSegment = segments[0];
        const isLocale = LANGUAGES.some(l => l.code === firstSegment);

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
        if (productSearchQuery.trim()) {
            console.log('[Navbar] Submitting search:', productSearchQuery);
            router.push(`/${locale}/search?q=${encodeURIComponent(productSearchQuery)}`);
            setProductSearchQuery('');
            setShowSearchSuggestions(false);
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
            const isOutsideCountry = !event.target.closest('.country-selector');
            const isOutsideLanguage = !event.target.closest('.language-selector');
            const isOutsideSearch = !event.target.closest('.search-container');

            if (isOutsideCountry) setIsCountryDropdownOpen(false);
            if (isOutsideLanguage) setIsLanguageDropdownOpen(false);
            if (isOutsideSearch) setShowSearchSuggestions(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            // Cleanup debounce timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
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
                                <span className="text-xs text-blue-200">{t('deliver_to') || 'Deliver to'}</span>
                                <span className="text-sm font-medium text-white truncate w-32">
                                    {selectedCountry.name}
                                </span>
                            </div>
                        </div>

                        {/* Country dropdown */}
                        {isCountryDropdownOpen && (
                            <div className="absolute z-50 mt-1 w-72 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                                <div className="p-2 sticky top-0 bg-white border-b">
                                    <input
                                        type="text"
                                        placeholder={t('search_countries', 'Search countries')}
                                        className="w-full p-2 border rounded-md text-sm text-black"
                                        value={countrySearchQuery}
                                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                        <div
                                            key={country.code}
                                            className="flex items-center p-2 text-sm hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSelectedCountry(country);
                                                setIsCountryDropdownOpen(false);
                                                setCountrySearchQuery('');
                                            }}
                                        >
                                            <ReactCountryFlag
                                                countryCode={country.code}
                                                svg
                                                style={{ width: '1.5em', marginRight: '0.75em' }}
                                            />
                                            <span className="text-gray-800">{country.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-gray-500 text-sm">
                                        No countries found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Search Bar - ✅ WITH DEBOUNCING */}
                    <div className="flex-1 max-w-2xl mx-4 relative search-container">
                        <form onSubmit={handleSearch} className="relative flex shadow-sm">
                            <input
                                type="text"
                                placeholder={t('search_tijarah_pk', 'Search Tijarah.pk')}
                                className="w-full py-2 px-4 bg-white text-gray-900 placeholder-gray-500 rounded-l-md border-y border-l border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                value={productSearchQuery}
                                onChange={handleSearchInputChange}
                                onFocus={handleSearchFocus}
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

                        {/* Search Suggestions Dropdown - ✅ FIXED CLOSING TAGS */}
                        {showSearchSuggestions && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-96 overflow-y-auto">
                                {isSearchLoading && (
                                    <div className="p-4 text-center text-gray-500">
                                        <div className="inline-block animate-spin">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </div>
                                        <p className="mt-2 text-sm">Loading suggestions...</p>
                                    </div>
                                )}

                                {!isSearchLoading && searchError && (
                                    <div className="p-4 text-center text-red-500">
                                        <p className="text-sm font-medium">{searchError}</p>
                                    </div>
                                )}

                                {!isSearchLoading && !searchError && searchSuggestions.length > 0 && (
                                    <>
                                        {searchSuggestions.map((product) => (
                                            <Link
                                                key={product._id}
                                                href={`/${locale}/products/${product._id}`}
                                                className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                                onClick={() => {
                                                    setProductSearchQuery(product.name);
                                                    setShowSearchSuggestions(false);
                                                }}
                                            >
                                                <img
                                                    src={product.image || '/placeholder-product.jpg'}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-md mr-3"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-product.jpg';
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {product.category} • {product.brand}
                                                    </p>
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-sm font-bold text-blue-600">
                                                            $ {product.price?.toLocaleString()}
                                                        </span>
                                                        {product.originalPrice && product.originalPrice > product.price && (
                                                            <span className="text-xs text-gray-500 line-through ml-2">
                                                                $ {product.originalPrice.toLocaleString()}
                                                            </span>
                                                        )}
                                                        {product.discount && (
                                                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded ml-2">
                                                                -{product.discount}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {productSearchQuery.trim() && (
                                            <Link
                                                href={`/${locale}/search?q=${encodeURIComponent(productSearchQuery)}`}
                                                className="block px-3 py-2 text-sm text-center text-blue-600 hover:bg-gray-50 font-medium border-t"
                                                onClick={() => setShowSearchSuggestions(false)}
                                            >
                                                View all results for "{productSearchQuery}"
                                            </Link>
                                        )}
                                    </>
                                )}

                                {!isSearchLoading && searchSuggestions.length === 0 && !searchError && productSearchQuery.trim() && (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No products found for "{productSearchQuery}"
                                    </div>
                                )}

                                {!isSearchLoading && searchSuggestions.length === 0 && !searchError && !productSearchQuery.trim() && (
                                    <div className="p-4 text-center text-gray-400 text-sm">
                                        <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <p className="font-medium">Start typing to search</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

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
                                        {t('select_language', 'Select Language')}
                                    </p>
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${currentLanguage.code === lang.code
                                                ? 'bg-blue-50 font-bold text-blue-600'
                                                : ''
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
                                    <p className="text-[10px]">{t('hello', 'Hello')}, {userName}</p>
                                    <p className="font-bold">{t('account', 'Account')}</p>
                                </div>
                                <div className="absolute right-0 mt-0 pt-2 w-48 hidden group-hover:block z-50">
                                    <div className="bg-white text-black rounded shadow-xl py-2">
                                        <Link
                                            href={`/${locale}/profile`}
                                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        >
                                            {t('your_profile', 'Your Profile')}
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                        >
                                            {t('sign_out', 'Sign Out')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="text-sm hover:text-blue-200 text-left"
                            >
                                <p className="text-[10px]">{t('hello_sign_in', 'Hello, Sign In')}</p>
                                <p className="font-bold">{t('account_label', 'Account')}</p>
                            </button>
                        )}

                        {/* Returns & Orders */}
                        <Link
                            href={`/${locale}/returns-orders`}
                            className="text-sm hover:text-blue-200 text-left"
                        >
                            <p className="text-[10px]">{t('returns', 'Returns')}</p>
                            <p className="font-bold">{t('and_orders', 'and Orders')}</p>
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
                            <span className="font-bold text-sm ml-1">{t('cart_label', 'Cart')}</span>
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
                                }, 500);
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
                                {t('all_categories', 'All Categories')}
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
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100 text-sm"
                                    >
                                        {t('electronics', 'Electronics')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/fashion`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100 text-sm"
                                    >
                                        {t('fashion', 'Fashion')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/home`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100 text-sm"
                                    >
                                        {t('home_kitchen', 'Home & Kitchen')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/books`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100 text-sm"
                                    >
                                        {t('books_media', 'Books & Media')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/beauty`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100 text-sm"
                                    >
                                        {t('beauty_personal_care', 'Beauty & Personal Care')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/sports`}
                                        className="block px-4 py-2 hover:bg-blue-50 border-b border-gray-100 text-sm"
                                    >
                                        {t('sports_outdoors', 'Sports & Outdoors')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/categories/toys`}
                                        className="block px-4 py-2 hover:bg-blue-50 text-sm"
                                    >
                                        {t('toys_games', 'Toys & Games')}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <Link
                            href={`/${locale}/deals`}
                            className="hover:outline hover:outline-1 p-1"
                        >
                            {t('todays_deals', "Today's Deals")}
                        </Link>
                        <Link
                            href={`/${locale}/customer-service`}
                            className="hover:outline hover:outline-1 p-1"
                        >
                            {t('customer_service', 'Customer Service')}
                        </Link>
                        <Link
                            href={`/${locale}/sell`}
                            className="hover:outline hover:outline-1 p-1"
                        >
                            {t('sell', 'Sell')}
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