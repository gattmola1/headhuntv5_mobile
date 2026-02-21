import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes';

const Sitemap = () => {
    const sections = [
        {
            title: 'Main Pages',
            links: [
                { path: ROUTES.HOME, label: 'Homepage' },
                { path: ROUTES.EXPLORE, label: 'Explore' },
                { path: ROUTES.EVENTS, label: 'Events' },
                { path: ROUTES.JOBS, label: 'Jobs' },
                { path: ROUTES.NETWORK, label: 'Referral Network' },
            ],
        },
        {
            title: 'Information',
            links: [
                { path: ROUTES.ABOUT, label: 'About Us' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { path: ROUTES.LEGAL, label: 'Legal Information' },
                { path: ROUTES.LEGAL_PRIVACY, label: 'Privacy Policy' },
                { path: ROUTES.LEGAL_TERMS, label: 'Terms of Service' },
                { path: ROUTES.LEGAL_COOKIES, label: 'Cookie Policy' },
            ],
        },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Sitemap
                </h1>
                <p className="text-gray-400">
                    A comprehensive directory of all pages on Headhunt
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {sections.map((section) => (
                    <div
                        key={section.title}
                        className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
                    >
                        <h2 className="text-xl font-bold mb-4 text-white">
                            {section.title}
                        </h2>
                        <ul className="space-y-2">
                            {section.links.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link
                    to={ROUTES.HOME}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Homepage
                </Link>
            </div>
        </div>
    );
};

export default Sitemap;
