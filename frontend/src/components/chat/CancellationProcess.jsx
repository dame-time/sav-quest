import { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

export const CancellationProcess = ({ subscription, onComplete }) => {
    const [steps, setSteps] = useState([
        { id: 'connecting', status: 'pending', message: 'Connecting to your bank...' },
        { id: 'processing', status: 'pending', message: `Cancelling ${subscription} subscription...` },
        { id: 'confirming', status: 'pending', message: 'Confirming cancellation...' }
    ]);

    useEffect(() => {
        // Simulate the cancellation process with delays
        const runProcess = async () => {
            // Step 1: Connecting
            setSteps(prev => prev.map(s =>
                s.id === 'connecting' ? { ...s, status: 'in_progress' } : s
            ));

            await new Promise(r => setTimeout(r, 1500));

            setSteps(prev => prev.map(s =>
                s.id === 'connecting' ? { ...s, status: 'completed' } : s
            ));

            // Step 2: Processing
            setSteps(prev => prev.map(s =>
                s.id === 'processing' ? { ...s, status: 'in_progress' } : s
            ));

            await new Promise(r => setTimeout(r, 2000));

            setSteps(prev => prev.map(s =>
                s.id === 'processing' ? { ...s, status: 'completed' } : s
            ));

            // Step 3: Confirming
            setSteps(prev => prev.map(s =>
                s.id === 'confirming' ? { ...s, status: 'in_progress' } : s
            ));

            await new Promise(r => setTimeout(r, 1500));

            setSteps(prev => prev.map(s =>
                s.id === 'confirming' ? { ...s, status: 'completed' } : s
            ));

            // Complete the process
            await new Promise(r => setTimeout(r, 1000));
            onComplete();
        };

        runProcess();
    }, [subscription, onComplete]);

    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Cancellation in progress</h3>
            <div className="space-y-3">
                {steps.map(step => (
                    <div
                        key={step.id}
                        className={`flex items-center ${step.status === 'completed'
                                ? 'text-green-400'
                                : step.status === 'in_progress'
                                    ? 'text-blue-400'
                                    : 'text-zinc-500'
                            }`}
                    >
                        {step.status === 'completed' ? (
                            <FiCheckCircle className="mr-2" />
                        ) : step.status === 'in_progress' ? (
                            <div className="mr-2 w-4 h-4 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></div>
                        ) : (
                            <FiClock className="mr-2" />
                        )}
                        <span>{step.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}; 