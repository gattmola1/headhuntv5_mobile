import { motion } from 'framer-motion';

const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black backdrop-blur-md">
            <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        className="w-4 h-4 rounded-full bg-white"
                        animate={{
                            y: ['0%', '-50%', '0%'],
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.15,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PageLoader;
