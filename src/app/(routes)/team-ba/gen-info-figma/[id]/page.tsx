"use client";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const xFigmaToken = "figd_wwMS0fwTaiG50Nzw7-yuLTK3d7t_gW7Z3AC7Cb67";
  const params = useParams();
  const { id } = params;
  const queryParams = useSearchParams();
  const [result, setResult] = React.useState<any[]>();

  React.useEffect(() => {
    const handleGetControl = async (nodeid: string) => {
      console.log(nodeid);
      try {
        const response = await fetch(
          `https://api.figma.com/v1/files/${queryParams.get(
            "idFigma"
          )}/nodes?ids=${nodeid}`,
          {
            method: "GET",
            headers: {
              "X-Figma-Token": xFigmaToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Lỗi: ${response.status}`);
        }

        const data = await response.json();
        const nodeData =
          data.nodes[nodeid.replace("-", ":")]?.document?.children;
        if (!nodeData) {
          throw new Error("Không tìm thấy node");
        }

        const rs = nodeData.map((node: any) => {
          if (node.children) {
            return node.children.map((child: any) => ({
              name: child.name,
              type: child.type,
              absoluteBoundingBox: child.absoluteBoundingBox,
              absoluteRenderBounds: child.absoluteRenderBounds,
              backgroundColor: child.backgroundColor,
            }));
          }
          return {
            name: node.name,
            type: node.type,
            absoluteBoundingBox: node.absoluteBoundingBox,
            absoluteRenderBounds: node.absoluteRenderBounds,
            backgroundColor: node.backgroundColor,
          };
        });

        console.log(rs);
        setResult(rs);
      } catch (error) {
        console.error("Lỗi từ Figma:", error);
      }
    };
    if (id) {
      handleGetControl(id.toString());
    }
  }, [id]);

  return (
    <div>
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-bold mb-4">Cấu trúc JSON:</h2>
        <div className="bg-white p-4 rounded border overflow-x-auto">
          {result ? JSON.stringify(result, null, 2) : "Loading..."}
        </div>
      </div>
    </div>
  );
}

export default Page;
