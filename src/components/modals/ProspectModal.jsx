import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Users, Briefcase, UserCheck, MessageCircle } from 'lucide-react';
import { API_URL } from '../../config/api';

const ProspectModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        target_type: 'talent', // 'talent' or 'decision_maker'
        recommender_name: '',
        recommender_email: '',
        recommender_phone: '',
        prospect_name: '',
        prospect_email: '',
        prospect_phone: '',
        willing_to_connect: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/prospects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to submit signal. Check your connection.');

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setFormData({
            target_type: 'talent',
            recommender_name: '',
            recommender_email: '',
            recommender_phone: '',
            prospect_name: '',
            prospect_email: '',
            prospect_phone: '',
            willing_to_connect: false
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-md"
                onClick={handleClose}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-xl relative z-10 shadow-2xl shadow-blue-500/10 max-h-[90vh] flex flex-col"
            >
                <div className="p-6 md:p-8 overflow-y-auto w-full scrollbar-hide">
                    {success ? (
                        <div className="text-center space-y-6 py-8">
                            <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                                <Send className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Signal Sent.</h2>
                            <p className="text-gray-400 leading-relaxed max-w-xs mx-auto text-sm">
                                Your intelligence has been logged. We'll verify the lead and reach out regarding placement equity.
                            </p>
                            <button
                                onClick={handleClose}
                                className="w-full py-4 bg-white text-black rounded-2xl font-black hover:bg-gray-200 transition-all shadow-xl uppercase tracking-widest text-xs"
                            >
                                Dismiss
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Suggest a contact</h2>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">Intelligence Report v2.0</p>
                                    </div>
                                </div>
                                <button onClick={handleClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* 1. Target Type Lightswitch Toggle */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold px-1">Lead Type</label>
                                    <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex relative">
                                        <motion.div
                                            className="absolute bg-blue-600 rounded-xl h-[calc(100%-12px)] top-[6px]"
                                            initial={false}
                                            animate={{
                                                width: "calc(50% - 9px)",
                                                x: formData.target_type === 'talent' ? 0 : "calc(100% + 6px)"
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, target_type: 'talent' })}
                                            className={`flex-1 py-3.5 rounded-xl font-bold text-sm relative z-10 transition-colors flex items-center justify-center gap-2 ${formData.target_type === 'talent' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Briefcase size={16} /> Top-Tier Talent
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, target_type: 'decision_maker' })}
                                            className={`flex-1 py-3.5 rounded-xl font-bold text-sm relative z-10 transition-colors flex items-center justify-center gap-2 ${formData.target_type === 'decision_maker' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <UserCheck size={16} /> Decision Maker
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 2. Recommender Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 px-1">
                                            <Users size={14} /> Your Information
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={formData.recommender_name}
                                                onChange={e => setFormData({ ...formData, recommender_name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-medium text-sm"
                                                placeholder="Your Name"
                                                required
                                            />
                                            <input
                                                type="email"
                                                value={formData.recommender_email}
                                                onChange={e => setFormData({ ...formData, recommender_email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-medium text-sm"
                                                placeholder="Your Email"
                                                required
                                            />
                                            <input
                                                type="tel"
                                                value={formData.recommender_phone}
                                                onChange={e => setFormData({ ...formData, recommender_phone: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-medium text-sm"
                                                placeholder="Your Phone Number"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Prospect Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 px-1">
                                            <Send size={14} /> Prospect Information
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={formData.prospect_name}
                                                onChange={e => setFormData({ ...formData, prospect_name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-medium text-sm"
                                                placeholder="Prospect Name"
                                                required
                                            />
                                            <input
                                                type="email"
                                                value={formData.prospect_email}
                                                onChange={e => setFormData({ ...formData, prospect_email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-medium text-sm"
                                                placeholder="Prospect Email"
                                                required
                                            />
                                            <input
                                                type="tel"
                                                value={formData.prospect_phone}
                                                onChange={e => setFormData({ ...formData, prospect_phone: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-medium text-sm"
                                                placeholder="Prospect Phone"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Connection Toggle */}
                                <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 group hover:border-blue-500/20 transition-all">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2 pr-4 leading-snug">
                                            <MessageCircle size={16} className="text-blue-400 flex-shrink-0" />
                                            Are you willing to make the introduction?
                                        </h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, willing_to_connect: !formData.willing_to_connect })}
                                        className={`w-14 h-8 rounded-full relative transition-all ${formData.willing_to_connect ? 'bg-blue-600' : 'bg-zinc-800'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${formData.willing_to_connect ? 'translate-x-6' : ''}`} />
                                    </button>
                                </div>

                                {error && <p className="text-red-500 text-xs bg-red-500/10 p-4 rounded-2xl border border-red-500/20">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl hover:bg-gray-200 disabled:opacity-50 mt-4 uppercase tracking-widest text-sm active:scale-95"
                                >
                                    {isSubmitting ? 'Broadcasting...' : <><Send className="w-4 h-4" /> Submit Signal</>}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProspectModal;
