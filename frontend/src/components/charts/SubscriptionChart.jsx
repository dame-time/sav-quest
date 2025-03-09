import { useState, useEffect } from 'react';

export const SubscriptionChart = ({ data }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [totals, setTotals] = useState({ monthly: 0, annual: 0 });

    useEffect(() => {
        if (data) {
            // Format subscription data for display
            const formattedSubscriptions = Object.entries(data.subscriptions).map(([name, details]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                ...details
            }));

            setSubscriptions(formattedSubscriptions);
            setTotals({
                monthly: data.monthlyTotal,
                annual: data.annualTotal
            });
        }
    }, [data]);

    // Generate colors for the subscription bars
    const getColor = (index) => {
        const colors = [
            "#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981",
            "#3B82F6", "#8B5CF6", "#F43F5E", "#FBBF24", "#34D399"
        ];

        return colors[index % colors.length];
    };

    return (
        <div className="w-full">
            <div className="space-y-3">
                {subscriptions.map((subscription, index) => (
                    <div key={index} className="bg-zinc-800/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{subscription.name}</span>
                            <span className="font-bold">${subscription.monthly_cost.toFixed(2)}/mo</span>
                        </div>

                        <div className="h-2 w-full bg-zinc-700 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${(subscription.monthly_cost / totals.monthly) * 100}%`,
                                    backgroundColor: getColor(index)
                                }}
                            ></div>
                        </div>

                        <div className="flex justify-between mt-1 text-xs text-zinc-400">
                            <span>Last payment: {subscription.last_payment_date}</span>
                            <span>${subscription.annual_total.toFixed(2)}/year</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-3 border-t border-zinc-700">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Monthly Total</span>
                    <span className="font-bold">${totals.monthly.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <span className="font-medium">Annual Total</span>
                    <span className="font-bold">${totals.annual.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}; 