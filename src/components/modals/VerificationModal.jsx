
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const MAX_ATTEMPTS = 3;

const Test1VerificationModal = ({ isOpen, onClose, onVerify, phoneNumber }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const navigate = useNavigate();

    // Auto-submit when 4th digit is entered
    useEffect(() => {
        if (code.length === 4 && !loading) {
            handleVerify();
        }
    }, [code]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCode('');
            setError(false);
            setLoading(false);
            setAttempts(0);
        }
    }, [isOpen]);

    const handleVerify = () => {
        const accessCode = import.meta.env.VITE_ACCESS_CODE;
        if (code === accessCode) {
            setLoading(true);

            // Preload the About page bundle in the background while the fake loading spinner runs
            import('../../pages/About');

            setTimeout(() => {
                navigate(ROUTES.ABOUT);
                if (onVerify) onVerify();
            }, 3000);
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setError(true);
            setCode('');
            if (newAttempts >= MAX_ATTEMPTS) {
                // Close modal after a short delay so the flash is visible
                setTimeout(() => {
                    setError(false);
                    onClose();
                }, 800);
            } else {
                setTimeout(() => setError(false), 2000);
            }
        }
    };

    const pressDigit = (digit) => {
        if (loading || code.length >= 4) return;
        setCode(prev => prev + digit);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                boxShadow: error
                                    ? ['0 0 0 0px rgba(239,68,68,0)', '0 0 0 4px rgba(239,68,68,0.7)', '0 0 0 8px rgba(239,68,68,0.3)', '0 0 0 0px rgba(239,68,68,0)']
                                    : '0 25px 50px -12px rgba(0,0,0,0.5)',
                            }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ boxShadow: { duration: 0.6, ease: 'easeOut' } }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative my-auto flex flex-col" style={{ maxHeight: '95dvh' }}
                        >
                            {/* Body */}
                            <div className="space-y-4 md:space-y-6 pt-6 md:pt-10 pb-6 px-6 md:px-8 overflow-y-auto flex-1">
                                <div className="text-center">
                                    <motion.div
                                        animate={{
                                            rotate: [0, -10, 10, -5, 5, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            ease: "easeInOut",
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        }}
                                        className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                                    >
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M12 4C9.23858 4 7 6.23858 7 9C7 11.1236 8.32631 12.9463 10.187 13.6934L9.5 19.5C9.5 19.7761 9.72386 20 10 20H14C14.2761 20 14.5 19.7761 14.5 19.5L13.813 13.6934C15.6737 12.9463 17 11.1236 17 9C17 6.23858 14.7614 4 12 4ZM12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6Z"
                                            />
                                        </svg>
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white mb-2">Enter Access Code</h3>
                                    <p className="text-gray-400 text-sm">
                                        Please enter your 4-digit pin.
                                    </p>
                                </div>

                                {/* Pin Display */}
                                <div className="flex gap-4 justify-center py-4">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-bold transition-all ${error
                                                ? 'border-red-500 bg-red-500/20 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                                : code[i]
                                                    ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                                                    : 'border-white/10 bg-white/5 text-transparent'
                                                }`}
                                        >
                                            {code[i]}
                                        </div>
                                    ))}
                                </div>

                                {/* Error message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center text-red-400 text-sm font-medium -mt-2"
                                        >
                                            {attempts >= MAX_ATTEMPTS
                                                ? 'Too many attempts. Access denied.'
                                                : `Incorrect code. ${MAX_ATTEMPTS - attempts} attempt${MAX_ATTEMPTS - attempts === 1 ? '' : 's'} remaining.`}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                {/* Keypad */}
                                <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto pb-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            disabled={loading || attempts >= MAX_ATTEMPTS}
                                            onClick={() => pressDigit(String(num))}
                                            className="aspect-square rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-2xl font-bold transition-all active:scale-90 hover:border-white/20 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            {num}
                                        </button>
                                    ))}

                                    {/* Bottom Row */}
                                    <div />
                                    <button
                                        type="button"
                                        disabled={loading || attempts >= MAX_ATTEMPTS}
                                        onClick={() => pressDigit('0')}
                                        className="aspect-square rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-2xl font-bold transition-all active:scale-90 hover:border-white/20 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        0
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading || attempts >= MAX_ATTEMPTS}
                                        onClick={() => setCode(prev => prev.slice(0, -1))}
                                        className="aspect-square rounded-full flex items-center justify-center hover:bg-white/5 text-gray-400 transition-colors active:scale-95 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ⌫
                                    </button>
                                </div>

                                {/* Loading dots — shown during success delay */}
                                {loading && (
                                    <div className="flex items-center justify-center gap-2 py-2">
                                        <motion.div className="w-2 h-2 bg-indigo-300 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                                        <motion.div className="w-2 h-2 bg-indigo-300 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                                        <motion.div className="w-2 h-2 bg-indigo-300 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Test1VerificationModal;
