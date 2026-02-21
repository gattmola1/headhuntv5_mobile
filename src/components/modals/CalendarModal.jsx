import { X, Calendar } from 'lucide-react';

const CalendarModal = ({ isOpen, onClose, recruiter }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10 bg-black/50 rounded-full p-2"
                >
                    <X size={24} />
                </button>

                <div className="bg-black/50 p-6 border-b border-white/5 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <div>
                        <h2 className="font-bold text-white text-xl">{recruiter?.name}'s Availability</h2>
                        <p className="text-sm text-gray-400">View their public calendar to find a good time</p>
                    </div>
                </div>

                <div className="aspect-video w-full bg-black/20">
                    <iframe
                        src={`https://calendar.google.com/calendar/embed?src=${recruiter?.calendar_id || 'en.usa%23holiday%40group.v.calendar.google.com'}&ctz=America%2FLos_Angeles`}
                        style={{ border: 0 }}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        title={`${recruiter?.name} Calendar`}
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
