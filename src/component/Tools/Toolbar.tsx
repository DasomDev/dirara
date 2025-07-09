import { useState } from "react";
import { BASIC_TOOLS, setActiveTool } from "../../interface/tools";
import type { Tool } from "../../interface/tools";
import {
  CursorArrowRaysIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  CircleStackIcon,
  MinusIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import { MousePointer2 } from "lucide-react";

// 아이콘 매핑
const iconMap = {
  "cursor-arrow-rays": MousePointer2,
  "paint-brush": PaintBrushIcon,
  "text-type": DocumentTextIcon,
  "rectangle-stack": RectangleStackIcon,
  "circle-stack": CircleStackIcon,
};

const Toolbar = () => {
  const [tools, setTools] = useState<Tool[]>(BASIC_TOOLS);

  const handleToolClick = (toolId: string) => {
    const updatedTools = setActiveTool(toolId);
    setTools(updatedTools);
  };

  return (
    <div className="w-[400px] absolute bottom-8 right-8 rounded-full flex flex-col gap-2 p-2 bg-white border">
      {tools.map((tool) => {
        const IconComponent = iconMap[tool.icon as keyof typeof iconMap];

        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`p-2 rounded-lg transition-colors ${
              tool.isActive
                ? "bg-blue-100 text-blue-600 border border-blue-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {tool.name}
            {/* {IconComponent && <IconComponent className="w-5 h-5" />} */}
          </button>
        );
      })}
    </div>
  );
};

export default Toolbar;
