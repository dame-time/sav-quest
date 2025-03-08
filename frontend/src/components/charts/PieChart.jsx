import { useState, useEffect } from 'react';

export const PieChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Convert data object to array format for the chart
        const processedData = Object.entries(data).map(([label, value], index) => ({
            label,
            value: Math.abs(value),
            color: getColor(index)
        }));

        setChartData(processedData);
    }, [data]);

    // Generate colors for the pie slices
    const getColor = (index) => {
        const colors = [
            "#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981",
            "#3B82F6", "#8B5CF6", "#F43F5E", "#FBBF24", "#34D399"
        ];

        return colors[index % colors.length];
    };

    // Calculate total for percentages
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    // Generate SVG paths for pie slices
    const generatePieSlices = () => {
        let cumulativePercent = 0;

        return chartData.map((item, index) => {
            const percent = item.value / total;
            const startX = Math.cos(2 * Math.PI * cumulativePercent);
            const startY = Math.sin(2 * Math.PI * cumulativePercent);

            cumulativePercent += percent;

            const endX = Math.cos(2 * Math.PI * cumulativePercent);
            const endY = Math.sin(2 * Math.PI * cumulativePercent);

            const largeArcFlag = percent > 0.5 ? 1 : 0;

            // SVG path for the slice
            const pathData = [
                `M 0 0`,
                `L ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `Z`
            ].join(' ');

            return (
                <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    transform="translate(50, 50) scale(40)"
                    stroke="#1f2937"
                    strokeWidth="0.03"
                />
            );
        });
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row items-center">
                {/* SVG Pie Chart */}
                <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
                    <svg viewBox="0 0 100 100">
                        {generatePieSlices()}
                    </svg>
                </div>

                {/* Legend */}
                <div className="mt-4 md:mt-0 md:ml-4 flex-grow">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <div
                                className="w-3 h-3 rounded-sm mr-2"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <div className="flex justify-between w-full">
                                <span className="text-sm truncate mr-2">{item.label}</span>
                                <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div className="mt-4 pt-3 border-t border-zinc-700 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
            </div>
        </div>
    );
}; 