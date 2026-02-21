import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ShieldCheck, Download, Users, Zap, FileText, ArrowRight, MessageSquare, Briefcase } from 'lucide-react';
import ProspectModal from '../components/modals/ProspectModal';
import ConsultationModal from '../components/modals/ConsultationModal';

const NetworkPage = () => {
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

    // Placeholder recruiter for the consultation modal
    const mockRecruiter = {
        id: 'network-specialist',
        name: 'Our Network Specialist'
    };

    return (
        <div className="max-w-5xl mx-auto space-y-24 pb-24">
            <ProspectModal
                isOpen={isProspectModalOpen}
                onClose={() => setIsProspectModalOpen(false)}
            />
            <ConsultationModal
                isOpen={isConsultationModalOpen}
                onClose={() => setIsConsultationModalOpen(false)}
                recruiter={mockRecruiter}
            />

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden rounded-[3rem] bg-zinc-900 border border-white/10">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/20 via-transparent to-emerald-500/10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5865F2]/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 px-6">
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
                        className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10 border border-emerald-500/20"
                    >
                        <DollarSign size={48} />
                    </motion.div>

                    <div className="space-y-4">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-xs font-black tracking-[0.2em] uppercase border border-[#5865F2]/20"
                        >
                            Referral Program
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white"
                        >
                            Earn <span className="text-emerald-400 italic">Passive</span> <br />
                            <span className="text-[#5865F2]">Income.</span>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Monetize your professional graph. We sign Revenue Share Agreements so you're rewarded for high-value introductions.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4 pt-4"
                    >
                        <button
                            onClick={() => setIsProspectModalOpen(true)}
                            className="px-8 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2"
                        >
                            Suggest a Contact
                        </button>
                        <button
                            onClick={() => setIsConsultationModalOpen(true)}
                            className="px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 hover:bg-zinc-700 transition-all active:scale-95 flex items-center gap-2"
                        >
                            Speak with a Specialist
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Revenue Share Section (Partnership Model) */}
            <section className="grid lg:grid-cols-2 gap-12 items-center bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors duration-1000"></div>

                <div className="space-y-10 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                            Partnership Model
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase text-white">
                            Monetize <br />
                            <span className="text-blue-500 italic">Your</span> <br />
                            Network.
                        </h2>
                        <p className="text-base text-gray-400 font-medium leading-relaxed max-w-md">
                            You get paid residuals and kickbacks automatically whenever profit is derived from your network connections.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {[
                            {
                                title: "High-Performance Talent",
                                desc: "Share elite builders and technical leaders who are ready for high-stakes placement.",
                                icon: <Users size={20} />,
                                color: "blue"
                            },
                            {
                                title: "Strategic Access",
                                desc: "Share hiring decision-makers with the authority to sign contracts and build teams.",
                                icon: <Zap size={20} />,
                                color: "emerald"
                            },
                            {
                                title: "Network Nodes",
                                desc: "Share contacts who would be willing to volunteer their own professional graph.",
                                icon: <FileText size={20} />,
                                color: "purple"
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group/item">
                                <div className={`mt-1 bg-${item.color}-500/20 p-3 rounded-xl text-${item.color}-400 group-hover/item:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-white text-lg leading-none uppercase tracking-tight italic">{item.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-zinc-950/50 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl relative z-10 shadow-2xl">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">Partner Portal</h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Active Revenue Streams</p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsProspectModalOpen(true)}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20 uppercase tracking-[0.2em]"
                                >
                                    <Users size={20} />
                                    Suggest a Contact
                                </button>

                                <div className="space-y-3">
                                    <a
                                        href="/network_partner_revenue_share_agreement.pdf"
                                        download
                                        className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
                                    >
                                        <Download size={20} />
                                        Download RSA
                                    </a>
                                    <p className="text-[9px] text-center text-gray-600 leading-relaxed uppercase tracking-[0.3em] font-black">
                                        Standard Revenue Share Agreement v1.4
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Earnings Preview */}
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] space-y-4">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Zap size={20} className="fill-current" />
                            <h4 className="font-black text-sm uppercase tracking-widest">Potential Upside</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Eng. Placement</p>
                                <p className="text-2xl font-black text-white">$2k - $5k</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Contract Intro</p>
                                <p className="text-2xl font-black text-white">$500+</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">
                        THE <span className="text-emerald-400">PARTNER</span> PIPELINE
                    </h2>
                    <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">A transparent path to distribution revenue</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            step: "01",
                            title: "Submit Signal",
                            desc: "Use the 'Suggest a Contact' tool to share details about a professional in your network."
                        },
                        {
                            step: "02",
                            title: "Verification",
                            desc: "Our team verifies the lead and determines the strategic fit for current opportunities."
                        },
                        {
                            step: "03",
                            title: "Revenue Event",
                            desc: "When a successful placement or contract is made, you receive your share of the revenue."
                        }
                    ].map((step, i) => (
                        <div key={i} className="relative p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6 group">
                            <div className="text-5xl font-black text-white/5 group-hover:text-emerald-500/10 transition-colors absolute top-4 right-8 italic">
                                {step.step}
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-xl">
                                {i + 1}
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{step.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Discord CTA Section */}
            <section className="text-center space-y-12 py-12">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-20 h-20 bg-[#5865F2]/20 text-[#5865F2] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#5865F2]/10 rotate-3"
                    >
                        <MessageSquare size={40} />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white max-w-2xl mx-auto"
                    >
                        Join the <span className="text-[#5865F2]">Inner Circle</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto font-medium"
                    >
                        Join our discussions in Discord. Everything from interview prep and career strategy to startup founder mixers.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <a
                        href="https://discord.gg/NwQH763Gp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-12 py-6 rounded-[2rem] bg-[#5865F2] hover:bg-[#4752C4] text-white font-black transition-all text-xl shadow-2xl shadow-[#5865F2]/30 active:scale-95 flex items-center justify-center gap-4 inline-flex uppercase tracking-tighter italic"
                    >
                        Enter Discord
                        <ArrowRight size={24} />
                    </a>
                </motion.div>
            </section>
        </div>
    );
};

export default NetworkPage;
