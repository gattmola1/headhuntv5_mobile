
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

import { MessageSquare, ArrowRight } from 'lucide-react';
import SignupModal from '../components/modals/SignupModal';
import VerificationModal from '../components/modals/VerificationModal';
import RoleSelectionModal from '../components/modals/RoleSelectionModal';


const Home = () => {
    // Stage: 'initial' -> 'reading' -> 'scrolled'
    // We can just use a simple state to trigger the "scroll up" animation
    const [hasScrolled, setHasScrolled] = React.useState(false);

    // Modal State
    const [isSignupOpen, setIsSignupOpen] = React.useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = React.useState(false);
    const [isRoleOpen, setIsRoleOpen] = React.useState(false);

    // Particle State
    const [particles, setParticles] = React.useState([]);

    // Data State to pass between modals
    const [userContext, setUserContext] = React.useState({ name: '', phone: '' });

    useEffect(() => {
        // Timeline:
        // 0.0s: Component mounts
        // 0.5s: Welcome text starts appearing (spring in)
        // 1.5s: Welcome text has fully settled/bounced
        // 2.5s: (1s reading time) -> Trigger scroll up

        // Let's match the previous bounce timing roughly.
        // We'll give it a bit of time to "be" there.
        const timer = setTimeout(() => {
            setHasScrolled(true);
        }, 1500); // Trigger after 1.5 seconds

        return () => clearTimeout(timer);
    }, []);

    const discordLink = "https://discord.gg/NwQH763Gp";

    // Flow Handlers
    const handleSignupSubmit = (formData) => {
        setUserContext(prev => ({ ...prev, ...formData }));
        setIsSignupOpen(false);
        setIsRoleOpen(true);
    };

    const handleRoleSelect = (role) => {
        setUserContext(prev => ({ ...prev, role }));
        setIsRoleOpen(false);
        setIsVerificationOpen(true);
    };

    const handleVerificationComplete = () => {
        console.log('Finalizing signup with verification:', userContext);
        // Here we would create the user in the backend
        setIsVerificationOpen(false);
    };

    const spawnParticles = () => {
        const id = Date.now() + Math.random();
        const startX = (Math.random() - 0.5) * 320; // Distributed across ~320px width
        const newParticle = {
            id,
            startX,
            endX: startX + (Math.random() - 0.5) * 60, // Slight drift
            rotate: (Math.random() - 0.5) * 60,
            scale: 0.4 + Math.random() * 0.6
        };
        setParticles(prev => [...prev, newParticle]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== id));
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans overflow-y-auto overflow-x-hidden relative">

            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Collapsible Welcome Section */}
            <motion.div
                initial={{ height: "auto", opacity: 1, paddingTop: "10vh", paddingBottom: "1rem" }}
                animate={{
                    height: hasScrolled ? "0vh" : "auto",
                    opacity: hasScrolled ? 0 : 1,
                    paddingTop: hasScrolled ? "0px" : "10vh",
                    paddingBottom: hasScrolled ? "0px" : "1rem",
                }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="relative z-20 overflow-hidden"
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                    }}
                    transition={{
                        scale: { type: "spring", stiffness: 100, damping: 20 },
                        opacity: { duration: 0.5 }
                    }}
                    className="text-center"
                >
                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        Welcome
                    </h1>
                </motion.div>
            </motion.div>

            {/* Collapsing Spacer - Pushes invitation to middle/bottom initially */}
            <motion.div
                initial={{ height: "30vh" }}
                animate={{
                    height: hasScrolled ? "0vh" : "30vh",
                }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="relative z-10"
            />

            {/* Main Content (Invite Section) - Becomes main feature at top after collapse */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.8,
                    ease: "circOut",
                    delay: 0.5
                }}
                className="relative z-10 w-full max-w-md px-6 mx-auto pt-0 pb-24 text-center"
            >
                <div className="space-y-8">
                    <h2 className="text-2xl md:text-3xl font-light text-indigo-200">
                        Welcome to the club!
                    </h2>

                    <div className="flex flex-col gap-4">
                        {/* What's the password? - "Door Knock" Animation */}
                        <KnockingButton
                            onClick={() => setIsVerificationOpen(true)}
                        />

                        {/* TikTok/Reel Style Video */}
                        <div className="relative mt-4 group cursor-pointer">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: hasScrolled ? 1 : 0, scale: hasScrolled ? 1 : 0.9 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="mx-auto w-full max-w-md aspect-[9/16] bg-gray-900 rounded-[35px] border-[6px] border-white/10 overflow-hidden shadow-2xl relative z-20"
                                style={{ borderRadius: '35px' }}
                            >
                                <video
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                >
                                    <source src="https://videos.pexels.com/video-files/6963744/6963744-hd_1080_1920_25fps.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-6 left-6 right-6 text-left">
                                    <div className="text-sm font-bold text-white mb-1">Future of Work</div>
                                    <div className="text-xs text-indigo-400">Join the revolution</div>
                                </div>
                            </motion.div>
                            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 blur-xl transition-all duration-500 rounded-[35px] z-10" />
                        </div>

                        {/* Join our group button */}
                        <div className="relative" onMouseMove={spawnParticles}>
                            <AnimatePresence>
                                {particles.map(particle => (
                                    <motion.img
                                        key={particle.id}
                                        src="/image-removebg-preview (60).png"
                                        initial={{ y: 20, x: particle.startX, opacity: 0, scale: 0 }}
                                        animate={{
                                            y: -200,
                                            x: particle.endX,
                                            opacity: [0, 1, 1, 0],
                                            scale: particle.scale,
                                            rotate: particle.rotate
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="absolute left-1/2 -translate-x-1/2 w-6 h-6 pointer-events-none z-0"
                                        style={{ top: '40%' }}
                                    />
                                ))}
                            </AnimatePresence>
                            <a
                                href={discordLink}
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Open as a popup window to be less interruptive than a full tab switch
                                    const width = 600;
                                    const height = 800;
                                    const left = window.screen.width / 2 - width / 2;
                                    const top = window.screen.height / 2 - height / 2;
                                    window.open(
                                        discordLink,
                                        'Discord',
                                        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
                                    );
                                }}
                                rel="noopener noreferrer"
                                className="group relative px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] rounded-2xl font-bold text-white transition-all shadow-lg shadow-[#5865F2]/20 flex items-center justify-center gap-2 overflow-hidden z-20"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <MessageSquare className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Join our group!</span>
                            </a>
                        </div>


                    </div>
                </div>
            </motion.div>

            <SignupModal
                isOpen={isSignupOpen}
                onClose={() => setIsSignupOpen(false)}
                onSignup={handleSignupSubmit}
            />

            <VerificationModal
                isOpen={isVerificationOpen}
                onClose={() => setIsVerificationOpen(false)}
                onVerify={handleVerificationComplete}
                phoneNumber={userContext.phone}
            />

            <RoleSelectionModal
                isOpen={isRoleOpen}
                onClose={() => setIsRoleOpen(false)}
                onRoleSelect={handleRoleSelect}
            />
        </div>
    );
};

const KnockingButton = ({ onClick }) => {
    const [knockPhase, setKnockPhase] = React.useState(0); // 0 = idle, 1/2/3 = knock hits

    useEffect(() => {
        const runKnockSequence = () => {
            // Speakeasy knock pattern: knock ... knock-knock
            // First knock
            setKnockPhase(1);
            setTimeout(() => setKnockPhase(0), 150);

            // Pause, then double knock
            setTimeout(() => {
                setKnockPhase(2);
                setTimeout(() => setKnockPhase(0), 120);
            }, 400);

            setTimeout(() => {
                setKnockPhase(3);
                setTimeout(() => setKnockPhase(0), 120);
            }, 600);
        };

        // First knock after 2s, then repeat
        const initialTimeout = setTimeout(runKnockSequence, 2000);
        const interval = setInterval(runKnockSequence, 4500);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);



    // The button physically reacts to each knock
    const getKnockTransform = () => {
        if (knockPhase === 1) return { scale: 1.02, rotate: -0.5, y: -1 };
        if (knockPhase === 2) return { scale: 1.03, rotate: 0.4, y: -1.5 };
        if (knockPhase === 3) return { scale: 1.04, rotate: -0.3, y: -2 };
        return { scale: 1, rotate: 0, y: 0 };
    };

    return (
        <div className="relative w-full flex flex-col items-center">
            {/* Persistent warm ambient glow behind button — always breathing */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -inset-3 rounded-3xl z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(217, 170, 75, 0.35) 0%, rgba(217, 170, 75, 0.08) 50%, transparent 70%)',
                    filter: 'blur(16px)',
                }}
            />



            {/* The button itself */}
            <motion.button
                onClick={onClick}
                animate={getKnockTransform()}
                transition={{
                    type: "spring",
                    stiffness: 600,
                    damping: 15,
                    mass: 0.5,
                }}
                whileHover={{
                    scale: 1.04,
                    boxShadow: '0 0 40px rgba(217, 170, 75, 0.4), 0 0 80px rgba(217, 170, 75, 0.15)',
                }}
                whileTap={{ scale: 0.96 }}
                className="relative z-10 group w-full overflow-hidden rounded-2xl cursor-pointer"
                style={{
                    background: 'linear-gradient(135deg, rgba(217, 170, 75, 0.15) 0%, rgba(30, 30, 30, 0.9) 40%, rgba(30, 30, 30, 0.95) 60%, rgba(217, 170, 75, 0.1) 100%)',
                    border: '1.5px solid rgba(217, 170, 75, 0.4)',
                    boxShadow: '0 0 24px rgba(217, 170, 75, 0.15), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                    padding: '18px 32px',
                }}
            >
                {/* Inner flash on knock */}
                <motion.div
                    animate={{
                        opacity: knockPhase > 0 ? [0, 0.6, 0] : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(217, 170, 75, 0.4) 0%, transparent 70%)',
                    }}
                />

                {/* Shine sweep on hover */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                    style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(217, 170, 75, 0.15) 45%, rgba(217, 170, 75, 0.3) 50%, rgba(217, 170, 75, 0.15) 55%, transparent 60%)',
                    }}
                />

                {/* Text content */}
                <div className="relative z-20 flex items-center justify-center gap-3">
                    <span
                        className="text-base md:text-lg font-semibold tracking-wide"
                        style={{
                            background: 'linear-gradient(90deg, #fff 0%, #d9aa4b 50%, #fff 100%)',
                            backgroundSize: '200% 100%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: 'shimmerText 4s ease-in-out infinite',
                        }}
                    >
                        Already a member?
                    </span>
                    <motion.div
                        animate={{
                            x: [0, 4, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <ArrowRight className="w-5 h-5 text-amber-400/80" />
                    </motion.div>
                </div>
            </motion.button>

            {/* CSS Keyframe for text shimmer */}
            <style>{`
                @keyframes shimmerText {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
            `}</style>
        </div>
    );
};

export default Home;
