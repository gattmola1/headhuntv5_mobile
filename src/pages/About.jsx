
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Send, MessageCircle, List, Calendar, MapPin, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { ROUTES } from '../config/routes';

// FAQ Data
const faqs = [
    {
        question: "What is this platform?",
        answer: "This is a high-performance recruitment platform designed to connect top talent with leading companies. We focus on speed, transparency, and quality.",
        keywords: ["platform", "what is", "about", "purpose"]
    },
    {
        question: "How do I apply for a job?",
        answer: "Simply browse the available positions on the Jobs page, click 'Quick Apply', and fill out the application form. You'll need to upload your resume in PDF format.",
        keywords: ["apply", "job", "application", "resume", "how to"]
    },
    {
        question: "Is it free for candidates?",
        answer: "Yes, our platform is completely free for job seekers. We believe in removing barriers to career growth.",
        keywords: ["free", "cost", "price", "candidates", "job seekers"]
    },
    {
        question: "How does the 'Match' incubator work?",
        answer: "Match is designed to bridge the gap between underemployed talent, business hobbyists, and entrepreneurs. By sharing project ideas and committing weekly hours, these diverse groups come together in a decentralized incubator environment. It's about turning 'what if' into 'what's next' through collaborative execution.",
        keywords: ["match", "incubator", "entrepreneur", "project", "collaboration"]
    },
    {
        question: "I'm an employer—how can I work with you?",
        answer: "We're happy to move quickly. We can sign a CSA (Consulting Services Agreement) and start advertising your positions to our all-star network of obsessive builders and leaders immediately.",
        keywords: ["employer", "hiring", "company", "business", "partner", "csa"]
    },
    {
        question: "How is the job placement page funded?",
        answer: "The platform is powered by network momentum. While it's free for candidates, the ecosystem is funded through executive placement commissions paid by employers when they find their next critical hire through our network.",
        keywords: ["funded", "money", "business model", "revenue", "commission"]
    },
    {
        question: "How can I contact support?",
        answer: "You can reach out to us via our Discord community or email us at support@example.com.",
        keywords: ["contact", "support", "help", "email", "discord"]
    },
    {
        question: "What kind of events do you run?",
        answer: "We host Tech career fairs, business webinars, networking mixers, community socials, charity drives, and more. Ask me to 'show me events' or type a category like 'tech events' to see what's coming up!",
        keywords: ["events", "what events", "event types", "upcoming", "schedule"]
    },
    {
        question: "Do you have any open jobs right now?",
        answer: "Yes! We regularly post exclusive roles that aren't listed publicly elsewhere. Ask me to 'show me jobs' or mention a role like 'engineering jobs' to see current openings.",
        keywords: ["jobs", "open roles", "positions", "hiring", "openings", "vacancies"]
    },
    {
        question: "Can I RSVP to events through the platform?",
        answer: "Absolutely. Browse our Events page to see upcoming events and RSVP directly. You'll also find featured events and a calendar view to plan ahead.",
        keywords: ["rsvp", "register", "sign up", "event", "attend", "join"]
    },
    {
        question: "What types of roles are available?",
        answer: "We post a range of roles — from engineering and product to operations and leadership. Our hiring partners move fast and prefer candidates who are ready to step in. Ask me to 'show me jobs' to see current listings.",
        keywords: ["role", "position", "type", "engineering", "product", "operations", "leadership", "what jobs"]
    },
    {
        question: "How do I refer someone to the network?",
        answer: "Head to the Referral page via the nav bar. You can earn passive income by referring qualified candidates who successfully place through our network.",
        keywords: ["refer", "referral", "earn", "passive income", "network", "commission", "friend"],
        link: ROUTES.NETWORK
    },
];

// ─── Fuzzy Matching Utilities ─────────────────────────────────────────────────

const editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};

const similarity = (s1, s2) => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
};

const scoreItem = (query, fields, keywords) => {
    const lq = query.toLowerCase();
    const keywordScore = keywords
        ? keywords.filter(k => lq.includes(k.toLowerCase())).length / keywords.length
        : 0;
    const fieldScores = fields.map(f => similarity(lq, (f || '').toLowerCase()));
    const maxField = Math.max(...fieldScores);
    return (keywordScore * 0.5) + (maxField * 0.5);
};

// ─── Intent Detection ─────────────────────────────────────────────────────────

const EVENT_KEYWORDS = ['event', 'events', 'upcoming', 'rsvp', 'networking', 'mixer', 'summit', 'gala', 'webinar', 'expo', 'career fair', 'meetup', 'briefing', 'tech event', 'business event', 'social event', 'show me events', 'what events'];
const JOB_KEYWORDS = ['job', 'jobs', 'role', 'roles', 'position', 'positions', 'hiring', 'work', 'opening', 'vacancy', 'apply', 'engineer', 'engineering', 'developer', 'manager', 'show me jobs', 'any jobs', 'open jobs'];

const detectIntent = (query) => {
    const lq = query.toLowerCase();
    const eventScore = EVENT_KEYWORDS.filter(k => lq.includes(k)).length;
    const jobScore = JOB_KEYWORDS.filter(k => lq.includes(k)).length;
    if (eventScore === 0 && jobScore === 0) return 'faq';
    if (eventScore >= jobScore) return 'events';
    return 'jobs';
};

// ─── Inline Card Components ───────────────────────────────────────────────────

const EventMiniCard = ({ event }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`${ROUTES.EVENTS}?id=${event.id}`)}
            className="flex gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
        >
            {event.image && (
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-white/10"
                />
            )}
            <div className="min-w-0">
                <p className="font-bold text-white text-sm leading-tight line-clamp-1">{event.title}</p>
                <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{event.dateString || event.date_string || 'TBD'}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-xs">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{event.location || 'TBD'}</span>
                </div>
                {event.category && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {event.category}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

const JobMiniCard = ({ job }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`${ROUTES.JOBS}?id=${job.id}`)}
            className="flex flex-col gap-1 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
        >
            <p className="font-bold text-white text-sm leading-tight line-clamp-1">{job.title}</p>
            {job.description && (
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{job.description}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
                {job.location && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                    </div>
                )}
                {job.salary && (
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                        <DollarSign className="w-3 h-3" />
                        <span>{Number(job.salary).toLocaleString()}/yr</span>
                    </div>
                )}
            </div>
            <span className="self-start mt-1 text-blue-400 text-xs font-bold flex items-center gap-1">
                Quick Apply <ArrowRight className="w-3 h-3" />
            </span>
        </motion.div>
    );
};

// ─── Chat Components ──────────────────────────────────────────────────────────

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3 bg-white/5 rounded-2xl w-fit">
        <motion.div className="w-2 h-2 bg-blue-400 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
        <motion.div className="w-2 h-2 bg-blue-400 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
        <motion.div className="w-2 h-2 bg-blue-400 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
    </div>
);

const MessageBubble = ({ message }) => {
    const { isBot, text, cards, cardType, link, ctaProps } = message;

    if (cards && cards.length > 0) {
        console.log('[Chatbot] Rendering cards:', cardType, cards);
        return (
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
            >
                <div className="max-w-[90%] space-y-2">
                    {text && (
                        <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 text-sm">
                            {text}
                        </div>
                    )}
                    <div className="space-y-2">
                        {cardType === 'event'
                            ? cards.map((e, i) => <EventMiniCard key={i} event={e} />)
                            : cards.map((j, i) => <JobMiniCard key={i} job={j} />)
                        }
                    </div>
                    <Link to={cardType === 'event' ? ROUTES.EVENTS : ROUTES.JOBS} className="block text-center text-xs text-blue-400 hover:text-blue-300 pt-1 font-bold">
                        See all →
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
        >
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm space-y-2 ${isBot
                ? 'bg-white/5 border border-white/10 text-gray-300'
                : 'bg-blue-500 text-white'
                }`}>
                <p style={{ whiteSpace: 'pre-line' }}>{text}</p>
                {link && !ctaProps && (
                    <Link
                        to={link}
                        className="inline-flex items-center gap-1 mt-1 text-blue-400 hover:text-blue-300 text-xs font-bold"
                    >
                        Visit page <ArrowRight className="w-3 h-3" />
                    </Link>
                )}
                {ctaProps && (
                    <div className="pt-2">
                        <a
                            href={ctaProps.href}
                            target={ctaProps.target || '_self'}
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                if (ctaProps.onClickRedirect) {
                                    window.open(ctaProps.href, '_blank', 'noopener,noreferrer');
                                    window.location.href = ctaProps.onClickRedirect;
                                    e.preventDefault();
                                }
                            }}
                            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-all text-sm"
                        >
                            {ctaProps.text}
                        </a>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const SuggestedQuestion = ({ question, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-blue-400/50 transition-all text-gray-300"
    >
        {question}
    </motion.button>
);

// ─── Chatbot Interface ────────────────────────────────────────────────────────

const ChatbotInterface = () => {
    const [messages, setMessages] = useState([
        { isBot: true, text: "👋 Hi! I can answer questions about our network, point you to some upcoming events you might like, and even help you check if any roles are a perfect fit for you. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const messagesEndRef = useRef(null);
    const consecutiveErrors = useRef(0);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const findBestFaqMatch = (query) => {
        const lq = query.toLowerCase();
        let best = null;
        let bestScore = 0;
        faqs.forEach(faq => {
            const score = scoreItem(query, [faq.question, faq.answer], faq.keywords);
            if (score > bestScore) { bestScore = score; best = faq; }
        });
        return bestScore > 0.25 ? best : null;
    };

    const fetchAndMatchEvents = async (query) => {
        const res = await fetch(`${API_URL}/api/events`);
        const data = await res.json();
        const events = (data.events || []).map(e => ({
            ...e,
            image: e.image_url,
            dateString: e.time_string ? e.date : new Date(e.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        }));

        // Strip generic event intent words — if nothing meaningful remains, it's a browse query
        const stripped = query.toLowerCase()
            .replace(/\b(show|me|any|upcoming|events?|event|there|are|got|you|have|a|an|the|is|do|what|some|see|find|all)\b/g, '')
            .trim();

        if (!stripped) {
            // Generic browse — return 2 featured first, then fallback to most recent
            const featured = events.filter(e => e.is_featured);
            return (featured.length >= 2 ? featured : events).slice(0, 2);
        }

        const scored = events
            .map(e => ({
                item: e,
                score: scoreItem(stripped, [e.title, e.description, e.category, e.type, e.location], [e.category, e.type])
            }))
            .filter(x => x.score > 0.05)
            .sort((a, b) => b.score - a.score);
        return scored.slice(0, 2).map(x => x.item);
    };

    const fetchAndMatchJobs = async (query) => {
        const res = await fetch(`${API_URL}/api/jobs`);
        const data = await res.json();
        const jobs = data.jobs || [];

        // Strip generic job intent words — if nothing meaningful remains, it's a browse query
        const stripped = query.toLowerCase()
            .replace(/\b(any|open|jobs?|roles?|positions?|show me|got|have|you|a|an|the|are|there|is|do|currently|right now|available)\b/g, '')
            .trim();

        if (!stripped) {
            // Generic browse — return the two most recent
            return jobs.slice(0, 2);
        }

        const scored = jobs
            .map(j => ({
                item: j,
                score: scoreItem(stripped, [j.title, j.description, j.location], null)
            }))
            .filter(x => x.score > 0.05)
            .sort((a, b) => b.score - a.score);
        return scored.slice(0, 2).map(x => x.item);
    };

    const handleSend = async (queryOverride) => {
        const query = (queryOverride ?? input).trim();
        if (!query) return;

        // Message limit logic
        if (messageCount >= 5) {
            return;
        }

        const newCount = messageCount + 1;
        setMessageCount(newCount);

        setMessages(prev => [...prev, { isBot: false, text: query }]);
        setInput('');
        setIsTyping(true);

        // If this was the 5th message, return result but also append the limit message
        const handleLimitReached = () => {
            if (newCount >= 5) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        isBot: true,
                        text: "You've reached the demo limit! To continue chatting, networking, and finding roles, please join our Discord community.",
                        ctaProps: {
                            text: 'Join Discord',
                            href: 'https://discord.gg/NwQH763Gp',
                            onClickRedirect: ROUTES.EXPLORE
                        }
                    }]);
                }, 1000);
            }
        };

        // Declare intent outside try so it's accessible in catch
        let intent = 'faq';

        const dispatchError = (defaultMsgObj) => {
            consecutiveErrors.current += 1;
            if (consecutiveErrors.current >= 2) {
                setMessages(prev => [...prev, {
                    isBot: true,
                    text: "Okay, either my internet is being shit right now or I'm completely lost. We are a high-performance recruitment platform designed to connect top talent with leading companies. Check out the explore page to see everything we do.",
                    link: ROUTES.EXPLORE
                }]);
                consecutiveErrors.current = 0;
            } else {
                setMessages(prev => [...prev, defaultMsgObj]);
            }
        };

        const dispatchSuccess = (successMsgObj) => {
            consecutiveErrors.current = 0;
            setMessages(prev => [...prev, successMsgObj]);
        };

        try {
            intent = detectIntent(query);

            if (intent === 'events') {
                const matches = await fetchAndMatchEvents(query);

                fetch(`${API_URL}/api/queries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query_text: query, intent, matched: matches.length > 0 })
                }).catch(() => { });

                setIsTyping(false);
                if (matches.length === 0) {
                    dispatchError({ isBot: true, text: `I couldn't find events matching that — browse the full Events page to see everything coming up! If this seems wrong, please alert our devs on Discord.`, link: ROUTES.EVENTS });
                } else {
                    dispatchSuccess({ isBot: true, text: `Here are ${matches.length} event${matches.length > 1 ? 's' : ''} that might interest you:`, cards: matches, cardType: 'event' });
                }
                handleLimitReached();
                return;
            }

            if (intent === 'jobs') {
                const matches = await fetchAndMatchJobs(query);

                fetch(`${API_URL}/api/queries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query_text: query, intent, matched: matches.length > 0 })
                }).catch(() => { });

                setIsTyping(false);
                if (matches.length === 0) {
                    dispatchError({ isBot: true, text: `No open roles match that right now — check the Jobs page for the latest listings. If this seems wrong, give our devs a shout on Discord!`, link: ROUTES.JOBS });
                } else {
                    dispatchSuccess({ isBot: true, text: `Here are ${matches.length} role${matches.length > 1 ? 's' : ''} that could be a fit:`, cards: matches, cardType: 'job' });
                }
                handleLimitReached();
                return;
            }

            // FAQ fallback
            const match = findBestFaqMatch(query);

            fetch(`${API_URL}/api/queries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query_text: query, intent, matched: !!match })
            }).catch(() => { });

            setTimeout(() => {
                setIsTyping(false);
                if (match) {
                    dispatchSuccess({ isBot: true, text: match.answer, link: match.link });
                } else {
                    dispatchError({
                        isBot: true,
                        text: "Honestly, I'm not sure what you mean! I've logged it for my admins to follow up on.\n\nRunning smarter models here isn't cheap. If you like what you see, consider becoming a contributor."
                    });
                }
                handleLimitReached();
            }, 700);
        } catch (err) {
            console.error('Chatbot error:', err);
            setIsTyping(false);
            const destination = intent === 'jobs' ? ROUTES.JOBS : intent === 'events' ? ROUTES.EVENTS : ROUTES.ABOUT;
            dispatchError({
                isBot: true,
                text: `Something went wrong fetching that data — please alert our devs on Discord so we can fix it! In the meantime, try visiting the page directly.`,
                link: destination
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        "Are there any ___ jobs?",
        "Show me tech events",
        "What is this platform?",
        "How much do referrals pay?",
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} />
                ))}
                {isTyping && (
                    <div className="flex justify-start mb-4">
                        <TypingIndicator />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
                <div className="px-4 pb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, idx) => (
                            <SuggestedQuestion
                                key={idx}
                                question={q}
                                onClick={() => handleSend(q)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="border-t border-white/10 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={messageCount >= 5 ? "Demo limit reached." : "Ask me anything..."}
                        disabled={messageCount >= 5}
                        className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400/50 transition-colors ${messageCount >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <motion.button
                        whileHover={{ scale: messageCount >= 5 ? 1 : 1.05 }}
                        whileTap={{ scale: messageCount >= 5 ? 1 : 0.95 }}
                        onClick={() => handleSend()}
                        disabled={messageCount >= 5}
                        className={`bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5 py-3 transition-colors flex items-center gap-2 ${messageCount >= 5 ? 'opacity-50 cursor-not-allowed hover:bg-blue-500' : ''}`}
                    >
                        <Send className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

// ─── FAQ List Components ──────────────────────────────────────────────────────

const QAItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10 last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group hover:bg-white/5 px-4 transition-colors rounded-lg antialiased subpixel-antialiased transform-gpu"
                style={{ WebkitFontSmoothing: 'antialiased', transform: 'translateZ(0)' }}
            >
                <span
                    className="font-bold text-lg group-hover:text-blue-400 transition-colors antialiased subpixel-antialiased transform-gpu"
                    style={{ WebkitFontSmoothing: 'antialiased', transform: 'translateZ(0)' }}
                >
                    {question}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div
                            className="px-4 pb-6 text-gray-400 leading-relaxed text-sm antialiased subpixel-antialiased transform-gpu"
                            style={{ WebkitFontSmoothing: 'antialiased', transform: 'translateZ(0)' }}
                        >
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Main About Component ─────────────────────────────────────────────────────

const About = () => {
    const [activeTab, setActiveTab] = useState('chat');

    useEffect(() => {
        const scrollY = window.scrollY;
        window.scrollTo(0, scrollY);
    }, []);

    return (
        <div className="w-full h-screen fixed inset-0 flex flex-col">
            {/* Tab Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden z-10 shadow-2xl relative m-4 md:m-8 rounded-2xl flex flex-col"
            >
                <AnimatePresence mode="wait">
                    {activeTab === 'chat' ? (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full flex flex-col"
                        >
                            <ChatbotInterface />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="faq"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 md:p-8 overflow-y-auto antialiased subpixel-antialiased transform-gpu"
                            style={{ WebkitFontSmoothing: 'antialiased', transform: 'translateZ(0)' }}
                        >
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                                🏆 FAQ Leaderboard 🏆
                            </h2>
                            <div className="space-y-1">
                                {faqs.map((faq, index) => {
                                    const medals = ['🥇 ', '🥈 ', '🥉 '];
                                    const medal = index < 3 ? medals[index] : '';
                                    return (
                                        <QAItem key={index} question={`${medal}${faq.question}`} answer={faq.answer} />
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="z-10 p-4 pb-6"
            >
                <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 max-w-md mx-auto backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 font-medium antialiased subpixel-antialiased transform-gpu ${activeTab === 'chat'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        style={{ WebkitFontSmoothing: 'antialiased', transform: 'translateZ(0)' }}
                    >
                        <MessageCircle className="w-5 h-5" />
                        Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`flex-1 py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 font-medium antialiased subpixel-antialiased transform-gpu ${activeTab === 'faq'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        style={{ WebkitFontSmoothing: 'antialiased', transform: 'translateZ(0)' }}
                    >
                        <List className="w-5 h-5" />
                        FAQ 🏆
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
