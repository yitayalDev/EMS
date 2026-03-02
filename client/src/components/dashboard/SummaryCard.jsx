import { TrendingUp, Users, Building, CalendarClock } from 'lucide-react';

const SummaryCard = ({ label, value, color }) => {
  const iconMap = {
    teal: <Users size={24} className="text-teal-400" />,
    purple: <Building size={24} className="text-purple-400" />,
    orange: <CalendarClock size={24} className="text-orange-400" />,
  };

  const gradients = {
    teal: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    purple: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    orange: 'from-orange-500/20 via-amber-500/10 to-transparent',
  };

  const borders = {
    teal: 'border-teal-500/30 group-hover:border-teal-400/50',
    purple: 'border-purple-500/30 group-hover:border-purple-400/50',
    orange: 'border-orange-500/30 group-hover:border-orange-400/50',
  };
  // Map color names to Tailwind solid background and hover classes
  const bgColors = {
    teal: 'bg-teal-500 hover:bg-teal-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white',
    orange: 'bg-orange-500 hover:bg-orange-600 text-white',
  };

  return (
    <div
      className={`relative group overflow-hidden bg-white/5 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border-2 ${borders[color] || 'border-white/10'} p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color]} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/10 dark:bg-black/20 rounded-xl border border-white/10 shadow-inner">
            {iconMap[color] || <TrendingUp size={24} className="text-white" />}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full uppercase tracking-widest border border-green-400/20">
            <TrendingUp size={10} />
            +12%
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
            {label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-gray-900 dark:text-white drop-shadow-md">
              {value}
            </span>
            <span className="text-xs text-gray-400 font-medium">total units</span>
          </div>
        </div>

        {/* Mock Sparkline for "Portfolio" Look */}
        <div className="mt-4 h-6 w-full flex items-end gap-1 opacity-50 group-hover:opacity-100 transition-all">
          {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
            <div key={i} className={`flex-1 rounded-t-sm transition-all duration-700 ${color === 'teal' ? 'bg-teal-400' : color === 'purple' ? 'bg-purple-400' : 'bg-orange-400'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
