import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ── Business Card Data ──────────────────────────────────────────────
const CARD_A = {
    name: 'MATT GOLA',
    title: 'PLACEMENT SPECIALIST',
    logo: '/assets/logo.svg',
    isImage: true,
    details: [
        { icon: '✉', text: 'gattmola@gmail.com' },
        { icon: '☎', text: '202-999-9688' },
    ],
};

const CARD_B = {
    name: 'ALEX CHEN',
    title: 'CHIEF OPERATING OFFICER',
    logo: '🌐',
    details: [
        { icon: '🔗', text: 'linkedin.com/in/jia-liu' },
        { icon: '📍', text: 'Plano' },
    ],
};

// ── Single Business Card ────────────────────────────────────────────
const BusinessCard = ({ data, style }) => (
    <motion.div
        style={style}
        className="absolute w-[260px] h-[155px] md:w-[300px] md:h-[175px] rounded-xl bg-gradient-to-br from-[#f5f5f0] to-[#e8e8e3] shadow-2xl shadow-black/40 p-4 md:p-5 flex flex-col justify-between will-change-transform select-none pointer-events-none"
    >
        {/* Top row: logo + name */}
        <div className="space-y-1">
            {data.isImage ? (
                <img src={data.logo} alt="Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain mb-1" />
            ) : (
                <span className="text-lg md:text-xl text-zinc-700 font-bold leading-none">{data.logo}</span>
            )}
            <div>
                <h3 className="text-zinc-900 font-black text-sm md:text-base tracking-wide">{data.name}</h3>
                <p className="text-zinc-500 text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase">{data.title}</p>
            </div>
        </div>

        {/* Bottom row: contact details */}
        <div className="space-y-0.5">
            {data.details.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-zinc-600 text-[10px] md:text-xs">
                    <span className="text-xs">{d.icon}</span>
                    <span>{d.text}</span>
                </div>
            ))}
        </div>
    </motion.div>
);

// ── Main Scroll-Driven Section ──────────────────────────────────────
const CardSwapSection = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // ── Card A transforms (starts left, ends right) ─────────────────
    const aX = useTransform(scrollYProgress, [0.15, 0.35, 0.5, 0.65, 0.85], [-120, -60, 0, 60, 120]);
    const aY = useTransform(scrollYProgress, [0.15, 0.35, 0.5, 0.65, 0.85], [0, 30, 45, 30, 0]);
    const aRotate = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [-6, 0, 6]);
    const aZ = useTransform(scrollYProgress, [0, 0.49, 0.5, 1], [1, 1, 2, 2]); // Starts behind
    const aScale = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [1, 0.95, 1]);

    // ── Card B transforms (starts right, ends left) ─────────────────
    const bX = useTransform(scrollYProgress, [0.15, 0.35, 0.5, 0.65, 0.85], [120, 60, 0, -60, -120]);
    const bY = useTransform(scrollYProgress, [0.15, 0.35, 0.5, 0.65, 0.85], [0, -30, -45, -30, 0]);
    const bRotate = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [6, 0, -6]);
    const bZ = useTransform(scrollYProgress, [0, 0.49, 0.5, 1], [2, 2, 1, 1]); // Starts on top
    const bScale = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [1, 0.95, 1]);

    // Overall section opacity
    const opacity = useTransform(scrollYProgress, [0.05, 0.2, 0.8, 0.95], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} className="relative h-[320px] overflow-hidden my-12">
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div style={{ opacity }} className="relative w-full flex items-center justify-center">
                    {/* Card A */}
                    <BusinessCard
                        data={CARD_A}
                        style={{
                            x: aX,
                            y: aY,
                            rotate: aRotate,
                            zIndex: aZ,
                            scale: aScale,
                        }}
                    />

                    {/* Card B */}
                    <BusinessCard
                        data={CARD_B}
                        style={{
                            x: bX,
                            y: bY,
                            rotate: bRotate,
                            zIndex: bZ,
                            scale: bScale,
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default CardSwapSection;
