import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import api from '../../utils/api.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = [
    '#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4',
];

const DashboardCharts = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchCharts = async () => {
            try {
                const { data } = await api.get('/dashboard/charts');
                setChartData(data);
            } catch {
                // ignore
            }
        };
        fetchCharts();
    }, []);

    if (!chartData) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const pieData = {
        labels: chartData.employeesByDept.labels,
        datasets: [{
            data: chartData.employeesByDept.data,
            backgroundColor: COLORS.slice(0, chartData.employeesByDept.labels.length),
            borderWidth: 2,
            borderColor: '#fff',
        }],
    };

    const doughnutData = {
        labels: chartData.leaveStatus.labels,
        datasets: [{
            data: chartData.leaveStatus.data,
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
            borderWidth: 2,
            borderColor: '#fff',
        }],
    };

    const barData = {
        labels: chartData.monthlySalary.labels,
        datasets: [{
            label: 'Total Salary (ETB)',
            data: chartData.monthlySalary.data,
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: '#6366f1',
            borderWidth: 2,
            borderRadius: 6,
        }],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { callback: (v) => v.toLocaleString() } },
        },
    };

    const cardClass =
        'bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col items-center transition-all duration-300 hover:shadow-lg';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fadeIn">
            {/* Employees by Department */}
            <div className={cardClass}>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm">
                    Employees by Department
                </h3>
                <div className="w-full max-w-[220px]">
                    <Pie data={pieData} />
                </div>
            </div>

            {/* Leave Status */}
            <div className={cardClass}>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm">
                    Leave Status Breakdown
                </h3>
                <div className="w-full max-w-[220px]">
                    <Doughnut data={doughnutData} />
                </div>
            </div>

            {/* Monthly Salary */}
            <div className={cardClass}>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm">
                    Monthly Salary (Last 6 Months)
                </h3>
                <div className="w-full h-[200px]">
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
      `}</style>
        </div>
    );
};

export default DashboardCharts;
