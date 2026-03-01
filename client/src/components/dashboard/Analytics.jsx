import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const Analytics = () => {
    const [salaryData, setSalaryData] = useState([]);
    const [leaveData, setLeaveData] = useState({ byType: [], byMonth: [] });
    const [deptData, setDeptData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const [salRes, leaveRes, deptRes] = await Promise.all([
                    api.get('/dashboard/analytics/salary'),
                    api.get('/dashboard/analytics/leaves'),
                    api.get('/dashboard/analytics/departments')
                ]);
                setSalaryData(salRes.data || []);
                setLeaveData(leaveRes.data || { byType: [], byMonth: [] });
                setDeptData(deptRes.data || []);
            } catch (err) {
                console.error('Analytics fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500 animate-pulse">
                Loading analytics...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Reporting & Analytics</h1>

            {/* TIER 1: Salary over time (Area Chart) */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Salary Spending</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer>
                        <AreaChart data={salaryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorBasic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                            />
                            <Legend iconType="circle" />
                            <Area type="monotone" dataKey="totalBasic" name="Basic Pay" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorBasic)" />
                            <Area type="monotone" dataKey="totalNet" name="Net Salary" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorNet)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* TIER 2: Leave Frequency by Type (Pie Chart) */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Leave Types Overview</h2>
                    <div className="h-72 w-full flex justify-center items-center">
                        {leaveData.byType.length > 0 ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={leaveData.byType}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {leaveData.byType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400">No leave data available</div>
                        )}
                    </div>
                </div>

                {/* TIER 2: Department Distribution (Bar Chart) */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Department Distribution</h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer>
                            <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={30}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="department" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" orientation="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" />
                                <Bar yAxisId="left" dataKey="employees" name="Employees" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="leaves" name="Leaves Taken" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
