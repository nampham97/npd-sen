'use client';

import React, { useState, useEffect } from 'react';

export default function FileManager() {
    const [files, setFiles] = useState<string[]>([]);
    const [question, setQuestion] = useState<string>('');
    const [gptResponse, setGptResponse] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch the existing files when the page loads
    useEffect(() => {
        fetchFiles();
    }, []);

    // Function to fetch existing files
    const fetchFiles = async () => {
        const res = await fetch('/api/read-files');
        const data = await res.json();
        setFiles(data.files || []);
    };

    // Handle AI request
    const handleAIRequest = async () => {
        if (!question) return;

        setLoading(true);
        const res = await fetch('/api/query-generator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        const data = await res.json();
        setGptResponse(data.result || 'No response from AI');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">File Manager</h1>

                {/* File List */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Danh sách file hiện có</h2>
                    <ul className="list-disc pl-6">
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <li key={index} className="text-gray-700">
                                    {file}
                                </li>
                            ))
                        ) : (
                            <p className="text-red-500">Không có file nào</p>
                        )}
                    </ul>
                </div>

                {/* Question Input */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Đặt câu hỏi</h2>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Hỏi điều gì đó về bảng..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                </div>

                {/* GPT-4 Query */}
                <div className="text-center">
                    <button
                        onClick={handleAIRequest}
                        disabled={!question || loading}
                        className={`px-4 py-2 rounded-lg text-white ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi đến AI'}
                    </button>
                </div>

                {/* Response */}
                {gptResponse && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Kết quả từ AI:</h3>
                        <pre className="bg-gray-200 p-4 rounded-lg">{gptResponse}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}