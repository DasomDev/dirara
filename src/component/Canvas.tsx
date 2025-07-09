import React, { useRef, useEffect } from 'react'

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) return

    const ctx = canvas.getContext('2d')
    if(!ctx) return

    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 100, 100)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export default Canvas 
