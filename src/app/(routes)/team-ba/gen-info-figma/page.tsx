"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { Button, Card, Input } from "antd";
import { APIGetNode } from "@/app/apis/Figma";
function GenInfoFigma() {
  const [idFigma, setIdFigma] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const router = useRouter();
  const handleGetNode = async () => {
    setLoading(true);
    const res = await APIGetNode(idFigma);
    setLoading(false);
    if (res.status === 200 || res.status === 201) {
      const data = res.data;
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
      setNodes(nodes);
    }
  };

  return (
    <div>
      <div className="flex gap-4 justify-around items-center mb-4">
        <Input
          placeholder="Nhập ID dự án Figma..."
          value={idFigma}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGetNode();
            }
          }}
          onChange={({ target }) => setIdFigma(target.value)}
        />
        <Button
          onClick={handleGetNode}
          type="primary"
          loading={loading}
          disabled={loading}
        >
          {loading ? "Đang lấy các node..." : "Lấy node"}
        </Button>
      </div>

      {nodes && (
        <Card title={`Kết quả tìm kiếm: ${idFigma}`}>
          {nodes.map((node) => (
            <Card.Grid
              key={node.id}
              style={{ width: "20%" }}
              className="cursor-pointer text-center"
              onClick={() =>
                router.push(
                  `${window.location.pathname}/${node.id.replace(
                    ":",
                    "-"
                  )}?idFigma=${idFigma}`
                )
              }
            >
              {node.name}
            </Card.Grid>
          ))}
        </Card>

        // <div className="grid grid-cols-6 gap-4">
        // </div>
      )}
    </div>
  );
}

export default GenInfoFigma;
