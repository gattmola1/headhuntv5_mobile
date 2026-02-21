import { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Calendar, Clock, Phone, Mail, User } from 'lucide-react';
import { API_URL } from '../../config/api';
import { motion, AnimatePresence } from 'framer-motion';

const ConsultationModal = ({ isOpen, onClose, recruiter }) => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        preferred_windows: []
    });

    const handleWindowToggle = (window) => {
        setFormData(prev => {
            if (prev.preferred_windows.includes(window)) {
                return { ...prev, preferred_windows: prev.preferred_windows.filter(w => w !== window) };
            } else {
                return { ...prev, preferred_windows: [...prev.preferred_windows, window] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recruiter_id: recruiter.id,
                    ...formData
                })
            });
            if (!res.ok) throw new Error('Failed to submit inquiry');
            setSubmitted(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleClose = () => {
        setSubmitted(false);
        setFormData({
            candidate_name: '',
            candidate_email: '',
            candidate_phone: '',
            preferred_windows: []
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                        className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
                    >
                        {/* Header - Fixed */}
                        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
                            <div>
                                <h2 className="text-xl font-bold text-white">Request Consultation</h2>
                                <p className="text-xs text-gray-400">with {recruiter?.name || 'Recruiter'}</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar">
                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                                    <input
                                                        required
                                                        type="text"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                                        placeholder="Jane Doe"
                                                        value={formData.candidate_name}
                                                        onChange={e => setFormData({ ...formData, candidate_name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                                    <input
                                                        required
                                                        type="email"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                                        placeholder="jane@example.com"
                                                        value={formData.candidate_email}
                                                        onChange={e => setFormData({ ...formData, candidate_email: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input
                                                    type="tel"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={formData.candidate_phone}
                                                    onChange={e => setFormData({ ...formData, candidate_phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                            <Clock size={12} /> Preferred Time Windows
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                "Business Hrs (9-5)",
                                                "Early (7-9am)",
                                                "Evenings (5-8pm)",
                                                "Weekends"
                                            ].map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => handleWindowToggle(option)}
                                                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between group ${formData.preferred_windows.includes(option)
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                                                        }`}
                                                >
                                                    <span>{option}</span>
                                                    {formData.preferred_windows.includes(option) && <CheckCircle2 className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-white text-black font-black text-sm uppercase tracking-wider py-4 rounded-xl hover:bg-gray-200 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 group"
                                        >
                                            Submit Request
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                                    <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                                    <p className="text-gray-400 max-w-xs mx-auto mb-8 text-sm leading-relaxed">
                                        {recruiter?.name} will check your availability and get back to you shortly.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-colors border border-white/5"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConsultationModal;
