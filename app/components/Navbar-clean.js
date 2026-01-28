'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import ReactCountryFlag from 'react-country-flag';
import LoginModal from './LoginModal';
import Notification from './Notification';

export default function Navbar() {
    const router = useRouter();
    const { t } = useIntl();
    const pathname = usePathname();
    
    // State management
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState({
        code: 'en',
        name: 'English',
        flag: 'US'
    });
    
    const locale = pathname?.split('/')[1] || 'en';
    const [selectedCountry, setSelectedCountry] = useState({
        name: "Pakistan",
        code: "PK"
    });
    
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Constants
    const languages = [
        { code: 'en', name: 'English', flag: 'US' },
        { code: 'ar', name: 'العربية', flag: 'SA' },
        { code: 'ur', name: 'اردو', flag: 'PK' },
        { code: 'zh', name: '中文', flag: 'CN' },
        { code: 'tr', name: 'Türkçe', flag: 'TR' },
        { code: 'ms', name: 'Bahasa Melayu', flag: 'MY' },
        { code: 'id', name: 'Bahasa Indonesia', flag: 'ID' },
    ];

    const categories = [
        { name: "Electronics", href: `/${locale}/categories/electronics` },
        { name: "Fashion", href: "#" },
        { name: "Home & Kitchen", href: "#" },
        { name: "Beauty & Personal Care", href: "#" },
        { name: "Sports & Outdoors", href: "#" },
        { name: "Toys & Games", href: "#" },
        { name: "Books & Media", href: "#" },
        { name: "Health & Household", href: "#" },
        { name: "Automotive", href: "#" },
        { name: "Pet Supplies", href: "#" },
        { name: "Office Products", href: "#" },
        { name: "Grocery & Gourmet Food", href: "#" },
    ];

    const asianCountries = [
        { name: "Afghanistan", code: "AF" },
        { name: "Armenia", code: "AM" },
        { name: "Azerbaijan", code: "AZ" },
        { name: "Bahrain", code: "BH" },
        { name: "Bangladesh", code: "BD" },
        { name: "Bhutan", code: "BT" },
        { name: "Brunei", code: "BN" },
        { name: "Cambodia", code: "KH" },
        { name: "China", code: "CN" },
        { name: "Cyprus", code: "CY" },
        { name: "Georgia", code: "GE" },
        { name: "India", code: "IN" },
        { name: "Indonesia", code: "ID" },
        { name: "Iran", code: "IR" },
        { name: "Iraq", code: "IQ" },
        { name: "Israel", code: "IL" },
        { name: "Japan", code: "JP" },
        { name: "Jordan", code: "JO" },
        { name: "Kazakhstan", code: "KZ" },
        { name: "Kuwait", code: "KW" },
        { name: "Kyrgyzstan", code: "KG" },
        { name: "Laos", code: "LA" },
        { name: "Lebanon", code: "LB" },
        { name: "Malaysia", code: "MY" },
        { name: "Maldives", code: "MV" },
        { name: "Mongolia", code: "MN" },
        { name: "Myanmar", code: "MM" },
        { name: "Nepal", code: "NP" },
        { name: "North Korea", code: "KP" },
        { name: "Oman", code: "OM" },
        { name: "Pakistan", code: "PK" },
        { name: "Palestine", code: "PS" },
        { name: "Philippines", code: "PH" },
        { name: "Qatar", code: "QA" },
        { name: "Saudi Arabia", code: "SA" },
        { name: "Singapore", code: "SG" },
        { name: "South Korea", code: "KR" },
        { name: "Sri Lanka", code: "LK" },
        { name: "Syria", code: "SY" },
        { name: "Taiwan", code: "TW" },
        { name: "Tajikistan", code: "TJ" },
        { name: "Thailand", code: "TH" },
        { name: "Timor-Leste", code: "TL" },
        { name: "Turkey", code: "TR" },
        { name: "Turkmenistan", code: "TM" },
        { name: "United Arab Emirates", code: "AE" },
        { name: "Uzbekistan", code: "UZ" },
        { name: "Vietnam", code: "VN" },
        { name: "Yemen", code: "YE" }
    ];

    // Event handlers
    const changeLanguage = async (lang) => {
        const { pathname, asPath, query } = router;
        router.push(
            {
                pathname,
                query: { ...query, lang: lang.code },
            },
            asPath,
            { locale: lang.code }
        );
        setCurrentLanguage(lang);
        setIsLanguageOpen(false);
        showNotificationMessage(
            t('notification.language_changed', { language: lang.name }),
            'success'
        );
    };

    const showNotificationMessage = (message, type = 'success') => {
        setNotification({ message, type });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleSignIn = async (formData) => {
        try {
            // In a real app, you would make an API call to authenticate
            console.log('Sign in data:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = {
                name: formData.name || formData.email.split('@')[0],
                email: formData.email
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoggedIn(true);
            setUserName(user.name);
            setIsLoginModalOpen(false);
            showNotificationMessage('Successfully signed in!', 'success');
        } catch (error) {
            console.error('Sign in error:', error);
            showNotificationMessage('Failed to sign in. Please try again.', 'error');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserName("");
        showNotificationMessage('Successfully signed out', 'success');
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };
    
    const navigateToCart = () => {
        router.push('/cart');
    };
    
    const navigateToOrders = () => {
        if (isLoggedIn) {
            router.push('/account/orders');
        } else {
            setIsLoginModalOpen(true);
            showNotificationMessage('Please sign in to view your orders', 'info');
        }
    };

    // Effects
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedUser = localStorage.getItem('user');
        
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
        }
        
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setIsLoggedIn(true);
            setUserName(user.name || user.email.split('@')[0]);
        }
        
        // Close dropdowns when clicking outside
        const handleClickOutside = (event) => {
            const target = event.target;
            const isClickInside = target.closest('.language-selector') || target.closest('.country-selector');
            
            if (!isClickInside) {
                setIsCountryOpen(false);
                setIsLanguageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <nav className="bg-blue-700">
                {/* Top Navigation */}
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center mr-6">
                            <Link href="/" className="flex items-center">
                                <Image 
                                    src="/logo.png"
                                    alt="Tijarah.pk" 
                                    width={200}
                                    height={60}
                                    className="h-20 w-auto"
                                    priority
                                />
                            </Link>
                        </div>
                        
                        {/* Country Selector */}
                        <div className="relative">
                            <div 
                                className="flex items-center cursor-pointer country-selector" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCountryOpen(!isCountryOpen);
                                    setIsLanguageOpen(false);
                                }}
                            >
                                <div className="mr-2 text-blue-200">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <div className="flex items-center">
                                    <ReactCountryFlag
                                        countryCode={selectedCountry.code}
                                        svg
                                        style={{
                                            width: '1.2em',
                                            height: '1.2em',
                                            marginRight: '0.5em',
                                            borderRadius: '2px'
                                        }}
                                        title={selectedCountry.name}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white">{selectedCountry.name}</span>
                                    </div>
                                </div>
                            </div>
                            {isCountryOpen && (
                                <div className="absolute z-50 mt-1 w-72 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
                                    <div className="p-2 sticky top-0 bg-white border-b">
                                        <input
                                            type="text"
                                            placeholder={t('search_countries')}
                                            className="w-full p-2 border rounded-md text-sm text-black"  
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="divide-y">
                                        {asianCountries.map((country) => (
                                            <div
                                                key={country.code}
                                                className={`flex items-center p-2 text-sm hover:bg-gray-100 cursor-pointer ${
                                                    selectedCountry.code === country.code ? "bg-blue-50" : ""
                                                }`}
                                                onClick={() => {
                                                    setSelectedCountry(country);
                                                    setIsOpen(false);
                                                    setSearchTerm("");
                                                }}
                                            >
                                                <ReactCountryFlag
                                                    countryCode={country.code}
                                                    svg
                                                    style={{
                                                        width: '1.5em',
                                                        height: '1.5em',
                                                        marginRight: '0.75em',
                                                        borderRadius: '2px'
                                                    }}
                                                    title={country.name}
                                                />
                                                <span className="text-gray-800">{country.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-3xl mx-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder={t('search_tijarah_pk')}
                                    className="w-full py-2.5 px-4 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    className="absolute right-0 top-0 h-full px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </form>
                        </div>

                        {/* Navigation Icons */}
                        <div className="flex items-center space-x-6 text-white">
                            {/* Language Selector */}
                            <div className="relative">
                                <button 
                                    className="flex flex-col items-center text-sm hover:text-blue-200"
                                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                    <span>{currentLanguage.code.toUpperCase()}</span>
                                </button>
                                
                                {isLanguageOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <h3 className="block px-4 py-2 text-sm font-medium text-gray-700 border-b">Select Language</h3>
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                                    currentLanguage.code === lang.code ? 'bg-blue-50 text-blue-600' : ''
                                                }`}
                                                onClick={() => changeLanguage(lang)}
                                            >
                                                <ReactCountryFlag
                                                    countryCode={lang.flag}
                                                    svg
                                                    style={{
                                                        width: '1.2em',
                                                        height: '1.2em',
                                                        marginRight: '0.5em',
                                                        borderRadius: '2px'
                                                    }}
                                                    title={lang.name}
                                                />
                                                <span>{lang.name}</span>
                                                {currentLanguage.code === lang.code && (
                                                    <svg className="ml-auto h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* User Account */}
                            {isLoggedIn ? (
                                <div className="relative group">
                                    <div className="flex flex-col items-center cursor-pointer">
                                        <div className="flex flex-col items-center text-sm hover:text-blue-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Hello, {userName}</span>
                                        </div>
                                    </div>
                                    <div className="absolute right-0 mt-0 pt-2 w-48 z-50 hidden group-hover:block">
                                        <div className="bg-white rounded-md shadow-lg py-1">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Orders</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Lists</a>
                                            <button 
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    className="flex flex-col items-center text-sm hover:text-blue-200"
                                    onClick={() => setIsLoginModalOpen(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Sign In</span>
                                </button>
                            )}
                            
                            {/* Orders */}
                            <button 
                                onClick={navigateToOrders}
                                className="flex flex-col items-center text-sm hover:text-blue-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>Orders</span>
                            </button>
                            
                            {/* Cart */}
                            <button 
                                onClick={navigateToCart}
                                className="flex flex-col items-center text-sm hover:text-blue-200 relative"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Categories */}
                    <div className="relative">
                        <div 
                            className="flex items-center space-x-1 text-white py-2 px-4 bg-blue-800 rounded-md cursor-pointer hover:bg-blue-900 transition-colors"
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span className="font-medium">All Categories</span>
                        </div>
                        
                        {isCategoriesOpen && (
                            <div className="absolute z-40 w-64 bg-white rounded-b-md shadow-lg">
                                <div className="py-1">
                                    {categories.map((category, index) => (
                                        <Link 
                                            key={index} 
                                            href={category.href} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            
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
        </>
    );
}
