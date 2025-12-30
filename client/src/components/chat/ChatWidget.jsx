import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../services/api';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useClientAuth } from '../../context/ClientAuthContext';

// Widget de chat inspiré du style Harvest avec la charte graphique vitalCHECK
// Forme circulaire comme BackToTop, même dimension

const ChatWidget = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user: clientUser } = useClientAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [visitorInfo, setVisitorInfo] = useState({
        name: '',
        email: ''
    });
    // Pour les utilisateurs connectés, on n'a pas besoin de collecter les infos
    // Pour les utilisateurs non connectés, on collectera le prénom puis l'email
    const [collectingInfo, setCollectingInfo] = useState({
        step: null, // 'name', 'email', or null (ready for message)
        askedName: false,
        askedEmail: false
    });
    const nameRequestSentRef = useRef(false);
    const wasOpenRef = useRef(false);

    // Messages initiaux avec traductions
    const getInitialMessage = () => {
        if (clientUser) {
            const userName = clientUser.firstName || clientUser.email?.split('@')[0] || 'Utilisateur';
            // Message personnalisé pour utilisateur connecté : "Parfait NOM! 👋 Je suis l'assistant de vitalCHECK. Comment puis-je vous aider ?"
            const isFrench = i18n.language === 'fr';
            const greeting = isFrench 
                ? `Parfait ${userName} ! 👋 Je suis l'assistant de vitalCHECK. Comment puis-je vous aider ?`
                : `Perfect ${userName}! 👋 I'm the vitalCHECK assistant. How can I help you?`;
            
            return {
                text: greeting,
                topics: [
                    t('chatbot.topics.evaluation'),
                    t('chatbot.topics.pricing'),
                    t('chatbot.topics.report'),
                    t('chatbot.topics.account')
                ],
                suggestion: t('chatbot.suggestion')
            };
        }
        // Pour les visiteurs non connectés, on utilisera welcomeMessage qui demande le prénom
        return {
            text: t('chatbot.welcomeMessage'),
            topics: [
                t('chatbot.topics.evaluation'),
                t('chatbot.topics.pricing'),
                t('chatbot.topics.report'),
                t('chatbot.topics.account')
            ],
            suggestion: t('chatbot.suggestion')
        };
    };

    const initialMessage = getInitialMessage();

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

    // Pour les utilisateurs non connectés, on commence par demander le nom
    // Pour les utilisateurs connectés, on affiche directement le message personnalisé avec les sujets
    const [messages, setMessages] = useState(() => {
        if (!clientUser) {
            return [{ from: 'bot', text: t('chatbot.welcomeMessage'), isWelcome: true }];
        }
        // Pour les utilisateurs connectés, inclure les topics et suggestion
        return [{ 
            from: 'bot', 
            text: initialMessage.text, 
            isInitial: true,
            topics: initialMessage.topics,
            suggestion: initialMessage.suggestion
        }];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

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

    // Mettre à jour le message initial quand la langue change ou l'utilisateur change (seulement pour utilisateurs connectés)
    useEffect(() => {
        if (clientUser && messages.length === 1 && messages[0].isInitial) {
            const newInitialMessage = getInitialMessage();
            setMessages([{ 
                from: 'bot', 
                text: newInitialMessage.text, 
                isInitial: true,
                topics: newInitialMessage.topics,
                suggestion: newInitialMessage.suggestion
            }]);
        }
    }, [i18n.language, t, clientUser]);

    // Réinitialiser l'état de collecte et les messages quand l'utilisateur se connecte
    // Pour les utilisateurs connectés, on n'a pas besoin de collecter le prénom/email
    // car on les a déjà dans clientUser
    useEffect(() => {
        if (clientUser) {
            // Marquer comme "déjà collecté" pour permettre l'envoi direct de messages
            setCollectingInfo({ step: null, askedName: true, askedEmail: true });
            setVisitorInfo({ name: '', email: '' });
            nameRequestSentRef.current = false;
            
            // Réinitialiser les messages avec le message personnalisé pour utilisateur connecté
            const newInitialMessage = getInitialMessage();
            setMessages([{ 
                from: 'bot', 
                text: newInitialMessage.text, 
                isInitial: true,
                topics: newInitialMessage.topics,
                suggestion: newInitialMessage.suggestion
            }]);
        }
    }, [clientUser]);

    // Réinitialiser le ref quand le chat se ferme
    useEffect(() => {
        if (!isOpen) {
            nameRequestSentRef.current = false;
        }
    }, [isOpen]);

    // Réinitialiser les messages quand le chat s'ouvre (seulement lors de la première ouverture)
    useEffect(() => {
        // Si le chat vient de s'ouvrir (était fermé, maintenant ouvert)
        if (isOpen && !wasOpenRef.current) {
            wasOpenRef.current = true;
            if (clientUser) {
                // Utilisateur connecté : afficher le message personnalisé avec les sujets
                const newInitialMessage = getInitialMessage();
                setMessages([{ 
                    from: 'bot', 
                    text: newInitialMessage.text, 
                    isInitial: true,
                    topics: newInitialMessage.topics,
                    suggestion: newInitialMessage.suggestion
                }]);
            } else {
                // Utilisateur non connecté : afficher le message de bienvenue qui demande le prénom
                setMessages([{ from: 'bot', text: t('chatbot.welcomeMessage'), isWelcome: true }]);
                setCollectingInfo({ step: 'name', askedName: false, askedEmail: false });
            }
        } else if (!isOpen) {
            // Quand le chat se ferme, réinitialiser le ref pour la prochaine ouverture
            wasOpenRef.current = false;
        }
    }, [isOpen, clientUser]);

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

        // Si l'utilisateur n'est pas connecté, collecter d'abord le nom puis l'email
        if (!clientUser) {
            // Étape 1: Demander le nom
            if (collectingInfo.step === 'name' || (messages.length === 1 && messages[0].isWelcome)) {
                if (trimmed.trim()) {
                    setVisitorInfo(prev => ({ ...prev, name: trimmed.trim() }));
                    appendMessage({ from: 'user', text: trimmed });
                    setInput('');
                    setCollectingInfo({ step: 'email', askedName: true, askedEmail: false });
                    
                    // Demander l'email (facultatif)
                    setTimeout(() => {
                        appendMessage({ 
                            from: 'bot', 
                            text: t('chatbot.emailRequest', { name: trimmed.trim() })
                        });
                    }, 500);
                }
                return;
            }
            
            // Étape 2: Demander l'email (facultatif)
            if (collectingInfo.step === 'email') {
                const lowerTrimmed = trimmed.toLowerCase().trim();
                if (lowerTrimmed === 'passer' || lowerTrimmed === 'skip' || lowerTrimmed === 'non' || lowerTrimmed === 'no' || lowerTrimmed === '') {
                    // L'utilisateur ne veut pas donner son email
                    appendMessage({ from: 'user', text: trimmed || 'Passer' });
                    setInput('');
                    setCollectingInfo({ step: null, askedName: true, askedEmail: true });
                    
                    // Afficher le message initial avec les sujets après la collecte
                    setTimeout(() => {
                        const newInitialMessage = getInitialMessage();
                        appendMessage({ 
                            from: 'bot', 
                            text: t('chatbot.readyMessage', { name: visitorInfo.name }),
                            isInitial: true,
                            topics: newInitialMessage.topics,
                            suggestion: newInitialMessage.suggestion
                        });
                    }, 500);
                    return;
                } else if (trimmed.includes('@') && trimmed.includes('.')) {
                    // C'est probablement un email
                    setVisitorInfo(prev => ({ ...prev, email: trimmed.trim() }));
                    appendMessage({ from: 'user', text: trimmed });
                    setInput('');
                    setCollectingInfo({ step: null, askedName: true, askedEmail: true });
                    
                    // Afficher le message initial avec les sujets après la collecte
                    setTimeout(() => {
                        const newInitialMessage = getInitialMessage();
                        appendMessage({ 
                            from: 'bot', 
                            text: t('chatbot.readyMessage', { name: visitorInfo.name }),
                            isInitial: true,
                            topics: newInitialMessage.topics,
                            suggestion: newInitialMessage.suggestion
                        });
                    }, 500);
                    return;
                } else {
                    // L'utilisateur a directement posé sa question, on considère qu'il passe l'email
                    setCollectingInfo({ step: null, askedName: true, askedEmail: true });
                    // Continuer avec l'envoi du message normal ci-dessous
                }
            }
            
            // Si on n'a pas encore collecté le nom, ne pas envoyer le message
            if (!collectingInfo.askedName) {
                return;
            }
        }

        // Envoyer le message normal
        appendMessage({ from: 'user', text: trimmed });
        setInput('');
        setLoading(true);

        try {
            // Utiliser la langue actuelle de i18n
            const currentLang = i18n.language || 'fr';

            const payload = {
                message: trimmed,
                lang: currentLang,
                userId: clientUser?._id || null,
                visitor: clientUser ? undefined : (
                    visitorInfo.name || visitorInfo.email
                        ? {
                            name: visitorInfo.name || undefined,
                            email: visitorInfo.email || undefined
                        }
                        : undefined
                )
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
                                        {m.from === 'bot' && (m.isInitial || m.isWelcome) ? (
                                            // Message initial ou de bienvenue avec sujets
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
                                                            {m.topics && (
                                                                <div className="mt-2 space-y-1">
                                                                    <p className="text-xs text-gray-600 font-medium">
                                                                        {t('chatbot.questionsAbout')}
                                                                    </p>
                                                                    <ul className="text-xs text-gray-700 space-y-0.5 ml-2">
                                                                        {m.topics.map((topic, i) => (
                                                                            <li key={i}>• {topic}</li>
                                                                        ))}
                                                                    </ul>
                                                                    <p className="text-xs text-gray-500 mt-2 italic">
                                                                        {m.suggestion}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1 ml-11">
                                                            {formatTime()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Sujets populaires - seulement si c'est le message initial (pas le welcome) */}
                                                {m.isInitial && (
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
                                                )}
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
                                {!clientUser && collectingInfo.step === 'name' && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        💬 {t('chatbot.askName')}
                                    </p>
                                )}
                                {!clientUser && collectingInfo.step === 'email' && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        💬 {t('chatbot.askEmail')}
                                    </p>
                                )}
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type={!clientUser && collectingInfo.step === 'email' ? 'email' : 'text'}
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder={
                                            !clientUser && collectingInfo.step === 'name' 
                                                ? t('chatbot.namePlaceholder')
                                                : !clientUser && collectingInfo.step === 'email'
                                                ? t('chatbot.emailPlaceholder')
                                                : t('chatbot.placeholder')
                                        }
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={loading}
                                    />
                                    {!clientUser && collectingInfo.step === 'email' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                appendMessage({ from: 'user', text: i18n.language === 'en' ? 'Skip' : 'Passer' });
                                                setInput('');
                                                setCollectingInfo({ step: null, askedName: true, askedEmail: true });
                                                
                                                // Afficher le message initial avec les sujets après avoir ignoré l'email
                                                setTimeout(() => {
                                                    const newInitialMessage = getInitialMessage();
                                                    appendMessage({ 
                                                        from: 'bot', 
                                                        text: t('chatbot.readyMessage', { name: visitorInfo.name }),
                                                        isInitial: true,
                                                        topics: newInitialMessage.topics,
                                                        suggestion: newInitialMessage.suggestion
                                                    });
                                                }, 500);
                                            }}
                                            className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                                        >
                                            {t('chatbot.ignore')}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={loading || (!input.trim() && (!clientUser && collectingInfo.step === 'name'))}
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
