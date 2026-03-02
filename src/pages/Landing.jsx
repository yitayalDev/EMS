import { Link } from "react-router-dom";
import { CheckCircle, Users, Calendar, DollarSign, Shield, Zap } from "lucide-react";

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-200">
            {/* Navbar */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                EMS.
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition">Features</a>
                            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 font-medium transition">Pricing</a>
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition">Login</Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-50 to-transparent -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 drop-shadow-sm">
                        Manage your team with <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            effortless precision.
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto mb-10">
                        Streamline human resources, automate payroll, and track attendance seamlessly. The ultimate Employee Management System built for modern enterprises.
                    </p>
                    <div className="flex justify-center flex-col sm:flex-row gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-3.5 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 border-2 border-gray-200 text-lg font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to scale
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
                                <div className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-6 text-2xl">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Simple, transparent pricing
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            No hidden fees. Cancel anytime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricing.map((plan, idx) => (
                            <div key={idx} className={`rounded-3xl p-8 ${plan.popular ? 'bg-indigo-600 text-white shadow-2xl scale-105 transform' : 'bg-white text-gray-900 shadow-xl border border-gray-100'} flex flex-col`}>
                                {plan.popular && <span className="bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full self-start mb-4">Most Popular</span>}
                                <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                                    ${plan.price}
                                    <span className={`ml-1 text-xl font-medium ${plan.popular ? 'text-indigo-200' : 'text-gray-500'}`}>/mo</span>
                                </div>
                                <p className={`mt-4 ${plan.popular ? 'text-indigo-100' : 'text-gray-500'}`}>{plan.desc}</p>

                                <ul className="mt-8 space-y-4 flex-1">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center">
                                            <CheckCircle className={`w-5 h-5 mr-3 ${plan.popular ? 'text-indigo-300' : 'text-indigo-500'}`} />
                                            <span className={plan.popular ? 'text-white' : 'text-gray-600'}>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/register"
                                    className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-full text-center font-bold text-lg transition ${plan.popular
                                            ? 'bg-white text-indigo-600 hover:bg-gray-50'
                                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-8 md:mb-0">
                        <span className="text-2xl font-extrabold text-indigo-600">EMS.</span>
                        <p className="mt-2 text-gray-500 text-sm">Empowering modern teams.</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} EMS Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const features = [
    {
        icon: <Users />,
        title: "Employee Directory",
        desc: "Maintain a centralized, secure database of all employees, roles, and personal information."
    },
    {
        icon: <Calendar />,
        title: "Attendance & Leaves",
        desc: "Track daily attendance and manage leave requests with an intuitive approval workflow."
    },
    {
        icon: <DollarSign />,
        title: "Payroll Management",
        desc: "Automate salary calculations, deductions, and generate professional payslips instantly."
    },
    {
        icon: <Shield />,
        title: "Role-Based Access",
        desc: "Granular permissions ensure that HR, Finance, and Admins only see what they need to see."
    },
    {
        icon: <Zap />,
        title: "Real-time Analytics",
        desc: "Gain actionable insights with visual dashboards tracking headcounts and pending tasks."
    },
    {
        icon: <CheckCircle className="text-indigo-600" />,
        title: "Inter-Office Announcements",
        desc: "Keep everyone in the loop with a built-in notice board right on their dashboard."
    }
];

const pricing = [
    {
        name: "Starter",
        price: "0",
        desc: "Perfect for small teams getting started.",
        features: ["Up to 10 Employees", "Basic Analytics", "Leave Management", "Community Support"],
        popular: false,
        cta: "Start Free"
    },
    {
        name: "Pro",
        price: "49",
        desc: "For growing companies that need more power.",
        features: ["Up to 100 Employees", "Advanced Analytics", "Payroll Integration", "Priority Email Support"],
        popular: true,
        cta: "Get Started"
    },
    {
        name: "Enterprise",
        price: "199",
        desc: "Advanced features for large organizations.",
        features: ["Unlimited Employees", "Custom Branding", "Dedicated Account Manager", "SSO Integration"],
        popular: false,
        cta: "Contact Sales"
    }
];

export default Landing;
