import React, { useEffect, useState } from 'react';
import { Share, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstruction, setShowIOSInstruction] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(ios);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            setIsInstalled(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = (e) => {
        e.preventDefault();
        if (isIOS) {
            setShowIOSInstruction(true);
        } else if (promptInstall) {
            promptInstall.prompt();
            promptInstall.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    // Consumed
                }
                setPromptInstall(null);
            });
        }
    };

    // Don't show if installed
    if (isInstalled) return null;

    // Only show for iOS or if beforeinstallprompt fired (Android/Desktop Chrome)
    if (!isIOS && !supportsPWA) return null;


    return (
        <>
            {/* Floating Install Button */}
            <button
                onClick={handleInstallClick}
                className="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-full shadow-lg hover:bg-white/20 transition-all font-medium text-sm animate-fade-in group"
            >
                <div className="bg-gradient-to-tr from-blue-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16L12 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <path d="M9 13L12 16L15 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 20H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="hidden group-hover:block pr-2">Install App</span>
            </button>

            {/* iOS Instructions Modal */}
            {showIOSInstruction && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowIOSInstruction(false)}>
                    <div
                        className="bg-[#1a1a1a] border border-white/10 text-white p-6 rounded-2xl max-w-sm w-full shadow-2xl relative animate-slide-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowIOSInstruction(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-2">Install Headhunt</h3>
                            <p className="text-gray-400 text-sm">Add this app to your home screen for the best experience.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-sm font-bold">1</span>
                                <p className="text-sm">Tap the <Share size={16} className="inline mx-1" /> Share button in your browser provided options.</p>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-sm font-bold">2</span>
                                <p className="text-sm">Scroll down and select <span className="font-bold">Add to Home Screen</span>.</p>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowIOSInstruction(false)}
                                className="text-blue-400 text-sm font-medium hover:text-blue-300"
                            >
                                Got it
                            </button>
                        </div>

                        {/* Pointing Arrow Animation for Safari Bottom Bar */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white">
                            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallPWA;
