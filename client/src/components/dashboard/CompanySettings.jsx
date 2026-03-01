import { useState } from 'react';
import api from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const CompanySettings = () => {
    const { user, updateUser } = useAuth();
    const [companyName, setCompanyName] = useState(user?.companyName || '');
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(user?.companyLogo ? `${API_BASE_URL}${user.companyLogo}` : null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('companyName', companyName);
        if (logo) formData.append('logo', logo);

        try {
            const { data } = await api.put('settings/branding', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Branding updated successfully!');
            updateUser({
                companyName: data.settings.companyName,
                companyLogo: data.settings.companyLogo
            });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update branding');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Company Branding</h2>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'} border`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="e.g. Acme Corp"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Logo</label>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
                            {preview ? (
                                <img src={preview} alt="Logo Preview" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-xs">No Logo</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  dark:file:bg-indigo-900/40 dark:file:text-indigo-300
                  hover:file:bg-indigo-100"
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">PNG, JPG or SVG. Max 2MB.</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                >
                    {loading ? 'Saving Changes...' : 'Save Branding Settings'}
                </button>
            </form>
        </div>
    );
};

export default CompanySettings;
