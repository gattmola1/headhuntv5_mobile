import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../config/routes';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] bg-black text-white font-sans flex flex-col items-center justify-center relative overflow-hidden w-full">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="relative z-10 text-center space-y-8 px-6"
            >
                <div className="space-y-4">
                    <motion.h1
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                        className="text-7xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                    >
                        404
                    </motion.h1>
                    <h2 className="text-2xl md:text-3xl font-light text-indigo-200">
                        Oops! We lost you there.
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                        It looks like your session may have expired or this page moved. No worries though—you can easily jump right back into the network by returning home and logging in again!
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-6 flex justify-center"
                >
                    <button
                        onClick={() => navigate(ROUTES.HOME)}
                        className="group relative px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-medium text-white transition-all flex items-center gap-2 overflow-hidden shadow-lg cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="relative z-10">Return to Home</span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;
