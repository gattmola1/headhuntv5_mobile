
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle } from 'lucide-react';

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect }) => {
    const [selectedRole, setSelectedRole] = useState('');
    const navigate = useNavigate();

    const roles = [
        { id: 'candidate', label: 'Candidate', desc: 'I want to be hired.', path: '/jobs' },
        { id: 'employer', label: 'Employer', desc: 'I want to hire talent.', path: '/employers' },
        { id: 'recruiter', label: 'Recruiter', desc: 'I want to place talent.', path: '/recruiters' },
        { id: 'partner', label: 'Partner', desc: 'I want to monetize my network.', path: '/network' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const role = roles.find(r => r.id === selectedRole);
        if (role) {
            navigate(role.path);
            if (onRoleSelect) onRoleSelect(selectedRole);
            onClose(); // Close the modal after navigation
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
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <h2 className="text-xl font-bold text-white">Complete Profile</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 md:p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">I am a...</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {roles.map((role) => (
                                                <label
                                                    key={role.id}
                                                    className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === role.id
                                                        ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                                                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value={role.id}
                                                        checked={selectedRole === role.id}
                                                        onChange={(e) => setSelectedRole(e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm">{role.label}</div>
                                                        <div className="text-xs opacity-70">{role.desc}</div>
                                                    </div>
                                                    {selectedRole === role.id && (
                                                        <CheckCircle className="w-5 h-5 text-indigo-400" />
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!selectedRole}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Next
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoleSelectionModal;
