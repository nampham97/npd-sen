"use client";
import { useState } from "react";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";
const UploadAudio = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>(
    '```<div class="container mx-auto p-4 mt-4 bg-white rounded shadow-md"> <h2 class="text-2xl font-bold text-blue-500">Hướng dẫn các thao tác tại bước 1 khởi tạo yêu cầu</h2> <p class="text-lg font-medium text-gray-600">Vai trò thực hiện: Maker FO, thị trường tài chính, Checker FO</p> <h3 class="text-xl font-bold text-blue-500 mt-4">Thao tác 1: Chọn chức năng nhận và xử lý giao dịch thị trường tài chính</h3> <p class="text-lg font-medium text-gray-600 ml-4">User nhấn chọn chức năng nhận và xử lý giao dịch thị trường tài chính để bắt đầu quy trình. BPM tự động sinh má hồ sơ tại góc phải màn hình và cho phép user thực hiện công việc.</p> <h3 class="text-xl font-bold text-blue-500 mt-4">Thao tác 2: Chọn 3 trường</h3> <ul class="list-disc ml-4"> <li class="text-lg font-medium text-gray-600">Nhóm nghiệp vụ</li> <li class="text-lg font-medium text-gray-600">Loại nghiệp vụ</li> <li class="text-lg font-medium text-gray-600">Nội dung</li> </ul> <h3 class="text-xl font-bold text-blue-500 mt-4">Thao tác 3: Đính kèm file</h3> <p class="text-lg font-medium text-gray-600 ml-4">User nhấn vào nút Attach File, hệ thống hiển thị bắp ấp để chọn danh sách file cần đính kèm, nhấn Open để đính kèm file vào danh mục hồ sơ.</p> <h3 class="text-xl font-bold text-blue-500 mt-4">Thao tác 4: Lưu tạm, xóa giao dịch, chuyển phê duyệt yêu cầu</h3> <ul class="list-disc ml-4"> <li class="text-lg font-medium text-gray-600">Lưu thông tin giao dịch: User nhấn nút Lưu tạm. Lúc này, BPM hiển thị bắp ấp thông báo. Lưu thành công.</li> <li class="text-lg font-medium text-gray-600">Xóa giao dịch: User nhấn nút Xóa giao dịch. Lúc này, BPM hiển thị bắp ấp thông báo. User nhấn nút Xác nhận. BPM hủy hồ sơ thành không và kết thúc quy trình.</li> <li class="text-lg font-medium text-gray-600">Chuyển hồ sơ đến bước tiếp theo: User nhấn Chuyển phê duyệt. Lúc này, BPM hiển thị bắp ấp Xác nhận chuyển tiếp và xử lý theo 3 trường hợp.</li> </ul> <h4 class="text-lg font-bold text-blue-500 mt-4">Trường hợp 1: Checker FO khởi tạo</h4> <p class="text-lg font-medium text-gray-600 ml-4">User nhấn nút xác nhận để BPM tự động chuyển hồ sơ đến bước 3, phê duyệt yêu cầu.</p> <h4 class="text-lg font-bold text-blue-500 mt-4">Trường hợp 2: Maker FO khởi tạo, luồng phê duyệt là phê duyệt bằng văn bản</h4> <p class="text-lg font-medium text-gray-600 ml-4">User nhấn nút xác nhận để BPM tự động chuyển hồ sơ đến bước 3, phê duyệt yêu cầu.</p> <h4 class="text-lg font-bold text-blue-500 mt-4">Trường hợp 3: Maker FO khởi tạo, luồng phê duyệt là phê duyệt online trên BPM</h4> <p class="text-lg font-medium text-gray-600 ml-4">User nhấn nút xác nhận để BPM tự động chuyển hồ sơ đến bước 2, kiểm tra yêu cầu.</p> </div>```'
  );
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
    setTranscript(""); // Reset transcript

    const formData = new FormData();
    formData.append("audio", audioFile);
    console.log("formData:", formData.get("audio"));
    try {
      const response = await fetch(
        "https://npdsencore.vercel.app/speech-to-text",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTranscript(data.transcript);
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadWord = async () => {
    try {
      const blob = (await asBlob(transcript.replaceAll("```", ""))) as Blob; // Convert HTML to a Blob
      saveAs(blob, "file.docx"); // Use file-saver to save the file
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <div className="flex gap-4">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded p-2"
        />
        <button
          onClick={handleUpload}
          disabled={loading || !audioFile}
          className="bg-blue-500 whitespace-nowrap text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          {loading ? "Uploading..." : "Upload Audio"}
        </button>
      </div>
      {transcript && (
        <>
          <div className="mt-4 p-2 border rounded bg-gray-100">
            <h3 className="font-bold">Transcript:</h3>
            <button
              onClick={downloadWord}
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              Download file word
            </button>
            <div
              dangerouslySetInnerHTML={{
                __html: transcript.replaceAll("```", ""),
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadAudio;
