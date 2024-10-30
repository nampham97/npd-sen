"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
function GenInfoFigma() {
  const xFigmaToken = "figd_wwMS0fwTaiG50Nzw7-yuLTK3d7t_gW7Z3AC7Cb67";
  const [idFigma, setIdFigma] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const router = useRouter();
  const handleGetNode = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.figma.com/v1/files/${idFigma}`,
        {
          method: "GET",
          headers: {
            "X-Figma-Token": xFigmaToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const page = data.document.children.find(
        (child: any) => child.name === "EIB_PTD"
      );
      const nodes = page.children
        .filter((item: any) => item.name.trim() != "")
        .map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
      if (!page) {
        throw new Error("Không tìm thấy trang này!");
      }
      setLoading(false);
      setNodes(nodes);
    } catch (error) {
      console.error("Error fetching Figma nodes:", error);
    }
  };

  return (
    <div>
      <div className="flex gap-4 justify-around items-center mb-4">
        <input
          type="text"
          value={idFigma}
          onChange={({ target }) => setIdFigma(target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <button
          onClick={handleGetNode}
          disabled={loading}
          className=" whitespace-nowrap bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          {loading ? "Đang lấy các node..." : "Lấy node"}
        </button>
      </div>

      {nodes && (
        <div className="grid grid-cols-6 gap-4">
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() =>
                router.push(
                  `${window.location.pathname}/${node.id.replace(
                    ":",
                    "-"
                  )}?idFigma=${idFigma}`
                )
              }
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              {node.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GenInfoFigma;
