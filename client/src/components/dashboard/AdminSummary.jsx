import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import SummaryCard from './SummaryCard.jsx';
import NoticeBoard from './NoticeBoard.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ActivityFeed from './ActivityFeed.jsx';
import { Calendar, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldCheck } from 'lucide-react';

const AdminSummary = () => {
  const { t } = useTranslation();
  const { user, can } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
  });

  const [deptData, setDeptData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, deptRes] = await Promise.all([
          api.get('dashboard/admin'),
          api.get('dashboard/analytics/departments')
        ]);
        setStats(summaryRes.data);
        setDeptData(deptRes.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 p-2"
    >
      {/* Premium Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 text-indigo-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
            <Sparkles size={12} />
            Enterprise Suite v2.0
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">
            Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 17 ? 'afternoon' : 'evening'}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{user?.name?.split(' ')[0] || 'Admin'}</span>
          </h1>
          <p className="text-gray-500 font-medium flex items-center gap-2 mt-2">
            <Calendar size={16} />
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            <span className="text-indigo-400 font-bold ml-2">[{currentTime.toLocaleTimeString()}]</span>
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-4 shadow-xl"
        >
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">System Status</p>
            <p className="text-sm font-black text-green-500 flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Operational
            </p>
          </div>
          <div className="h-10 w-px bg-gray-200 dark:bg-gray-700" />
          <button className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all">
            <ArrowUpRight size={20} />
          </button>
        </motion.div>
      </div>

      {/* Summary Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <SummaryCard label={t('dashboard.totalEmployees')} value={stats.totalEmployees} color="teal" />
        <SummaryCard label={t('dashboard.departments')} value={stats.totalDepartments} color="purple" />
        <SummaryCard label={t('dashboard.pendingLeaves')} value={stats.pendingLeaves} color="orange" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notice Board - Now 1 Column */}
        <motion.div variants={itemVariants} className="lg:col-span-1 h-[550px]">
          <NoticeBoard />
        </motion.div>

        {/* Analytics Card - Now 1 Column */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 bg-white/5 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border-2 border-white/10 p-6 flex flex-col h-[550px]"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">{t('dashboard.employeeDistribution')}</h2>
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <BarChart size={18} className="text-indigo-500" />
            </div>
          </div>

          <div className="flex-1 min-h-0">
            {can('view_analytics') ? (
              deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8884d8" strokeOpacity={0.1} />
                    <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                    <Bar dataKey="employees" name="Employees" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={24} />
                    <Bar dataKey="leaves" name="Leaves" fill="#f59e0b" radius={[8, 8, 8, 8]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center italic text-gray-500 text-sm">No data available</div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center space-y-4">
                <ShieldCheck size={48} className="opacity-20" />
                <p className="text-sm font-medium">Analytics restricted to authorized personnel only.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Live Activity Feed - New Component */}
        <motion.div variants={itemVariants} className="lg:col-span-1 h-[550px]">
          <ActivityFeed />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminSummary;
