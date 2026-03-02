import { useState, useEffect } from "react";
import api from "../../utils/api";

const BillingDashboard = () => {
    const [status, setStatus] = useState(null);
    const [plans, setPlans] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Check URL for Stripe redirect status
        const query = new URLSearchParams(window.location.search);
        if (query.get("success")) {
            setMessage("Subscription successful! Your account has been upgraded.");
        }
        if (query.get("canceled")) {
            setMessage("Checkout canceled. Your current plan was not changed.");
        }

        const loadBillingData = async () => {
            try {
                const [statusRes, plansRes, invoicesRes] = await Promise.all([
                    api.get('/subscription/status'),
                    api.get('/subscription/plans'),
                    api.get('/subscription/invoices')
                ]);
                setStatus(statusRes.data);
                setPlans(plansRes.data);
                setInvoices(invoicesRes.data || []);
            } catch (err) {
                console.error("Failed to load billing data", err);
            } finally {
                setLoading(false);
            }
        };
        loadBillingData();
    }, []);

    const handleUpgrade = async (planName) => {
        setCheckoutLoading(true);
        try {
            const { data } = await api.post('/subscription/checkout', { plan: planName });
            window.location.href = data.url; // Redirect to Stripe
        } catch (err) {
            console.error(err);
            alert('Failed to initiate checkout. Please try again.');
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center p-8 text-gray-500">Loading Billing Data...</div>;
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Billing & Subscription</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your company's plan, billing history, and upgrades.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl shadow-sm border ${message.includes('success') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                    {message}
                </div>
            )}

            {/* Current Plan Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-1">Current Plan</h3>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                            {status?.plan || 'Starter'}
                        </span>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${status?.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'} border`}>
                            {status?.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                    </div>
                    {status?.currentPeriodEnd && (
                        <p className="text-sm text-gray-500 mt-2">
                            Renews on {new Date(status.currentPeriodEnd).toLocaleDateString()}
                        </p>
                    )}
                </div>
                {status?.plan !== 'Enterprise' && (
                    <button
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                        onClick={() => {
                            document.getElementById('pricing-tiers').scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Upgrade Plan
                    </button>
                )}
            </div>

            {/* Pricing Tiers */}
            <div id="pricing-tiers">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Subscription Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans && Object.entries(plans).map(([name, details]) => (
                        <div
                            key={name}
                            className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border-2 transition-transform hover:-translate-y-1 ${status?.plan === name
                                    ? 'border-indigo-500 scale-[1.02] shadow-indigo-500/20'
                                    : 'border-gray-100 dark:border-gray-700'
                                }`}
                        >
                            {status?.plan === name && (
                                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                    CURRENT
                                </div>
                            )}
                            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{name}</h4>
                            <div className="my-4">
                                <span className="text-4xl font-black text-gray-900 dark:text-white">${details.price}</span>
                                <span className="text-gray-500">/mo</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {details.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <svg className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                disabled={status?.plan === name || checkoutLoading}
                                onClick={() => handleUpgrade(name)}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${status?.plan === name
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:bg-indigo-900/30 dark:hover:bg-indigo-600'
                                    }`}
                            >
                                {checkoutLoading ? 'Processing...' : (status?.plan === name ? 'Current Plan' : 'Select ' + name)}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoices Table */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Billing History</h3>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                    {invoices.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No invoices found.</div>
                    ) : (
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-600 dark:text-gray-300">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${inv.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full border ${inv.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                {inv.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {inv.pdfUrl && (
                                                <a
                                                    href={inv.pdfUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                                >
                                                    Download PDF
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingDashboard;
