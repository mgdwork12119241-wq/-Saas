import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const neuralCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Matrix Rain Effect
    const matrixCanvas = matrixCanvasRef.current;
    if (!matrixCanvas) return;

    const ctx = matrixCanvas.getContext('2d');
    if (!ctx) return;

    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const chars = '01アウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charSize = 20;
    const columns = Math.ceil(matrixCanvas.width / charSize);
    const drops: number[] = Array(columns).fill(0);

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(2, 2, 3, 0.05)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = '#00f3ff';
      ctx.font = `${charSize}px 'Orbitron', monospace`;
      ctx.globalAlpha = 0.1;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * charSize, drops[i] * charSize);

        if (drops[i] * charSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    };

    const matrixInterval = setInterval(drawMatrix, 50);

    // Neural Network Effect
    const neuralCanvas = neuralCanvasRef.current;
    if (!neuralCanvas) return;

    const neuralCtx = neuralCanvas.getContext('2d');
    if (!neuralCtx) return;

    neuralCanvas.width = window.innerWidth;
    neuralCanvas.height = window.innerHeight;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const nodes: Node[] = [];
    const nodeCount = 15;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * neuralCanvas.width,
        y: Math.random() * neuralCanvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    const drawNeural = () => {
      neuralCtx.fillStyle = 'rgba(2, 2, 3, 0.02)';
      neuralCtx.fillRect(0, 0, neuralCanvas.width, neuralCanvas.height);

      // Draw connections
      neuralCtx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
      neuralCtx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            neuralCtx.globalAlpha = 1 - distance / 200;
            neuralCtx.beginPath();
            neuralCtx.moveTo(nodes[i].x, nodes[i].y);
            neuralCtx.lineTo(nodes[j].x, nodes[j].y);
            neuralCtx.stroke();
          }
        }
      }
      neuralCtx.globalAlpha = 1;

      // Draw nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > neuralCanvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > neuralCanvas.height) node.vy *= -1;

        neuralCtx.fillStyle = '#00f3ff';
        neuralCtx.beginPath();
        neuralCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        neuralCtx.fill();

        neuralCtx.strokeStyle = '#ff00e5';
        neuralCtx.lineWidth = 1;
        neuralCtx.beginPath();
        neuralCtx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
        neuralCtx.stroke();
      }
    };

    const neuralInterval = setInterval(drawNeural, 50);

    const handleResize = () => {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      neuralCanvas.width = window.innerWidth;
      neuralCanvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(matrixInterval);
      clearInterval(neuralInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={matrixCanvasRef}
        className="fixed top-0 left-0 w-full h-full -z-50 opacity-8"
      />
      <canvas
        ref={neuralCanvasRef}
        className="fixed top-0 left-0 w-full h-full -z-40 opacity-15"
      />
      <div className="scan-line" />
    </>
  );
}
