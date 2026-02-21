import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ShieldCheck, Download, Users, Zap, FileText } from 'lucide-react';
import ProspectModal from '../components/modals/ProspectModal';

const NetworkPage = () => {
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);

    return (
        <div className="max-w-5xl mx-auto space-y-24">
            <ProspectModal
                isOpen={isProspectModalOpen}
                onClose={() => setIsProspectModalOpen(false)}
            />
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden rounded-3xl bg-zinc-900 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/20 via-transparent to-purple-600/20"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-[#5865F2]/20 text-[#5865F2] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#5865F2]/10"
                    >
                        <MessageSquare size={48} />
                    </motion.div>
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
                        className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-tight"
                    >
                        Join our networking group to earn <span className="text-[#5865F2]">passive income.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        Earn passive income by selling access to your network. We sign Revenue Share Agreements so you're rewarded for making introductions with hiring employers and with top talent!
                    </motion.p>
                </div>
            </section>

            {/* Revenue Share Section (Partnership Model) */}
            <section className="grid md:grid-cols-2 gap-12 items-center bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <div className="space-y-8 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                            Partnership Model
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase">
                            MONETIZE YOUR <br />
                            <span className="text-blue-500">NETWORK.</span>
                        </h2>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-md">
                            You get paid residuals and kickbacks automatically whenever profit is derived from your network connections.
                        </p>
                    </div>

                    <div className="space-y-6 pt-4">
                        {[
                            {
                                title: "High-Performance Talent",
                                desc: "Share elite builders and technical leaders who are ready for high-stakes placement.",
                                icon: <Users size={18} />
                            },
                            {
                                title: "Strategic Access",
                                desc: "Share hiring decision-makers with the authority to sign contracts and build teams.",
                                icon: <Zap size={18} />
                            },
                            {
                                title: "Network Nodes",
                                desc: "Share contacts who would be willing to volunteer their own professional graph for automated upside.",
                                icon: <FileText size={18} />
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 group">
                                <div className="mt-1 bg-blue-500/20 p-2 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    {item.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-white leading-none">{item.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 bg-black/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl relative z-10">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold italic tracking-tight">Partner Actions</h3>

                        <div>
                            <button
                                onClick={() => setIsProspectModalOpen(true)}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20 uppercase tracking-widest"
                            >
                                <Users size={18} />
                                Suggest a Contact
                            </button>
                        </div>

                        <div className="pt-2">
                            <a
                                href="/network_partner_revenue_share_agreement.pdf"
                                download
                                className="w-full py-4 bg-white text-black rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/5 uppercase tracking-widest"
                            >
                                <Download size={18} />
                                DOWNLOAD REVENUE SHARE AGREEMENT
                            </a>
                            <p className="text-[10px] text-center text-gray-600 mt-4 leading-relaxed uppercase tracking-widest font-mono">
                                Revenue Share Agreement
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Discord CTA Section */}
            <section className="text-center pb-24 space-y-6">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-gray-400 text-lg max-w-2xl mx-auto"
                >
                    Please join our discussions in our discord. Everything from interview prep, career strategy, to aspiring start up founders.
                </motion.p>
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
                        className="px-12 py-5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black transition-all text-xl shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 inline-flex"
                    >
                        Join our Discord
                    </a>
                </motion.div>
            </section>
        </div>
    );
};

export default NetworkPage;
