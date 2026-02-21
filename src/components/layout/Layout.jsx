import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ROUTES } from '../../config/routes';
import InstallPWA from './InstallPWA';

const Layout = () => {
    const location = useLocation();
    const hideNavCompletely = location.pathname === ROUTES.HOME;
    const hideNavInitially = [
        ROUTES.EXPLORE,
        ROUTES.EVENTS,
        ROUTES.JOBS,
        ROUTES.NETWORK,
        ROUTES.ABOUT
    ].includes(location.pathname);

    const [showNav, setShowNav] = useState(!hideNavInitially && !hideNavCompletely);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show nav when scrolling up, hide when scrolling down
            if (currentScrollY < lastScrollY) {
                if (!hideNavCompletely) setShowNav(true);
            } else if (currentScrollY > 100) {
                // Only hide if we've scrolled down past 100px
                setShowNav(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <InstallPWA />
            <div className="fixed inset-0 bg-[url('/assets/noise.svg')] opacity-20 pointer-events-none z-50"></div>
            {/* Rest of the layout */}

            {!hideNavCompletely && <nav
                className="fixed top-0 w-full z-40 border-b border-white/10 bg-black/50 backdrop-blur-md transition-transform duration-300 ease-in-out"
                style={{
                    transform: showNav ? 'translateY(0)' : 'translateY(-100%)'
                }}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    <Link to={ROUTES.EXPLORE} className="flex items-center gap-2 font-bold tracking-tighter text-xl hover:opacity-80 transition-opacity flex-shrink-0">
                        <img src="/assets/logo.svg" alt="Headhunt Logo" className="w-8 h-8" />
                        <span className="hidden sm:inline">HEADHUNT</span>
                    </Link>
                    <div className="flex flex-nowrap gap-6 text-sm font-medium text-gray-400 overflow-x-auto no-scrollbar py-2 ml-auto">
                        <Link to={ROUTES.EVENTS} className="hover:text-white transition-colors whitespace-nowrap">EVENTS</Link>
                        <Link to={ROUTES.JOBS} className="hover:text-white transition-colors whitespace-nowrap">JOBS</Link>
                        <Link to={ROUTES.NETWORK} className="hover:text-white transition-colors whitespace-nowrap">REFERRAL</Link>
                    </div>
                </div>
            </nav>}

            <main className={`${(hideNavInitially || hideNavCompletely) ? 'pt-6' : 'pt-24'} pb-20 px-6 max-w-7xl mx-auto relative z-10`}>
                {/* React Router Outlet is handled in App.jsx by child routes, 
            but here we expect children if used as wrapper, 
            or we need to use <Outlet /> if using Layout route.
            Let's adjust App.jsx or here. App.jsx uses Layout as a layout route wrapper.
        */}
                <div className="animate-fade-in">
                    {/* If Layout is used as a wrapper in App.jsx via <Route element={<Layout/>}> <Outlet/> </Route> 
               we need to render Outlet. But my App.jsx above acts as if Layout wraps content?
               Wait, in App.jsx: <Route path="/" element={<Layout />}>...
               So Layout needs to render <Outlet />.
            */}
                    {/* Fixing below in next edit or assume I fix it here */}
                    <Outlet />
                </div>
            </main>

            {location.pathname !== ROUTES.ABOUT && (
                <footer className="border-t border-white/10 py-12 mt-20">
                    <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                        <p>© 2026 Headhunt. All rights reserved.</p>
                        <div className="mt-2">
                            <Link to={ROUTES.SITEMAP} className="hover:text-gray-400 text-xs">
                                Sitemap
                            </Link>
                        </div>
                        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
                            <Link to={ROUTES.LEGAL_PRIVACY} className="hover:text-gray-400">Privacy Policy</Link>
                            <span>•</span>
                            <Link to={ROUTES.LEGAL_TERMS} className="hover:text-gray-400">Terms of Service</Link>
                            <span>•</span>
                            <Link to={ROUTES.LEGAL_COOKIES} className="hover:text-gray-400">Cookie Policy</Link>
                        </div>
                        <p className="mt-4 text-xs text-gray-600 max-w-3xl mx-auto">
                            Headhunt is a recruitment platform connecting employers with talent. We are not a law firm or staffing agency.
                            All information provided is for general informational purposes only. Use of this platform constitutes acceptance of our Terms of Service.
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;
