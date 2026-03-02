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
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });

const AttendanceList = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('month');
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [range, setRange] = useState({ startDate: '', endDate: '' });

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ period });
            if (statusFilter) params.append('status', statusFilter);
            const { data } = await api.get(`/attendance?${params}`);
            setRecords(data.records || []);
            setRange({ startDate: data.startDate, endDate: data.endDate });
        } catch {
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, [period, statusFilter]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const filtered = search
        ? records.filter((r) =>
            r.employee?.name?.toLowerCase().includes(search.toLowerCase()) ||
            r.employee?.email?.toLowerCase().includes(search.toLowerCase())
        )
        : records;

    const totalHours = filtered.reduce((s, r) => s + (r.workHours || 0), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Attendance Records</h1>
                    {range.startDate && (
                        <p className="text-sm text-gray-500 mt-1">
                            {fmtDate(range.startDate)} – {fmtDate(range.endDate)}
                        </p>
                    )}
                </div>

                {/* Period toggle */}
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    {['week', 'month'].map((p) => (
                        <button
                            key={p}
                            id={`admin-period-${p}`}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${period === p
                                    ? 'bg-white dark:bg-gray-700 shadow text-sky-600 dark:text-sky-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    id="attendance-search"
                    type="text"
                    placeholder="Search employee name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <select
                    id="attendance-status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                    <option value="">All Statuses</option>
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                </select>
            </div>

            {/* Stats strip */}
            {!loading && (
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span><strong className="text-gray-800 dark:text-gray-200">{filtered.length}</strong> records</span>
                    <span><strong className="text-sky-600">{filtered.filter((r) => r.status === 'present').length}</strong> present</span>
                    <span><strong className="text-amber-500">{filtered.filter((r) => r.status === 'late').length}</strong> late</span>
                    <span><strong className="text-red-500">{filtered.filter((r) => r.status === 'absent').length}</strong> absent</span>
                    <span><strong className="text-emerald-600">{totalHours.toFixed(1)}h</strong> total</span>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="text-center py-16 text-gray-400 animate-pulse">Loading attendance…</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">No records found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-5 py-3 text-left">Employee</th>
                                    <th className="px-5 py-3 text-left">Department</th>
                                    <th className="px-5 py-3 text-left">Date</th>
                                    <th className="px-5 py-3 text-left">Check In</th>
                                    <th className="px-5 py-3 text-left">Check Out</th>
                                    <th className="px-5 py-3 text-left">Hours</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filtered.map((r) => (
                                    <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-gray-800 dark:text-gray-200">{r.employee?.name}</div>
                                            <div className="text-xs text-gray-400">{r.employee?.email}</div>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400 text-xs">
                                            {r.employee?.department?.dep_name || '—'}
                                        </td>
                                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{fmtDate(r.date)}</td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{fmt(r.checkIn)}</td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{fmt(r.checkOut)}</td>
                                        <td className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">
                                            {r.workHours ? `${r.workHours}h` : '—'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[r.status] || ''}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-gray-400 font-mono">{r.ipAddress || '—'}</td>
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

export default AttendanceList;
