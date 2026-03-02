import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api.js';

const statusColors = {
    present: 'bg-green-100 text-green-700 border-green-200',
    late: 'bg-amber-100 text-amber-700 border-amber-200',
    absent: 'bg-red-100 text-red-700 border-red-200',
};

const fmt = (d) =>
    d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

const Attendance = () => {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');

    const fetchToday = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/attendance/today');
            setRecord(data.record);
        } catch {
            setRecord(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchToday(); }, [fetchToday]);

    const notify = (text, type = 'success') => {
        setMessage(text);
        setMsgType(type);
        setTimeout(() => setMessage(''), 4000);
    };

    const handleCheckIn = async () => {
        setBusy(true);
        try {
            let lat, lng;
            if (navigator.geolocation) {
                await new Promise((resolve) =>
                    navigator.geolocation.getCurrentPosition(
                        (pos) => { lat = pos.coords.latitude; lng = pos.coords.longitude; resolve(); },
                        () => resolve() // proceed without GPS if denied
                    )
                );
            }
            const { data } = await api.post('/attendance/check-in', { lat, lng });
            setRecord(data.record);
            notify('Checked in successfully! Have a productive day 🎉');
        } catch (err) {
            notify(err.response?.data?.message || 'Check-in failed.', 'error');
        } finally {
            setBusy(false);
        }
    };

    const handleCheckOut = async () => {
        setBusy(true);
        try {
            const { data } = await api.post('/attendance/check-out');
            setRecord(data.record);
            notify(`Checked out! You worked ${data.record.workHours} hrs today 👋`);
        } catch (err) {
            notify(err.response?.data?.message || 'Check-out failed.', 'error');
        } finally {
            setBusy(false);
        }
    };

    const hasCheckedIn = record?.checkIn;
    const hasCheckedOut = record?.checkOut;

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Attendance</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{today}</p>
            </div>

            {/* Notification */}
            {message && (
                <div className={`text-sm rounded-lg px-4 py-3 border ${msgType === 'error'
                        ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                    {message}
                </div>
            )}

            {/* Today's card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-gray-700 dark:text-gray-200">Today's Status</h2>
                    {record?.status && (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColors[record.status]}`}>
                            {record.status}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-400 animate-pulse">Loading…</div>
                ) : (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {/* Check-in */}
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check In</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{fmt(record?.checkIn)}</p>
                        </div>
                        {/* Check-out */}
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check Out</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{fmt(record?.checkOut)}</p>
                        </div>
                        {/* Hours */}
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Hours</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {record?.workHours ? `${record.workHours}h` : '—'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                {!loading && (
                    <div className="flex justify-center">
                        {!hasCheckedIn ? (
                            <button
                                id="btn-check-in"
                                onClick={handleCheckIn}
                                disabled={busy}
                                className="px-10 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:from-green-500 hover:to-emerald-600 active:scale-95 transition-all duration-200 disabled:opacity-60"
                            >
                                {busy ? 'Processing…' : '🟢 Check In'}
                            </button>
                        ) : !hasCheckedOut ? (
                            <button
                                id="btn-check-out"
                                onClick={handleCheckOut}
                                disabled={busy}
                                className="px-10 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg hover:from-orange-500 hover:to-red-500 active:scale-95 transition-all duration-200 disabled:opacity-60"
                            >
                                {busy ? 'Processing…' : '🔴 Check Out'}
                            </button>
                        ) : (
                            <div className="text-center">
                                <span className="text-4xl">✅</span>
                                <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium">Attendance complete for today!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* IP / Geo info */}
            <p className="text-xs text-center text-gray-400 dark:text-gray-600">
                Check-in may be restricted to your office network / location.
                Your GPS is only used to verify you are on-site and is never stored permanently.
            </p>
        </div>
    );
};

export default Attendance;
