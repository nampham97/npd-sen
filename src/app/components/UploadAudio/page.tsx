import { useState } from 'react';
import axios from 'axios';

const UploadAudio = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) return;

    setLoading(true);
    setTranscript(''); // Reset transcript

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await axios.post('/api/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscript(response.data.transcript);
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="mb-2 border border-gray-300 rounded p-2"
      />
      <button
        onClick={handleUpload}
        disabled={loading || !audioFile}
        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
      >
        {loading ? 'Uploading...' : 'Upload Audio'}
      </button>
      {transcript && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <h3 className="font-bold">Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default UploadAudio;
