import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Shape3D {
  type: 'cube' | 'octahedron';
  center: Point3D;
  size: number;
  rotation: { x: number; y: number; z: number };
  speed: { x: number; y: number; z: number };
  color: string;
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.05;
      targetMouseY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Shapes in floating space
    const shapes: Shape3D[] = [
      {
        type: 'cube',
        center: { x: -width * 0.3, y: -height * 0.2, z: 200 },
        size: 50,
        rotation: { x: 0.2, y: 0.4, z: 0.1 },
        speed: { x: 0.005, y: 0.007, z: 0.003 },
        color: 'rgba(59, 130, 246, 0.45)', // blue
      },
      {
        type: 'octahedron',
        center: { x: width * 0.32, y: -height * 0.15, z: 150 },
        size: 65,
        rotation: { x: 0.5, y: 0.1, z: 0.3 },
        speed: { x: 0.004, y: 0.006, z: 0.005 },
        color: 'rgba(99, 102, 241, 0.5)', // indigo
      },
      {
        type: 'cube',
        center: { x: width * 0.35, y: height * 0.25, z: 300 },
        size: 55,
        rotation: { x: 0.1, y: 0.5, z: 0.2 },
        speed: { x: 0.006, y: 0.004, z: 0.003 },
        color: 'rgba(14, 165, 233, 0.4)', // cyan
      },
      {
        type: 'octahedron',
        center: { x: -width * 0.35, y: height * 0.3, z: 250 },
        size: 60,
        rotation: { x: 0.3, y: 0.3, z: 0.4 },
        speed: { x: 0.005, y: 0.005, z: 0.006 },
        color: 'rgba(168, 85, 247, 0.4)', // purple
      },
      {
        type: 'cube',
        center: { x: 0, y: height * 0.45, z: 400 },
        size: 40,
        rotation: { x: 0.2, y: 0.2, z: 0.1 },
        speed: { x: 0.003, y: 0.008, z: 0.004 },
        color: 'rgba(59, 130, 246, 0.35)',
      },
    ];

    // Floating 3D particles / stars
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 600 + 50,
      size: Math.random() * 2 + 1,
      speedZ: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    // Math 3D Rotation & Projection
    const rotatePoint = (p: Point3D, rot: { x: number; y: number; z: number }): Point3D => {
      // Rotate around X
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;

      // Rotate around Y
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;

      // Rotate around Z
      const cosZ = Math.cos(rot.z);
      const sinZ = Math.sin(rot.z);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    const project = (p: Point3D, fov: number = 700): { x: number; y: number; scale: number } => {
      const z = p.z + 500;
      const scale = fov / (fov + z);
      return {
        x: p.x * scale + width / 2 + mouseX * scale,
        y: p.y * scale + height / 2 + mouseY * scale,
        scale,
      };
    };

    // Render loop
    const render = () => {
      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render floating 3D particle dust
      particles.forEach((pt) => {
        pt.z -= pt.speedZ;
        if (pt.z < 10) pt.z = 650;

        const proj = project({ x: pt.x, y: pt.y, z: pt.z });
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, pt.size * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${pt.alpha * proj.scale})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render 3D geometric shapes
      shapes.forEach((shape) => {
        shape.rotation.x += shape.speed.x;
        shape.rotation.y += shape.speed.y;
        shape.rotation.z += shape.speed.z;

        if (shape.type === 'cube') {
          const s = shape.size;
          const rawVertices: Point3D[] = [
            { x: -s, y: -s, z: -s },
            { x: s, y: -s, z: -s },
            { x: s, y: s, z: -s },
            { x: -s, y: s, z: -s },
            { x: -s, y: -s, z: s },
            { x: s, y: -s, z: s },
            { x: s, y: s, z: s },
            { x: -s, y: s, z: s },
          ];

          const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // back face
            [4, 5], [5, 6], [6, 7], [7, 4], // front face
            [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
          ];

          const transformed = rawVertices.map((v) => {
            const rot = rotatePoint(v, shape.rotation);
            return project({
              x: rot.x + shape.center.x,
              y: rot.y + shape.center.y,
              z: rot.z + shape.center.z,
            });
          });

          // Draw edges
          ctx.strokeStyle = shape.color;
          ctx.lineWidth = 1.6;
          ctx.shadowBlur = 12;
          ctx.shadowColor = shape.color;
          edges.forEach(([i, j]) => {
            ctx.beginPath();
            ctx.moveTo(transformed[i].x, transformed[i].y);
            ctx.lineTo(transformed[j].x, transformed[j].y);
            ctx.stroke();
          });

          // Draw vertex glow points
          transformed.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
            ctx.fillStyle = '#60a5fa';
            ctx.fill();
          });
          ctx.shadowBlur = 0;
        } else if (shape.type === 'octahedron') {
          const s = shape.size;
          const rawVertices: Point3D[] = [
            { x: 0, y: -s * 1.2, z: 0 }, // top
            { x: 0, y: s * 1.2, z: 0 },  // bottom
            { x: -s, y: 0, z: -s },
            { x: s, y: 0, z: -s },
            { x: s, y: 0, z: s },
            { x: -s, y: 0, z: s },
          ];

          const edges = [
            [0, 2], [0, 3], [0, 4], [0, 5], // top pyramid
            [1, 2], [1, 3], [1, 4], [1, 5], // bottom pyramid
            [2, 3], [3, 4], [4, 5], [5, 2], // middle ring
          ];

          const transformed = rawVertices.map((v) => {
            const rot = rotatePoint(v, shape.rotation);
            return project({
              x: rot.x + shape.center.x,
              y: rot.y + shape.center.y,
              z: rot.z + shape.center.z,
            });
          });

          ctx.strokeStyle = shape.color;
          ctx.lineWidth = 1.6;
          ctx.shadowBlur = 12;
          ctx.shadowColor = shape.color;
          edges.forEach(([i, j]) => {
            ctx.beginPath();
            ctx.moveTo(transformed[i].x, transformed[i].y);
            ctx.lineTo(transformed[j].x, transformed[j].y);
            ctx.stroke();
          });

          transformed.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.8 * p.scale, 0, Math.PI * 2);
            ctx.fillStyle = '#a855f7';
            ctx.fill();
          });
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 3D Isometric / Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)]" 
      />
      
      {/* Dynamic 3D ambient glow orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[160px]" />
      <div className="absolute -bottom-32 left-1/3 w-[34rem] h-[34rem] bg-cyan-600/15 rounded-full blur-[150px]" />
      
      {/* Canvas with real-time 3D rendered geometric wireframes and particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
