
const StatCard = ({ icon, title, value, trend, color }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center">
            <div className={`rounded-full p-3 mr-4 ${color}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <div className="flex items-center mt-1">
                    <span className="text-xl font-bold text-gray-800">{value}</span>
                    {trend && (
                        <span className={`ml-2 text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend > 0 ? `+${trend}%` : `${trend}%`}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;