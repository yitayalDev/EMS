import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const Analytics = () => {
    const [salaryData, setSalaryData] = useState([]);
    const [leaveData, setLeaveData] = useState({ byType: [], byMonth: [] });
    const [deptData, setDeptData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const [salRes, leaveRes, deptRes, attRes, growthRes] = await Promise.all([
                    api.get('/dashboard/analytics/salary'),
                    api.get('/dashboard/analytics/leaves'),
                    api.get('/dashboard/analytics/departments'),
                    api.get('/dashboard/analytics/attendance'),
                    api.get('/dashboard/analytics/growth')
                ]);
                setSalaryData(salRes.data || []);
                setLeaveData(leaveRes.data || { byType: [], byMonth: [] });
                setDeptData(deptRes.data || []);
                setAttendanceData(attRes.data || []);
                setGrowthData(growthRes.data || []);
            } catch (err) {
                console.error('Analytics fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
                                {entry.name.includes('Rate') ? '%' : ''}
                            </p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Generating insights...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Advanced <span className="text-indigo-500">Analytics</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Workforce insights and performance metrics.</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                    Last 12 Months Report
                </div>
            </div>

            {/* MAIN CHART: Salary Trends */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Financial Trends</h2>
                            <p className="text-sm text-gray-500 mt-1">Monthly disbursement across the organization.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Net Salary</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic Pay</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-96 w-full">
                        <ResponsiveContainer>
                            <AreaChart data={salaryData}>
                                <defs>
                                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBasic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickMargin={12} />
                                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="totalNet" name="Net Salary" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
                                <Area type="monotone" dataKey="totalBasic" name="Basic Pay" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorBasic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Trends */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Attendance & Productivity</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer>
                            <AreaChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} hide />
                                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area yAxisId="left" type="monotone" dataKey="attendanceRate" name="Attendance Rate" stroke="#10b981" strokeWidth={3} fill="#10b981" fillOpacity={0.05} />
                                <Area yAxisId="right" type="monotone" dataKey="avgWorkHours" name="Avg Work Hours" stroke="#f59e0b" strokeWidth={3} fill="#f59e0b" fillOpacity={0.05} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed font-bold uppercase tracking-[0.2em]">30-Day Activity Heatmap</p>
                </div>

                {/* Leave Approvals (Stacked Bar) */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Leave Management Pulse</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer>
                            <BarChart data={leaveData.byMonth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="approved" name="Approved" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Workforce Distribution</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer>
                            <BarChart data={deptData} layout="vertical">
                                <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} hide />
                                <YAxis dataKey="department" type="category" stroke="#9ca3af" fontSize={10} width={100} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="employees" name="Headcount" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Hiring Growth */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Growth Velocity</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer>
                            <BarChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="hires" name="New Hires" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
