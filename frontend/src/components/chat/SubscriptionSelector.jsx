import { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

export const SubscriptionSelector = ({ subscriptions, onCancel, onClose }) => {
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleSelect = (subscription) => {
        setSelectedSubscription(subscription);
        setIsConfirming(true);
    };

    const handleConfirm = () => {
        onCancel(selectedSubscription);
    };

    const handleBack = () => {
        setIsConfirming(false);
        setSelectedSubscription(null);
    };

    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
            {!isConfirming ? (
                <>
                    <h3 className="text-lg font-medium mb-3">Select a subscription to cancel:</h3>
                    <div className="space-y-2 mb-4">
                        {Object.entries(subscriptions).map(([name, details]) => (
                            <button
                                key={name}
                                onClick={() => handleSelect(name)}
                                className="w-full flex justify-between items-center p-3 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
                            >
                                <span className="font-medium capitalize">{name}</span>
                                <span className="text-blue-400">${details.monthly_cost.toFixed(2)}/mo</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-zinc-400 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-lg font-medium mb-3">Confirm cancellation</h3>
                    <p className="mb-4">
                        Are you sure you want to cancel your <span className="text-blue-400 capitalize">{selectedSubscription}</span> subscription?
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 text-zinc-400 hover:text-white"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center"
                        >
                            <FiX className="mr-1" /> Cancel Subscription
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}; 