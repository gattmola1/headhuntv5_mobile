
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const Test1VerificationModal = ({ isOpen, onClose, onVerify, phoneNumber }) => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleVerify = (e) => {
        e.preventDefault();
        // Mock verification logic
        if (code.length >= 4) {
            console.log("Verified code:", code);
            navigate(ROUTES.ABOUT);
            if (onVerify) onVerify();
        }
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            {/* Body */}
                            <div className="space-y-8 pt-12 pb-4 px-6 md:px-8">
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
                                        className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
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
                                            className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-bold transition-all ${code[i]
                                                ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                                                : 'border-white/10 bg-white/5 text-transparent'
                                                }`}
                                        >
                                            {code[i]}
                                        </div>
                                    ))}
                                </div>

                                {/* Keypad */}
                                <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto pb-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => {
                                                if (code.length < 4) {
                                                    const newCode = code + num;
                                                    setCode(newCode);
                                                }
                                            }}
                                            className="aspect-square rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-2xl font-bold transition-all active:scale-90 hover:border-white/20 hover:scale-105"
                                        >
                                            {num}
                                        </button>
                                    ))}

                                    {/* Bottom Row */}
                                    <div />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (code.length < 4) {
                                                const newCode = code + '0';
                                                setCode(newCode);
                                            }
                                        }}
                                        className="aspect-square rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-2xl font-bold transition-all active:scale-90 hover:border-white/20 hover:scale-105"
                                    >
                                        0
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCode(prev => prev.slice(0, -1))}
                                        className="aspect-square rounded-full flex items-center justify-center hover:bg-white/5 text-gray-400 transition-colors active:scale-95 hover:text-white"
                                    >
                                        ⌫
                                    </button>
                                </div>

                                <button
                                    onClick={(e) => handleVerify(e)}
                                    disabled={code.length !== 4}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/20 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2 mt-4 text-lg tracking-wide shadow-indigo-500/20"
                                >
                                    Welcome Back
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Test1VerificationModal;
