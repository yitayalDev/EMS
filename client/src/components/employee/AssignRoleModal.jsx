import { useState } from 'react';
import api from '../../utils/api';

const ROLES = [
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR Manager' },
    { value: 'finance', label: 'Finance/Payroll Officer' },
    { value: 'it_admin', label: 'IT Admin' },
    { value: 'employee', label: 'Employee' }
];

const PERMISSIONS = [
    { value: 'manage_users', label: 'Manage Users (Add/Edit)' },
    { value: 'delete_records', label: 'Delete Records (Employees etc)' },
    { value: 'view_salary', label: 'View Salary Records' },
    { value: 'manage_salary', label: 'Manage Salaries (Add/Edit)' },
    { value: 'manage_leaves', label: 'Manage Leaves (Approve/Reject)' }
];

const AssignRoleModal = ({ employee, onClose, onUpdate }) => {
    const [role, setRole] = useState(employee?.user?.role || 'employee');
    const [permissions, setPermissions] = useState(employee?.user?.permissions || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleValidation = () => {
        // Basic validation / warnings could go here
        return true;
    };

    const handlePermissionToggle = (perm) => {
        if (permissions.includes(perm)) {
            setPermissions(permissions.filter(p => p !== perm));
        } else {
            setPermissions([...permissions, perm]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleValidation()) return;

        setLoading(true);
        setError('');

        try {
            const { data } = await api.put(`/employees/${employee._id}/permissions`, {
                role,
                permissions
            });
            onUpdate(data.user);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update roles and permissions');
        } finally {
            setLoading(false);
        }
    };

    if (!employee) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-200 dark:border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Manage Roles & Permissions
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            System Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {ROLES.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                            Roles provide default access to various dashboard sections.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Custom Permissions
                        </label>
                        <div className="space-y-3">
                            {PERMISSIONS.map(perm => (
                                <label key={perm.value} className="flex items-start gap-3 cursor-pointer group">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={permissions.includes(perm.value)}
                                            onChange={() => handlePermissionToggle(perm.value)}
                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-indigo-500 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {perm.label}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Allows the user to {perm.label.toLowerCase()}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all
                ${loading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25'
                                }`}
                        >
                            {loading ? 'Saving...' : 'Save Permissions'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignRoleModal;
