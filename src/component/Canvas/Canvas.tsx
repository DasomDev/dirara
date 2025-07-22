import { useEffect, useRef, useState } from 'react';

interface CanvasProps {
  width: number;
  height: number;
}

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

const Canvas = ({ width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lastDrawPos, setLastDrawPos] = useState({ x: 0, y: 0 });

  // 마우스 좌표를 캔버스 좌표로 변환
  const screenToCanvas = (screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (screenX - rect.left - viewport.x) / viewport.zoom;
    const y = (screenY - rect.top - viewport.y) / viewport.zoom;
    
    return { x, y };
  };

  // 캔버스 좌표를 스크린 좌표로 변환
  const canvasToScreen = (canvasX: number, canvasY: number) => {
    const x = canvasX * viewport.zoom + viewport.x;
    const y = canvasY * viewport.zoom + viewport.y;
    
    return { x, y };
  };

  // 그리드 그리기
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = 20 * viewport.zoom;
    const offsetX = viewport.x % gridSize;
    const offsetY = viewport.y % gridSize;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // 세로선
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 가로선
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  // 캔버스 렌더링
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 클리어
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 변환 적용
    ctx.save();
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.zoom, viewport.zoom);

    // 그리드 그리기
    drawGrid(ctx);

    // 여기에 실제 그리기 내용 추가
    // 예: 도형, 선, 텍스트 등

    ctx.restore();
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    
    if (e.button === 0) { // 좌클릭 - 그리기
      setIsDrawing(true);
      setLastDrawPos(canvasPos);
    } else if (e.button === 1) { // 중간 클릭 - 드래그
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      setViewport(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else if (isDrawing) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      
      // 여기에 실제 그리기 로직 추가
      // 예: 선 그리기, 도형 그리기 등
      
      setLastDrawPos(canvasPos);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    console.log('handleWheel');
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 줌 중심점 계산
    const zoomCenterX = (mouseX - viewport.x) / viewport.zoom;
    const zoomCenterY = (mouseY - viewport.y) / viewport.zoom;

    // 줌 레벨 계산
    const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * zoomDelta));

    // 새로운 뷰포트 위치 계산
    const newX = mouseX - zoomCenterX * newZoom;
    const newY = mouseY - zoomCenterY * newZoom;

    setViewport({
      x: newX,
      y: newY,
      zoom: newZoom
    });
  };

  // 뷰포트 변경 시 렌더링
  useEffect(() => {
    render();
  }, [viewport]);

  // 초기 렌더링
  useEffect(() => {
    render();
  }, []);

  return (
    
    <div className="relative">
      {/* 캔버스 컴포넌트 */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()} // 우클릭 메뉴 비활성화
      />
      
      {/* 줌 컨트롤 */}
      {/* <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setViewport(prev => ({ ...prev, zoom: Math.min(5, prev.zoom * 1.2) }))}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow hover:bg-gray-50"
        >
          +
        </button>
        <button
          onClick={() => setViewport(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom * 0.8) }))}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow hover:bg-gray-50"
        >
          -
        </button>
        <button
          onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 text-xs"
        >
          ⌂
        </button>
      </div> */}

      {/* 뷰포트 정보 */}
      <div className="absolute bottom-4 left-4 bg-white border border-gray-300 rounded px-2 py-1 text-xs">
        Zoom: {Math.round(viewport.zoom * 100)}% | 
        X: {Math.round(viewport.x)} | 
        Y: {Math.round(viewport.y)}
      </div>
    </div>
  );
};

export default Canvas; 