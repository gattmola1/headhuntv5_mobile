
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Send, MessageCircle, List, Calendar, MapPin, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { ROUTES } from '../config/routes';

// FAQ Data
const faqs = [
    {
        question: "What exactly is this platform?",
        answer: "Think of us as a private country club for your career. We're a curated network for elite builders, operators, and leaders. We backchannel exclusive roles, curate high-signal events, and pay out residuals for brilliant introductions.",
        keywords: ["platform", "what is", "about", "purpose", "exactly"],
        link: ROUTES.EXPLORE
    },
    {
        question: "What kind of events are available?",
        answer: "A bit of everything for the ambitious. Technical deep-dives, founder mixers, community socials, and charity drives. Check the Events page to RSVP—and definitely jump into our Discord to see who else is going.",
        keywords: ["events", "what events", "event types", "upcoming", "schedule", "discord"],
        link: ROUTES.EVENTS
    },
    {
        question: "How much is this going to cost me?",
        answer: "Zero. Nada. Zilch. It's completely free for candidates and network partners. We keep the lights on through executive placement commissions paid by employers when they find their next star.",
        keywords: ["free", "cost", "price", "candidates", "pay", "money", "expensive"]
    },
    {
        question: "Wait, so you're not a normal job board?",
        answer: "Exactly. Job boards are where resumes go to gather digital dust. We partner directly with hiring managers to place top-tier talent quickly and quietly. No black holes here.",
        keywords: ["job board", "normal", "different", "resume", "black hole", "why"]
    },
    {
        question: "Alright, how do I actually apply for a role?",
        answer: "Easy. Head over to the Jobs page. If you see a role with your name on it, hit 'Quick Apply' and drop your resume. If it's a mutual fit, we'll fast-track you directly to the decision-makers.",
        keywords: ["apply", "job", "application", "resume", "how to", "process"],
        link: ROUTES.JOBS
    },
    {
        question: "What's this about earning passive income?",
        answer: "That’s our Network Partner program. If you know high-performers looking to move, or hiring managers looking to build, suggest them via the Network page. If your intro leads to a placement or contract, we cut you a check. It pays to have friends.",
        keywords: ["passive income", "earn", "money", "refer", "referrals", "network", "commission", "friend", "how much can i make from referrals"],
        link: ROUTES.NETWORK
    },
    {
        question: "I'm hiring right now. Can you help me find someone?",
        answer: "Absolutely. We pride ourselves on moving fast. We can sign a straightforward Consulting Services Agreement (CSA) today and start routing our all-star network to your open reqs immediately. Let's build your team.",
        keywords: ["employer", "hiring", "company", "business", "partner", "csa", "help"],
        link: ROUTES.NETWORK
    },
    {
        question: "Tell me more about this Discord community.",
        answer: "It's the inner circle. It's where the real magic happens—spontaneous project collaborations, interview prep, real-time event updates, and general high-signal networking. You should probably be in there.",
        keywords: ["discord", "community", "chat", "inner circle", "group"]
    },
    {
        question: "What if I just want to browse a normal website?",
        answer: "Fair enough! We know chatbots aren't for everyone. Our Explore page gives you the beautifully-designed highlight reel of what we do. But trust us, the good stuff happens on the inside.",
        keywords: ["normal website", "normal site", "explore", "regular", "overview", "website instead", "useless", "terrible", "awful", "horrible", "worst", "bad bot", "hate this", "hate you", "you suck", "this sucks", "broken", "doesn't work", "doesn't understand", "stop", "give up", "forget it", "nevermind", "whatever", "stupid", "dumb", "not helpful", "unhelpful", "what do I do", "show me a normal website instead"],
        link: ROUTES.EXPLORE
    },
    {
        question: "Are you some sort of AI career coach?",
        answer: "Think of me more like your highly-connected, slightly-robotic talent router. I can point you to the right roles and upcoming events, but for real mentorship and coaching, you'll want to connect with the human operators in our Discord.",
        keywords: ["career coach", "coach", "coaching", "mentor", "mentoring", "advisor", "guidance", "help me", "what are you", "who are you", "what do you do", "are you ai", "are you a bot", "are you human"]
    }
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

const ChatbotInterface = ({ queryLogRef }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { isBot: true, text: "🤖 Hi! I can answer questions about our network, point you to some upcoming events you might like, and check if you're a perfect fit for any roles." }
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
                    text: "Okay, I'm completely lost. I'm going to send you over to our Explore page where things are a bit more reliable. Give me just a second...",
                }]);
                consecutiveErrors.current = 0;

                // Route them to Explore after a brief reading delay
                setTimeout(() => {
                    navigate(ROUTES.EXPLORE);
                }, 3000);
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

                queryLogRef.current.push({
                    query_text: query,
                    intent,
                    matched: matches.length > 0,
                    response: matches.length > 0 ? `Here are ${matches.length} event${matches.length > 1 ? 's' : ''} that might interest you:` : `I couldn't find events matching that — browse the full Events page to see everything coming up! If this seems wrong, please alert our devs on Discord.`
                });

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

                queryLogRef.current.push({
                    query_text: query,
                    intent,
                    matched: matches.length > 0,
                    response: matches.length > 0 ? `Here are ${matches.length} role${matches.length > 1 ? 's' : ''} that could be a fit:` : `No open roles match that right now — check the Jobs page for the latest listings. If this seems wrong, give our devs a shout on Discord!`
                });

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

            queryLogRef.current.push({
                query_text: query,
                intent,
                matched: !!match,
                response: match ? match.answer : "Honestly, I'm not sure what you mean!"
            });

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
        "I'm looking for a job in sales.",
        "Show me a list of upcoming local events",
        "What is this platform?",
        "How much can I make from referrals?",
        "Are you some sort of career coach?",
        "Show me a normal website instead.",
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
                    <p className="text-xs text-gray-500 mb-2 font-medium">Popular prompts:</p>
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
    const queryLogRef = useRef([]);

    const sendLogs = () => {
        if (queryLogRef.current.length > 0) {
            fetch(`${API_URL}/api/queries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queryLogRef.current),
                keepalive: true
            }).catch(() => { });
            queryLogRef.current = [];
        }
    };

    useEffect(() => {
        window.addEventListener('beforeunload', sendLogs);
        const scrollY = window.scrollY;
        window.scrollTo(0, scrollY);

        return () => {
            window.removeEventListener('beforeunload', sendLogs);
            sendLogs(); // Flush when navigating away from About
        };
    }, []);

    const handleTabSwitch = (tab) => {
        if (tab === 'faq' && activeTab === 'chat') {
            sendLogs();
        }
        setActiveTab(tab);
    };

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
                            <ChatbotInterface queryLogRef={queryLogRef} />
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
                        onClick={() => handleTabSwitch('chat')}
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
                        onClick={() => handleTabSwitch('faq')}
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
