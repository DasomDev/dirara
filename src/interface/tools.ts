// Tool 도구 타입 정의
export interface Tool {
  id: string;
  name: string;
  icon: string;
  category: "drawing" | "selection" | "text" | "shape";
  isActive?: boolean;
}

// 기본 Tool 도구 상수
export const BASIC_TOOLS: Tool[] = [
  {
    id: "select",
    name: "선택",
    icon: "mouse-pointer-2",
    category: "selection",
    isActive: true,
  },
  {
    id: "pen",
    name: "펜",
    icon: "paint-brush",
    category: "drawing",
  },
  {
    id: "text",
    name: "텍스트",
    icon: "type",
    category: "text",
  },
  {
    id: "diagram",
    name: "도형",
    icon: "shapes",
    category: "shape",
  },
];



// 현재 활성화된 Tool 가져오기
export const getActiveTool = (): Tool | undefined => {
  return BASIC_TOOLS.find((tool) => tool.isActive);
};

// Tool 활성화 함수
export const setActiveTool = (toolId: string): Tool[] => {
  return BASIC_TOOLS.map((tool) => ({
    ...tool,
    isActive: tool.id === toolId,
  }));
};
