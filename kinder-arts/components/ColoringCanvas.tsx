"use client";

import { useRef, useEffect, useState } from "react";

const COLORS = ["#F0607A", "#F07845", "#F5C842", "#4DBDAF", "#54A0FF", "#a78bfa", "#1A1A1A", "#FFFFFF"];
const BRUSHES = [4, 10, 20, 36];

export default function ColoringCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef("#F0607A");
  const brushRef = useRef(10);
  const drawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const [color, setColor] = useState("#F0607A");
  const [brush, setBrush] = useState(10);

  const pickColor = (c: string) => { colorRef.current = c; setColor(c); };
  const pickBrush = (b: number) => { brushRef.current = b; setBrush(b); };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Init white background
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const getXY = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const down = (clientX: number, clientY: number) => {
      drawing.current = true;
      const { x, y } = getXY(clientX, clientY);
      lastX.current = x;
      lastY.current = y;
      // Draw dot
      ctx.beginPath();
      ctx.arc(x, y, brushRef.current / 2, 0, Math.PI * 2);
      ctx.fillStyle = colorRef.current;
      ctx.fill();
    };

    const move = (clientX: number, clientY: number) => {
      if (!drawing.current) return;
      const { x, y } = getXY(clientX, clientY);
      ctx.beginPath();
      ctx.moveTo(lastX.current, lastY.current);
      ctx.lineTo(x, y);
      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = brushRef.current;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastX.current = x;
      lastY.current = y;
    };

    const mouseDown = (e: MouseEvent) => down(e.clientX, e.clientY);
    const mouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const mouseUp = () => { drawing.current = false; };
    const touchStart = (e: TouchEvent) => { e.preventDefault(); down(e.touches[0].clientX, e.touches[0].clientY); };
    const touchMove = (e: TouchEvent) => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); };
    const touchEnd = () => { drawing.current = false; };

    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mouseleave", mouseUp);
    canvas.addEventListener("touchstart", touchStart, { passive: false });
    canvas.addEventListener("touchmove", touchMove, { passive: false });
    canvas.addEventListener("touchend", touchEnd);

    return () => {
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("mouseup", mouseUp);
      canvas.removeEventListener("mouseleave", mouseUp);
      canvas.removeEventListener("touchstart", touchStart);
      canvas.removeEventListener("touchmove", touchMove);
      canvas.removeEventListener("touchend", touchEnd);
    };
  }, []);

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = "ציור-של-עפרי.png";
    link.href = canvasRef.current!.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-6 bg-card border border-border rounded-2xl px-6 py-4 w-full">
        <div className="flex items-center gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button key={c} type="button" onClick={() => pickColor(c)}
              className="rounded-full transition-all hover:scale-110"
              style={{ background: c, width: 30, height: 30, border: color === c ? "3px solid #1A1A1A" : "2px solid #E8E2D9" }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          {BRUSHES.map((b) => (
            <button key={b} type="button" onClick={() => pickBrush(b)}
              className="rounded-full transition-all hover:scale-110"
              style={{ width: b + 12, height: b + 12, backgroundColor: color, border: brush === b ? "3px solid #1A1A1A" : "2px solid #E8E2D9" }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={clear} className="text-sm font-bold px-4 py-2 rounded-full border-2 border-ink text-ink hover:bg-ink hover:text-cream transition-colors">נקה</button>
          <button type="button" onClick={download} className="text-sm font-bold px-4 py-2 rounded-full bg-teal text-white hover:bg-teal-dark transition-colors">שמור ציור</button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={1200}
        height={500}
        className="w-full rounded-2xl border-2 border-ink shadow-md bg-white"
        style={{ cursor: "crosshair", minHeight: 280, display: "block" }}
      />
    </div>
  );
}
