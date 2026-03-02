import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api.js';

const statusColors = {
    present: 'bg-green-100 text-green-700',
    late: 'bg-amber-100 text-amber-700',
    absent: 'bg-red-100 text-red-700',
};

const fmt = (d) =>
    d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

const fmtDate = (s) =>
    new Date(s + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
    });

const Timesheet = () => {
    const [period, setPeriod] = useState('week');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTimesheets = useCallback(async () => {
        setLoading(true);
        try {
            const { data: res } = await api.get(`/attendance/my?period=${period}`);
            setData(res);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => { fetchTimesheets(); }, [fetchTimesheets]);

    const summary = data?.summary;
    const records = data?.records || [];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Timesheet</h1>
                    {summary && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {fmtDate(summary.startDate)} – {fmtDate(summary.endDate)}
                        </p>
                    )}
                </div>
                {/* Period toggle */}
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    {['week', 'month'].map((p) => (
                        <button
                            key={p}
                            id={`btn-period-${p}`}
                            onClick={() => setPeriod(p)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${period === p
                                    ? 'bg-white dark:bg-gray-700 shadow text-sky-600 dark:text-sky-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary cards */}
            {summary && (
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Total Hours', value: `${summary.totalHours}h`, color: 'text-sky-600' },
                        { label: 'Days Present', value: summary.daysPresent, color: 'text-green-600' },
                        { label: 'Days Absent', value: summary.daysAbsent, color: 'text-red-500' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-5 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="text-center py-16 text-gray-400 animate-pulse">Loading timesheets…</div>
                ) : records.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">No attendance records found for this {period}.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                                    <th className="px-5 py-3 text-left">Date</th>
                                    <th className="px-5 py-3 text-left">Check In</th>
                                    <th className="px-5 py-3 text-left">Check Out</th>
                                    <th className="px-5 py-3 text-left">Hours</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {records.map((r) => (
                                    <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300">{fmtDate(r.date)}</td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{fmt(r.checkIn)}</td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{fmt(r.checkOut)}</td>
                                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                                            {r.workHours ? `${r.workHours}h` : '—'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[r.status] || ''}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timesheet;
