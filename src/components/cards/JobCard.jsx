import { motion } from 'framer-motion';
import { DollarSign, MapPin } from 'lucide-react';

const JobCard = ({ job, onApply }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group"
            onClick={() => onApply(job)}
        >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                        {job.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-mono tracking-widest uppercase">
                        <div className="flex items-center gap-1.5 text-blue-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-gray-400">{job.location || 'Remote'}</span>
                        </div>
                        {job.salary && (
                            <div className="flex items-center gap-1.5 text-green-400">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span className="text-gray-400">{job.salary.toLocaleString()}/YR</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-auto md:pt-1">
                    <div className="w-full md:w-auto text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm group-hover:bg-blue-500 transition-colors whitespace-nowrap">
                        Quick Apply →
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;
