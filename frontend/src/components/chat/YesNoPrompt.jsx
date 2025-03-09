import React from 'react';

export const YesNoPrompt = ({ question, onYes, onNo }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
            <p className="mb-4">{question}</p>
            <div className="flex space-x-3 justify-end">
                <button
                    onClick={onNo}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
                >
                    No
                </button>
                <button
                    onClick={onYes}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Yes
                </button>
            </div>
        </div>
    );
}; 