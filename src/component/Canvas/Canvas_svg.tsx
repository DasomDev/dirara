import React from "react";

interface CanvasSvgProps {
  width: number;
  height: number;
}

const Canvas_svg: React.FC<CanvasSvgProps> = ({ width, height }) => {
  return (
    <svg width={width} height={height}>
      <rect x="0" y="0" width="100" height="100" fill="red" />
    </svg>
  );
};

export default Canvas_svg;