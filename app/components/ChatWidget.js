'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FiSend, FiX, FiMessageCircle, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Chat message component
const ChatMessage = ({ message, isBot, onProductClick }) => {
    if (!isBot) {
        return (
            <div className="flex justify-end mb-4">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs md:max-w-sm lg:max-w-md rounded-br-none">
                    <p className="text-sm">{message.text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-xs md:max-w-sm lg:max-w-md rounded-bl-none">
                <p className="text-sm mb-3 whitespace-pre-wrap">{message.text}</p>

                {/* Display recommended products */}
                {message.products && message.products.length > 0 && (
                    <div className="space-y-3 mt-3">
                        {message.products.map(product => (
                            <div
                                key={product.id}
                                onClick={() => onProductClick(product)}
                                className="bg-white p-3 rounded cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                            >
                                <div className="flex gap-2">
                                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name || product.id}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 line-clamp-2">
                                            {product.name || product.id}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-sm font-bold text-blue-600">
                                                ${product.price?.toLocaleString()}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ${product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        {product.discount > 0 && (
                                            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                -{product.discount}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Main chatbot component
export default function AIChatbot() {
    const t = useTranslations('chatbot');
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const messagesEndRef = useRef(null);

    // Initialize session ID
    useEffect(() => {
        let storedSessionId = localStorage.getItem('chatSessionId');
        if (!storedSessionId) {
            storedSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('chatSessionId', storedSessionId);
        }
        setSessionId(storedSessionId);

        // Initial welcome message
        setMessages([{
            id: 'welcome',
            text: t('welcome_message'),
            isBot: true,
            products: []
        }]);
    }, [t]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isMinimized]);

    const handleSendMessage = useCallback(async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add user message
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: userMessage,
            isBot: false,
            products: []
        }]);

        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    sessionId: sessionId
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();

            // Add bot response with products
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.response,
                isBot: true,
                products: data.products || []
            }]);

        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to get response');
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm having trouble connecting right now. Please try again later.",
                isBot: true
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, sessionId]);

    const handleProductClick = (product) => {
        toast.success(`Check out "${product.name || product.id}"!`, {
            position: 'bottom-center',
            duration: 2000
        });
        // You can add router.push logic here if you want to navigate to product page
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-[9999]"
                title={t('open_chat')}
            >
                <FiMessageCircle size={24} />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-0 right-0 w-full md:bottom-6 md:right-6 md:w-96 bg-white md:rounded-lg shadow-2xl flex flex-col z-[9999] overflow-hidden transition-all duration-300 ${isMinimized ? 'h-14 md:h-16 rounded-t-lg md:rounded-lg' : 'h-[85vh] rounded-t-2xl md:h-[600px] md:max-h-[calc(100vh-120px)]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
                <div>
                    <h3 className="font-semibold text-lg">{t('title')}</h3>
                    {!isMinimized && <p className="text-xs text-blue-100">{t('subtitle')}</p>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                        className="hover:bg-blue-700 p-2 rounded transition-colors"
                        title={isMinimized ? t('expand') : t('minimize')}
                    >
                        {isMinimized ? <FiMaximize2 size={18} /> : <FiMinimize2 size={18} />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        className="hover:bg-blue-700 p-2 rounded transition-colors"
                        title={t('close')}
                    >
                        <FiX size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map(message => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isBot={message.isBot}
                                onProductClick={handleProductClick}
                            />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 rounded-bl-none">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-4 bg-white">
                        <div className="flex gap-2">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={t('placeholder')}
                                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                                rows="1"
                                style={{ minHeight: '42px', maxHeight: '100px' }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputValue.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg p-2 transition-colors flex-shrink-0 flex items-center justify-center w-10 h-10"
                                title={t('send')}
                            >
                                <FiSend size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {t('powered_by_ai')}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}