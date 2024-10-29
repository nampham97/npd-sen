'use client';

import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Import icon loading

export default function FileManager() {
    const [files, setFiles] = useState<string[]>([]);
    const [question, setQuestion] = useState<string>('');
    const [gptResponse, setGptResponse] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingFiles, setLoadingFiles] = useState<boolean>(true); // Trạng thái loading cho danh sách file

    // Fetch the existing files when the page loads
    useEffect(() => {
        fetchFiles();
    }, []);

    // Function to fetch existing files
    const fetchFiles = async () => {
        try {
            setLoadingFiles(true);
            const res = await fetch('/api/read-files');
            const data = await res.json();
            setFiles(data.files || []);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoadingFiles(false); // Khi xong thì set loading về false
        }
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

    // Xử lý mở rộng ô nhập khi nhấn Shift + Enter
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAIRequest();
        }
    };

    // Tự động điều chỉnh chiều cao của textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(e.target.value);
        const textarea = e.target;
        textarea.style.height = 'auto'; // Đặt chiều cao về auto để tính lại chiều cao
        textarea.style.height = `${textarea.scrollHeight}px`; // Điều chỉnh chiều cao theo nội dung
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">File Manager</h1>

                {/* File List */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Danh sách file hiện có</h2>
                    
                    {/* Loading animation */}
                    {loadingFiles ? (
                        <div className="flex items-center justify-center">
                            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-indigo-600" />
                            <p className="ml-3 text-gray-600">Đang tải danh sách file...</p>
                        </div>
                    ) : (
                        <ul className="list-disc pl-6">
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                    <li key={index} className="text-gray-700 transition-opacity duration-300 ease-in-out">
                                        {file}
                                    </li>
                                ))
                            ) : (
                                <p className="text-red-500">Không có file nào</p>
                            )}
                        </ul>
                    )}
                </div>

                {/* Question Input */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Đặt câu hỏi</h2>
                    <textarea
                        value={question}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Hỏi điều gì đó về bảng..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none overflow-hidden"
                        style={{ minHeight: '40px', maxHeight: '400px' }}
                    />
                    <p className="text-sm text-gray-500 mt-2">Nhấn <kbd>Shift</kbd> + <kbd>Enter</kbd> để xuống dòng, hoặc Enter để gửi.</p>
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
                        <div className="bg-gray-200 p-4 rounded-lg whitespace-pre-wrap">
                            {gptResponse}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
