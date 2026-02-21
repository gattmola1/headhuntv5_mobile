import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Clock, MapPin, DollarSign, Calendar } from 'lucide-react';
import { API_URL } from '../config/api';
import { ROUTES } from '../config/routes';
import CardSwapSection from '../components/sections/CardSwapSection';



const ScrollingBanner = ({ items, type, reverse = false, className = "py-10" }) => {
    const navigate = useNavigate();
    // Need at least a few items for a good scroll, duplicate if needed
    const displayItems = items.length > 0 ? [...items, ...items, ...items] : [];

    const handleCardClick = (item) => {
        if (type === 'job') {
            navigate(`${ROUTES.JOBS}?id=${item.id}`);
        } else if (type === 'event') {
            navigate(`${ROUTES.EVENTS}?id=${item.id}`);
        }
    };

    return (
        <div className={`w-full overflow-hidden relative group ${className}`}>
            <div
                className="flex gap-6 px-6 w-max animate-scroll group-hover:[animation-play-state:paused]"
                style={reverse ? { animationDirection: 'reverse' } : {}}
            >
                {displayItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleCardClick(item)}
                        className={`flex-shrink-0 w-[350px] p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all flex flex-col justify-between h-40 ${type === 'job' || type === 'event' ? 'cursor-pointer hover:border-blue-500/50' : ''}`}
                    >
                        {type === 'job' ? (
                            <>
                                <div>
                                    <h3 className="font-bold text-lg truncate mb-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500 font-mono tracking-widest">{item.company}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono">
                                        <MapPin className="w-3 h-3" /> {item.location || 'Remote'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-green-400 font-mono">
                                        <DollarSign className="w-3 h-3" /> ${item.salary?.toLocaleString()}
                                    </div>
                                </div>
                            </>
                        ) : type === 'event' ? (
                            <>
                                <div>
                                    <h3 className="font-bold text-lg truncate mb-1">{item.title}</h3>
                                    <p className="text-xs text-purple-400 font-mono tracking-widest uppercase">{item.category}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                        <Calendar className="w-3 h-3" /> {item.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono">
                                        <MapPin className="w-3 h-3" /> {item.location}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <h3 className="font-bold text-lg truncate mb-1">{item.title}</h3>
                                    <p className="text-xs text-blue-400 font-mono tracking-widest uppercase">{item.department}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] text-orange-400 font-mono">
                                        <Users className="w-3 h-3" /> {item.participants_count || 0}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono">
                                        <Clock className="w-3 h-3" /> {item.total_hours || 0} HRS
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Explore = () => {
    const [jobs, setJobs] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch Jobs
        fetch(`${API_URL}/api/jobs`)
            .then(res => res.json())
            .then(data => setJobs(data.jobs || []));

        // Fetch Events
        const now = new Date();
        fetch(`${API_URL}/api/events`)
            .then(res => res.json())
            .then(data => {
                const future = (data.events || [])
                    .filter(e => new Date(e.date) >= now)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5);
                setEvents(future);
            });
    }, []);

    // Limit jobs to 5
    const heroJobs = jobs.slice(0, 5);
    const futureEvents = events;

    return (
        <div className="space-y-12 pb-12">

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden rounded-3xl bg-zinc-900 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 px-6">
                    <div className="flex flex-wrap justify-center gap-3">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-black tracking-[0.2em] uppercase border border-purple-500/20"
                        >
                            Events
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black tracking-[0.2em] uppercase border border-blue-500/20"
                        >
                            Jobs
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-xs font-black tracking-[0.2em] uppercase border border-[#5865F2]/20"
                        >
                            Network
                        </motion.span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter"
                    >
                        Build, Connect, and <span className="text-blue-500">Ship.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        A curated community of elite builders, founders, and operators shipping the future together.
                    </motion.p>
                </div>
            </section>

            {/* Events, Card Animation, & Jobs Group */}
            <div className="space-y-2">
                <section className="space-y-4">
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">Upcoming Events</h2>
                        </div>
                        <button
                            onClick={() => navigate(ROUTES.EVENTS)}
                            className="text-[10px] font-bold tracking-widest uppercase text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            See All Events →
                        </button>
                    </div>
                    <ScrollingBanner items={futureEvents} type="event" className="py-1" />
                </section>

                {/* Business Card Animation */}
                <CardSwapSection />

                <section className="space-y-4">
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                            <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">Live Roles</h2>
                        </div>
                        <button
                            onClick={() => navigate(ROUTES.JOBS)}
                            className="text-[10px] font-bold tracking-widest uppercase text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            See All Roles →
                        </button>
                    </div>
                    <ScrollingBanner items={heroJobs} type="job" reverse={true} className="py-1" />
                </section>
            </div>




            {/* 4. The Non-JOB Hero */}
            <section className="py-12 flex flex-col items-center justify-center text-center space-y-4 px-6 bg-gradient-to-b from-transparent via-blue-500/[0.03] to-transparent">
                <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
                        <a href="https://discord.gg/NwQH763Gp" className="text-blue-400 hover:text-blue-300 transition-colors border-b border-blue-400/30 hover:border-blue-300">Join our Discord</a> to network with peers, learn from mentors, and move when the timing is right.
                    </p>


                </motion.div>
            </section>



        </div>
    );
};

export default Explore;
