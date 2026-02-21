import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../config/api';
import JobCard from '../components/cards/JobCard';
import ApplicationModal from '../components/modals/ApplicationModal';
import PageLoader from '../components/layout/PageLoader';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (jobs.length > 0) {
            const idToOpen = searchParams.get('id');
            if (idToOpen) {
                const jobToOpen = jobs.find(j => j.id.toString() === idToOpen);
                if (jobToOpen) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setSelectedJob(jobToOpen);
                }
            }
        }
    }, [jobs, searchParams]);

    useEffect(() => {
        fetch(`${API_URL}/api/jobs`)
            .then(res => res.json())
            .then(data => {
                setJobs(data.jobs || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch jobs", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden rounded-3xl bg-zinc-900 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 px-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black tracking-[0.2em] uppercase border border-blue-500/20"
                    >
                        Exclusive Roles
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter"
                    >
                        You're Here Because You're <span className="text-blue-500">Top Talent.</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed space-y-4"
                    >
                        <p>
                            We don’t blast roles publicly. We've backchanneled with hiring partners.
                        </p>
                        <p>
                            They’re ready to move quickly — waiting for someone like you to step forward.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-6 pt-4"
                    >
                        <a
                            href="#jobs"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
                        >
                            Explore Your Next Step →
                        </a>

                        <p className="text-sm text-gray-500 max-w-md">
                            <a href="https://discord.gg/NwQH763Gp" className="text-blue-400 hover:text-blue-300 transition-colors border-b border-blue-400/30 hover:border-blue-300">Join our Discord</a> to network with peers, learn from mentors, and move when the timing is right.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Jobs Section */}
            <section id="jobs" className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold">Open Positions</h2>
                    <span className="text-sm text-gray-500 font-mono">{jobs.length} ROLES AVAILABLE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onApply={(j) => {
                                setSelectedJob(j);
                                setSearchParams({ id: j.id });
                            }}
                        />
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 border border-white/5 rounded-xl bg-white/5">
                            No open positions at the moment. check back later.
                        </div>
                    )}
                </div>
            </section>

            {selectedJob && (
                <ApplicationModal
                    job={selectedJob}
                    isOpen={!!selectedJob}
                    onClose={() => {
                        setSelectedJob(null);
                        setSearchParams({});
                    }}
                />
            )}
        </div>
    );
};

export default Jobs;
