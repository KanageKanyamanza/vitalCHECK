import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Widget de chat inspiré du style Harvest avec la charte graphique vitalCHECK
// Forme circulaire comme BackToTop, même dimension

const ChatWidget = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    // Messages initiaux avec traductions
    const initialMessage = {
        text: t('chatbot.initialMessage'),
        topics: [
            t('chatbot.topics.evaluation'),
            t('chatbot.topics.pricing'),
            t('chatbot.topics.report'),
            t('chatbot.topics.account')
        ],
        suggestion: t('chatbot.suggestion')
    };

    const popularTopics = [
        {
            id: 'assessment',
            label: t('chatbot.topicsList.assessment'),
            icon: '📊',
            keywords: ['évaluation', 'diagnostic', 'commencer', 'assessment']
        },
        {
            id: 'pricing',
            label: t('chatbot.topicsList.pricing'),
            icon: '💰',
            keywords: ['prix', 'tarif', 'coût', 'pricing']
        },
        {
            id: 'contact',
            label: t('chatbot.topicsList.contact'),
            icon: '📞',
            keywords: ['contact', 'aide', 'support']
        },
        {
            id: 'blog',
            label: t('chatbot.topicsList.blog'),
            icon: '📝',
            keywords: ['blog', 'articles', 'conseils']
        }
    ];

    const [messages, setMessages] = useState([
        { from: 'bot', text: initialMessage.text, isInitial: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Infos de base visiteur non connecté
    const [visitor, setVisitor] = useState({
        name: '',
        email: ''
    });

    // Gestion du scroll pour positionner le chatbot
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.pageYOffset);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll automatique vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Mettre à jour le message initial quand la langue change
    useEffect(() => {
        if (messages.length === 1 && messages[0].isInitial) {
            setMessages([{ from: 'bot', text: t('chatbot.initialMessage'), isInitial: true }]);
        }
    }, [i18n.language, t]);

    // Focus sur l'input quand le chat s'ouvre
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
        setIsMinimized(false);
    };

    const handleMinimize = () => {
        setIsMinimized((prev) => !prev);
    };

    const appendMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };

    const handleTopicClick = async (topic) => {
        // Message traduit selon la langue
        const topicMessage = i18n.language === 'en'
            ? `I want to know more about ${topic.label.toLowerCase()}`
            : `Je veux en savoir plus sur ${topic.label.toLowerCase()}`;
        setInput(topicMessage);
        await handleSendMessage(topicMessage);
    };

    const handleSendMessage = async (messageText) => {
        const trimmed = messageText || input.trim();
        if (!trimmed || loading) return;

        appendMessage({ from: 'user', text: trimmed });
        setInput('');
        setLoading(true);

        try {
            // Utiliser la langue actuelle de i18n
            const currentLang = i18n.language || 'fr';

            const payload = {
                message: trimmed,
                lang: currentLang,
                visitor:
                    visitor.name || visitor.email
                        ? {
                            name: visitor.name || undefined,
                            email: visitor.email || undefined
                        }
                        : undefined
            };

            const { data } = await publicApi.chatWithBot(payload);

            let botText = data?.reply || t('chatbot.notUnderstood');

            // Construire la réponse avec suggestions et liens
            const botMessage = {
                from: 'bot',
                text: botText,
                suggestions: data?.suggestions || [],
                quickLinks: data?.quickLinks || []
            };

            appendMessage(botMessage);
        } catch (e) {
            console.error('[ChatWidget] Erreur lors de l\'appel chatbot', e);
            appendMessage({
                from: 'bot',
                text: t('chatbot.error')
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => {
        handleSendMessage();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickLinkClick = (link) => {
        if (link.path) {
            navigate(link.path);
            setIsOpen(false);
        }
    };

    const formatTime = () => {
        const now = new Date();
        const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
        return now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    };

    // Position du bouton selon le scroll
    // Par défaut: même position que BackToTop (sm:bottom-10 bottom-24)
    // Quand scroll > 0: remonte pour laisser la place au BackToTop qui apparaît
    const buttonBottom = scrollY > 0
        ? 'sm:bottom-24 bottom-40'  // Remonte quand scrollTop apparaît
        : 'sm:bottom-8 bottom-24';  // Position par défaut (même que BackToTop)

    return (
        <>
            {/* Bouton flottant circulaire - même style que BackToTop */}
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={handleToggle}
                    className={`fixed ${buttonBottom} right-3 z-50 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-200`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={t('chatbot.openChat')}
                >
                    <MessageCircle className="w-6 h-6" />
                </motion.button>
            )}

            {/* Fenêtre de chat */}
            {isOpen && (
                <div
                    className={`fixed ${buttonBottom} right-3 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-t-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px] max-h-[calc(100vh-8rem)]'
                        }`}
                >
                    {/* En-tête vert */}
                    <div className="px-4 py-3 bg-primary-500 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Icône de bulle */}
                            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate">{t('chatbot.assistantName')}</div>
                                <div className="text-xs text-white/90 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                                    {t('chatbot.online')} • {t('chatbot.instantResponse')}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                            {/* Bouton minimiser */}
                            <button
                                type="button"
                                onClick={handleMinimize}
                                className="text-white/80 hover:text-white transition-colors p-1"
                                aria-label={isMinimized ? t('chatbot.maximize') : t('chatbot.minimize')}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMinimized ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                                        />
                                    )}
                                </svg>
                            </button>
                            {/* Bouton fermer */}
                            <button
                                type="button"
                                onClick={handleToggle}
                                className="text-white/80 hover:text-white transition-colors p-1"
                                aria-label={t('chatbot.close')}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Zone messages */}
                            <div className="flex-1 px-4 py-4 overflow-y-auto space-y-3 bg-gray-50">
                                {messages.map((m, idx) => (
                                    <div key={idx}>
                                        {m.from === 'bot' && m.isInitial ? (
                                            // Message initial avec sujets
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-2">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                        <svg
                                                            className="w-5 h-5 text-primary-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                                                            <p className="text-sm text-gray-800">{m.text}</p>
                                                            {initialMessage.topics && (
                                                                <div className="mt-2 space-y-1">
                                                                    <p className="text-xs text-gray-600 font-medium">
                                                                        {t('chatbot.questionsAbout')}
                                                                    </p>
                                                                    <ul className="text-xs text-gray-700 space-y-0.5 ml-2">
                                                                        {initialMessage.topics.map((topic, i) => (
                                                                            <li key={i}>• {topic}</li>
                                                                        ))}
                                                                    </ul>
                                                                    <p className="text-xs text-gray-500 mt-2 italic">
                                                                        {initialMessage.suggestion}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1 ml-11">
                                                            {formatTime()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Sujets populaires */}
                                                <div className="ml-11">
                                                    <p className="text-xs font-semibold text-gray-600 mb-2">
                                                        {t('chatbot.popularTopics')}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {popularTopics.map((topic) => (
                                                            <button
                                                                key={topic.id}
                                                                onClick={() => handleTopicClick(topic)}
                                                                className="flex items-center gap-2 bg-white hover:bg-primary-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors"
                                                            >
                                                                <span className="text-base">{topic.icon}</span>
                                                                <span>{topic.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Messages normaux
                                            <div
                                                className={`flex items-start gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''
                                                    }`}
                                            >
                                                {m.from === 'bot' && (
                                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                        <svg
                                                            className="w-5 h-5 text-primary-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className={`flex-1 ${m.from === 'user' ? 'flex flex-col items-end' : ''}`}>
                                                    <div
                                                        className={`rounded-lg px-3 py-2 shadow-sm max-w-[85%] ${m.from === 'user'
                                                            ? 'bg-primary-500 text-white'
                                                            : 'bg-white text-gray-800'
                                                            }`}
                                                    >
                                                        <p className="text-sm whitespace-pre-line">{m.text}</p>
                                                    </div>
                                                    {m.suggestions && m.suggestions.length > 0 && (
                                                        <div className="mt-2 space-y-1">
                                                            {m.suggestions.map((suggestion, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => handleSendMessage(suggestion)}
                                                                    className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
                                                                >
                                                                    💡 {suggestion}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {m.quickLinks && m.quickLinks.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {m.quickLinks.map((link, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => handleQuickLinkClick(link)}
                                                                    className="text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 px-2 py-1 rounded border border-primary-200 transition-colors"
                                                                >
                                                                    🔗 {link.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatTime()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex items-start gap-2">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 text-primary-600 animate-pulse"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                                            <p className="text-xs text-gray-500 italic">
                                                {t('chatbot.typing')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Zone de saisie */}
                            <div className="border-t border-gray-200 px-4 py-3 bg-white">
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder={t('chatbot.placeholder')}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={loading || !input.trim()}
                                        className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label={t('chatbot.send')}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatWidget;
