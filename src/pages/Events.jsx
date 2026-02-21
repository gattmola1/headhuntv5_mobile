import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, LayoutList, CalendarDays, ChevronLeft, ChevronRight, X, Clock, SlidersHorizontal, MessageSquare, Check, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { API_URL } from '../config/api';
import CardSwapSection from '../components/sections/CardSwapSection';
import PageLoader from '../components/layout/PageLoader';

const CATEGORIES = ['Arts', 'Business', 'Charity', 'Community', 'Gov', 'Social', 'Tech'];

const Events = () => {
    const [view, setView] = useState('month'); // Default to 'month'
    const [sortBy, setSortBy] = useState('featured'); // 'featured' or 'chronological'
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (events.length > 0) {
            const idToOpen = searchParams.get('id');
            if (idToOpen) {
                const eventToOpen = events.find(e => e.id.toString() === idToOpen);
                if (eventToOpen) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setSelectedEvent(eventToOpen);
                }
            }
        }
    }, [events, searchParams]);

    // Removed duplicate state declaration

    // Fetch events from API
    useEffect(() => {
        fetch(`${API_URL}/api/events`)
            .then(res => res.json())
            .then(data => {
                const now = new Date();
                // Normalize and filter out past events
                const normalized = (data.events || [])
                    .map(e => ({
                        ...e,
                        date: new Date(e.date),
                        dateString: new Date(e.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        image: e.image_url,
                        attendees: e.attendees_count,
                        isFeatured: e.is_featured,
                        time: e.time_string,
                    }))
                    .filter(e => e.date >= now);
                setEvents(normalized);
                setEventsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch events', err);
                setEventsLoading(false);
            });
    }, []);

    // Intro animation for filters
    useEffect(() => {
        const sequence = async () => {
            await new Promise(r => setTimeout(r, 800));
            setSelectedFilters(prev => [...prev, 'Tech']);
            await new Promise(r => setTimeout(r, 400));
            setSelectedFilters(prev => [...prev, 'Business']);
            await new Promise(r => setTimeout(r, 400));
            setSelectedFilters(prev => [...prev, 'Social']);
        };
        sequence();
    }, []);

    const toggleFilter = (category) => {
        setSelectedFilters(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };



    const filteredEvents = useMemo(() => {
        if (selectedFilters.length === 0) return events;
        return events.filter(e => selectedFilters.includes(e.category));
    }, [selectedFilters, events]);

    const sortedEvents = useMemo(() => {
        if (sortBy === 'chronological') {
            return [...filteredEvents].sort((a, b) => a.date - b.date);
        }
        // Default to featured first, then chronological
        return [...filteredEvents].sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return a.date - b.date;
        });
    }, [sortBy, filteredEvents]);

    const featuredEvents = useMemo(() => filteredEvents.filter(e => e.isFeatured), [filteredEvents]);

    const EventDetailModal = ({ event, onClose }) => {
        const [copied, setCopied] = useState(false);

        if (!event) return null;

        const handleCopyLink = () => {
            const url = `${window.location.origin}/events?id=${event.id}`;
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        };

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-zinc-900 border border-white/10 rounded-3xl max-w-2xl w-full overflow-hidden relative shadow-2xl"
                >
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        <button
                            onClick={handleCopyLink}
                            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/50 hover:text-white transition-all flex items-center justify-center"
                            title="Copy direct link"
                        >
                            {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <LinkIcon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/50 hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="h-64 relative">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${event.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                event.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                    event.color === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                }`}>
                                {event.category}
                            </span>
                            <h2 className="text-3xl font-bold mt-2">{event.title}</h2>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <span className="text-sm">{event.dateString}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <span className="text-sm">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-blue-400" />
                                <span className="text-sm">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                <span className="text-sm">{event.attendees} Attending</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-white text-lg">About this Event</h4>
                            <p className="text-gray-400 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => {
                                    // RSVP logic could go here or link to an external sign up
                                    window.open(discordLink || "https://discord.gg/NwQH763Gp", "_blank");
                                }}
                                className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                RSVP Now <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    const FeaturedSection = ({ title, events }) => (
        <section className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                </div>
                {view === 'list' && (
                    <div className="flex bg-zinc-900 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setSortBy('featured')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sortBy === 'featured' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Featured
                        </button>
                        <button
                            onClick={() => setSortBy('chronological')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sortBy === 'chronological' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Soonest
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-gray-500 font-bold text-lg">No events found for selected filters.</p>
                        <button onClick={() => setSelectedFilters([])} className="mt-4 text-blue-400 hover:text-blue-300 font-bold text-sm">Clear Filters</button>
                    </div>
                ) : (
                    events.map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => {
                                setSelectedEvent(event);
                                setSearchParams({ id: event.id });
                            }}
                            className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-white/20 transition-all p-4 lg:p-6 cursor-pointer"
                        >
                            <div className="lg:col-span-4 h-[240px] rounded-2xl overflow-hidden border border-white/5">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>

                            <div className="lg:col-span-8 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    {event.isFeatured && (
                                        <span className="px-2 py-0.5 rounded bg-blue-500 text-[8px] font-black uppercase tracking-widest text-white">Featured</span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${event.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        event.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            event.color === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                        {event.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{event.dateString}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors leading-tight">{event.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?u=${event.id}${i}`} alt="user" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{event.attendees} Registered</span>
                                    </div>
                                    <button className="text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-blue-300 transition-colors">
                                        RSVP NOW <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )))}
            </div>
        </section>
    );

    const MonthView = () => {
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blankDays = Array.from({ length: startDay }, (_, i) => i);

        const monthName = currentMonth.toLocaleString('default', { month: 'long' });
        const year = currentMonth.getFullYear();

        const getEventsForDay = (day) => {
            return filteredEvents.filter(e =>
                e.date.getDate() === day &&
                e.date.getMonth() === currentMonth.getMonth() &&
                e.date.getFullYear() === currentMonth.getFullYear()
            );
        };

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-16"
            >
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">{monthName} {year}</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                className="p-2 hover:bg-white/5 rounded-full border border-white/10 transition-colors"
                            >
                                <ChevronLeft />
                            </button>
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                className="p-2 hover:bg-white/5 rounded-full border border-white/10 transition-colors"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                            <div key={day} className="bg-zinc-900/80 p-4 text-center text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                {day}
                            </div>
                        ))}
                        {blankDays.map(i => (
                            <div key={`blank-${i}`} className="bg-zinc-900/30 min-h-[160px] p-4"></div>
                        ))}
                        {days.map(day => {
                            const dayEvents = getEventsForDay(day);
                            const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === 2026;

                            return (
                                <div key={day} className="bg-zinc-900/50 min-h-[160px] p-4 border-t border-white/5 hover:bg-white/[0.02] transition-colors relative group">
                                    <span className={`text-sm font-medium ${isToday ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>
                                        {day}
                                    </span>
                                    <div className="mt-2 space-y-1.5">
                                        {dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setSearchParams({ id: event.id });
                                                }}
                                                className={`p-2 rounded-lg text-[10px] font-bold border cursor-pointer hover:scale-[1.02] transition-all line-clamp-2 ${event.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    event.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                    }`}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </motion.div>
        );
    };

    if (eventsLoading) return <PageLoader />;

    return (
        <div className="space-y-12">
            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailModal
                        event={selectedEvent}
                        onClose={() => {
                            setSelectedEvent(null);
                            setSearchParams({});
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden rounded-3xl bg-zinc-900 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 px-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black tracking-[0.2em] uppercase border border-blue-500/20"
                    >
                        Community Events
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter"
                    >
                        Connect, Learn, and <span className="text-blue-500">Grow.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Join our exclusive events designed to bridge the gap between world-class talent and high-growth opportunities.
                    </motion.p>
                </div>
            </section>

            {/* Filters Bar (Sticky) */}
            <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl p-4 -mx-4 border-y border-white/5">
                <div className="flex flex-col items-center justify-center gap-6 max-w-7xl mx-auto w-full">
                    {/* Filter Chips */}
                    <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                        {CATEGORIES.map((category) => {
                            const isSelected = selectedFilters.includes(category);
                            return (
                                <motion.button
                                    key={category}
                                    onClick={() => toggleFilter(category)}
                                    layout
                                    whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border
                                        ${isSelected
                                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                                        }
                                    `}
                                >
                                    {isSelected
                                        ? <Check size={14} className="text-black" />
                                        : <X size={14} className="text-gray-500" />
                                    }
                                    {category}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Featured Events Section */}
            <FeaturedSection
                title="Suggested for you:"
                events={featuredEvents}
            />

            {/* Scroll-Driven Card Swap Animation */}
            <CardSwapSection />

            {/* View Switcher & Calendar/List Content */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">All Events</h2>
                    {/* View Switcher */}
                    <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-white/10 shrink-0">
                        <button
                            onClick={() => setView('month')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'month'
                                ? 'bg-white text-black shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <CalendarDays size={14} />
                            Month
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'list'
                                ? 'bg-white text-black shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <LayoutList size={14} />
                            List
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'month' ? (
                        <MonthView key="month" />
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 gap-8">
                                {sortedEvents.map((event, idx) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setSearchParams({ id: event.id });
                                        }}
                                        className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-white/20 transition-all p-4 lg:p-6 cursor-pointer"
                                    >
                                        <div className="lg:col-span-4 h-[240px] rounded-2xl overflow-hidden border border-white/5">
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>

                                        <div className="lg:col-span-8 space-y-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                {event.isFeatured && (
                                                    <span className="px-2 py-0.5 rounded bg-blue-500 text-[8px] font-black uppercase tracking-widest text-white">Featured</span>
                                                )}
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${event.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    event.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        event.color === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                    }`}>
                                                    {event.category}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{event.dateString}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors leading-tight">{event.title}</h3>
                                                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 overflow-hidden">
                                                                <img src={`https://i.pravatar.cc/100?u=${event.id}${i}`} alt="user" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{event.attendees} Registered</span>
                                                </div>
                                                <button className="text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-blue-300 transition-colors">
                                                    RSVP NOW <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Discord Community CTA */}
            <section className="bg-gradient-to-br from-[#5865F2]/20 to-black border border-[#5865F2]/20 rounded-3xl p-12 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865F2]/10 blur-[100px] rounded-full group-hover:bg-[#5865F2]/20 transition-all duration-700"></div>
                <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                    <div className="w-20 h-20 bg-[#5865F2]/20 text-[#5865F2] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-[#5865F2]/10">
                        <MessageSquare size={40} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">Meet who's going</h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
                            Join our Discord to get real-time updates on events, chat with other attendees ahead of time and afterwards, and browse some of our handpicked resources and event dossiers.
                        </p>
                    </div>
                    <div className="pt-4">
                        <a
                            href="https://discord.gg/NwQH763Gp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black transition-all text-xl shadow-2xl shadow-[#5865F2]/20 active:scale-95"
                        >
                            Join our Discord <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Events;
