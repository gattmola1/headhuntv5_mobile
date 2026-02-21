import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, CheckCircle, MessageSquare, User, Mail, Phone } from 'lucide-react';
import { API_URL } from '../../config/api';

const RSVPModal = ({ isOpen, onClose, event }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        sms_consent: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !event) return null;

    const canSubmit = formData.sms_consent && formData.name && formData.email && formData.phone;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/rsvp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_id: event.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    sms_consent: formData.sms_consent,
                }),
            });

            const json = await response.json();
            if (!response.ok) throw new Error(json.error || 'Failed to submit RSVP.');

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError('');
        setFormData({ name: '', email: '', phone: '', sms_consent: false });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
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
                className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-md relative z-10 shadow-2xl shadow-purple-500/10 max-h-[90vh] flex flex-col"
            >
                <div className="p-6 md:p-8 overflow-y-auto w-full scrollbar-hide">
                    {success ? (
                        <div className="text-center space-y-6 py-8">
                            <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">You're In.</h2>
                            <p className="text-gray-400 leading-relaxed max-w-xs mx-auto text-sm">
                                Your RSVP for <span className="text-white font-bold">{event.title}</span> is confirmed. We'll text you updates — see you there.
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
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/20">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">RSVP</h2>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1 line-clamp-1">{event.title}</p>
                                    </div>
                                </div>
                                <button onClick={handleClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name */}
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white outline-none focus:border-purple-500 transition-all font-medium text-sm"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white outline-none focus:border-purple-500 transition-all font-medium text-sm"
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white outline-none focus:border-purple-500 transition-all font-medium text-sm"
                                        placeholder="Phone Number"
                                        required
                                    />
                                </div>

                                {/* SMS Consent */}
                                <label
                                    className={`flex items-start gap-4 p-5 rounded-3xl border cursor-pointer transition-all ${formData.sms_consent
                                            ? 'bg-purple-500/10 border-purple-500/40'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {/* Custom checkbox */}
                                    <div
                                        onClick={() => setFormData({ ...formData, sms_consent: !formData.sms_consent })}
                                        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${formData.sms_consent
                                                ? 'bg-purple-500 border-purple-500'
                                                : 'border-white/30 bg-transparent'
                                            }`}
                                    >
                                        {formData.sms_consent && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                            >
                                                <CheckCircle className="w-3.5 h-3.5 text-white" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                            I consent to receive SMS event updates
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            By checking this box you agree to receive text messages about this event. Msg &amp; data rates may apply. Required to RSVP.
                                        </p>
                                    </div>
                                </label>

                                {error && (
                                    <p className="text-red-500 text-xs bg-red-500/10 p-4 rounded-2xl border border-red-500/20">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting}
                                    className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl uppercase tracking-widest text-sm active:scale-95 ${canSubmit && !isSubmitting
                                            ? 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                                            : 'bg-white/10 text-white/30 cursor-not-allowed'
                                        }`}
                                >
                                    {isSubmitting ? 'Confirming...' : 'Confirm RSVP'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default RSVPModal;
