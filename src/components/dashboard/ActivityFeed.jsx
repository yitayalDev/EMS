import { motion } from 'framer-motion';
import { Activity, CheckCircle2, UserPlus, Clock } from 'lucide-react';

const ActivityFeed = () => {
    const activities = [
        { id: 1, type: 'checkin', user: 'Zelalem Tesfaye', time: '2m ago', icon: <CheckCircle2 className="text-green-500" /> },
        { id: 2, type: 'leave', user: 'Biruk Abebe', time: '15m ago', icon: <Clock className="text-orange-500" /> },
        { id: 3, type: 'onboard', user: 'Sara Kebede', time: '1h ago', icon: <UserPlus className="text-indigo-500" /> },
    ];

    return (
        <div className="bg-white/5 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border-2 border-white/10 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Activity className="text-indigo-500" size={20} />
                    Live Activity
                </h2>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-75" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150" />
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {activities.map((act, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={act.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                    >
                        <div className="p-2 bg-white/10 rounded-lg shadow-inner">
                            {act.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {act.user} <span className="font-normal text-gray-500">
                                    {act.type === 'checkin' ? 'checked in' : act.type === 'leave' ? 'leave approved' : 'joined the team'}
                                </span>
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{act.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="mt-4 w-full py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors border-t border-white/10 pt-4 uppercase tracking-[0.2em]">
                View All Events
            </button>
        </div>
    );
};

export default ActivityFeed;
