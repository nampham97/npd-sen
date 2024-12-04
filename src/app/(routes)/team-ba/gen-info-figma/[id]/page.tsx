"use client";
import { APIGetDetailNode } from "@/app/apis/Figma";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const params = useParams();
  const { id } = params;
  const queryParams = useSearchParams();
  const [result, setResult] = React.useState<any[]>();

  React.useEffect(() => {
    const handleGetControl = async (nodeid: string) => {
      const res = await APIGetDetailNode(queryParams.get("idFigma")!, nodeid);
      if (res.status === 200 || res.status === 201) {
        const data = res.data;
        const nodeData =
          data.nodes[nodeid.replace("-", ":")]?.document?.children;
        if (!nodeData) {
          throw new Error("Không tìm thấy node");
        }
        const rs = [] as any[];
        const listExcept = [
          "Rectangle",
          "Vector",
          "chevron",
          "Label",
          "bx:",
          "uil:",
          "Dashboards",
          "Công việc của tôi",
          "image",
          "formkit:",
        ];
        nodeData.map((node: any) => {
          if (node.children?.length) {
            return node.children.map((child: any) => {
              if (listExcept.indexOf(child.name) === -1) {
                rs.push({
                  name: child.characters || "(Trống)",
                  type: child.type,
                  absoluteBoundingBox: child.absoluteBoundingBox,
                  absoluteRenderBounds: child.absoluteRenderBounds,
                  backgroundColor: child.backgroundColor,
                });
              }
            });
          }
          if (listExcept.every((item) => !node.name.includes(item))) {
            rs.push({
              name: node.characters || "(Trống)",
              type: node.type,
              absoluteBoundingBox: node.absoluteBoundingBox,
              absoluteRenderBounds: node.absoluteRenderBounds,
              backgroundColor: node.backgroundColor,
            });
          }
        });

        setResult(rs);
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
