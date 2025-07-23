import { BASIC_TOOLS } from "../../interface/tools";
import {
  PaintBrushIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";

import { Shapes, Type, MousePointer2 } from "lucide-react";
import { useRecoilState } from "recoil";
import { toolModeAtom } from "../../store/atoms";

import ColorPalette from "./ColorPalette";
import { useState } from "react";

// 아이콘 매핑
const iconMap = {
  "mouse-pointer-2": MousePointer2,
  "paint-brush": PaintBrushIcon,
  type: Type,
  "rectangle-stack": RectangleStackIcon,
  shapes: Shapes,
};

const Toolbar = () => {
  // const [tools, setTools] = useState<Tool[]>(BASIC_TOOLS);
  const [toolMode, setToolMode] = useRecoilState(toolModeAtom);
  const [isShowColorPalette, setIsShowColorPalette] = useState(false);

  const handleToolClick = (toolId: string) => {
    setToolMode(toolId);
    if (toolId === "pen") {
      setIsShowColorPalette((prev) => !prev);
    } else {
      setIsShowColorPalette(false);
    }
  };

  return (
    <div className="z-10 absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg shadow-lg flex gap-2 p-2 bg-white border">
      {BASIC_TOOLS.map((tool) => {
        const IconComponent = iconMap[tool.icon as keyof typeof iconMap];
        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`p-2 rounded-lg box-border w-[38px] transition-colors flex items-center gap-2 ${
              toolMode === tool.id
                ? "bg-blue-100 text-blue-600 border border-blue-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {IconComponent && <IconComponent className="w-5 h-5" />}
            {/* {toolMode} */}
          </button>
        );
      })}
      {isShowColorPalette && <ColorPalette />}
    </div>
  );
};

export default Toolbar;
