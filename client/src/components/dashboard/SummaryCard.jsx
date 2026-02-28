const SummaryCard = ({ label, value, color }) => {
  // Map color names to Tailwind solid background and hover classes
  const bgColors = {
    teal: 'bg-teal-500 hover:bg-teal-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white',
    orange: 'bg-orange-500 hover:bg-orange-600 text-white',
  };

  return (
    <div
      className={`${bgColors[color] || 'bg-gray-500 hover:bg-gray-600 text-white'} rounded-lg shadow-md p-5 flex flex-col transition duration-300 hover:shadow-lg hover:scale-105`}
    >
      <span className="text-sm">{label}</span>
      <span className="text-3xl font-bold mt-2">{value}</span>
    </div>
  );
};

export default SummaryCard;
