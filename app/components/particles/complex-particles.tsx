import React from "react";


// Multi-layered, modern, optimized animated particles background
const ComplexParticles: React.FC = () => {
  const canvasRef1 = React.useRef<HTMLCanvasElement>(null);
  const canvasRef2 = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    // Layer 1: Soft floating colored blobs
    const canvas = canvasRef1.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const blobs = Array.from({length: 8}, (_,i) => ({
      x: Math.random()*width,
      y: Math.random()*height,
      r: 120+Math.random()*80,
      dx: (Math.random()-0.5)*0.3,
      dy: (Math.random()-0.5)*0.3,
      c: ["#5EA2EF33","#C084FC33","#F472B633","#A5B4FC33","#818CF833"][i%5]
    }));
    let running = true;
    function animate() {
      if (!running || !ctx) return;
      ctx.clearRect(0,0,width,height);
      for (const b of blobs) {
        if (!ctx) continue;
        ctx.beginPath();
        ctx.arc(b.x,b.y,b.r,0,2*Math.PI);
        ctx.fillStyle = b.c;
        ctx.globalAlpha = 0.5;
        ctx.filter = "blur(32px)";
        ctx.fill();
        ctx.filter = "none";
        ctx.globalAlpha = 1;
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < -b.r) b.x = width+b.r;
        if (b.x > width+b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = height+b.r;
        if (b.y > height+b.r) b.y = -b.r;
      }
      requestAnimationFrame(animate);
    }
    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      running = false;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    // Layer 2: Fine, glowing, connecting particles
    const canvas = canvasRef2.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const PARTICLE_COUNT = width < 700 ? 32 : 54;
    const particles = Array.from({length: PARTICLE_COUNT}, () => ({
      x: Math.random()*width,
      y: Math.random()*height,
      r: Math.random()*2.2+1.2,
      dx: (Math.random()-0.5)*0.22,
      dy: (Math.random()-0.5)*0.22,
      c: ["#5EA2EF","#C084FC","#F472B6","#A5B4FC","#818CF8"][Math.floor(Math.random()*5)],
      o: Math.random()*0.5+0.3
    }));
    let running = true;
    function animate() {
      if (!running || !ctx) return;
      ctx.clearRect(0,0,width,height);
      for (const p of particles) {
        if (!ctx) continue;
        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
        ctx.fillStyle = p.c;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      }
      // Draw connections
      for (let i=0;i<particles.length;i++) {
        for (let j=i+1;j<particles.length;j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < 110 && ctx) {
            ctx.globalAlpha = 0.13;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.strokeStyle = a.c;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      running = false;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef1} style={{
        position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:0,pointerEvents:'none',
        background: 'radial-gradient(ellipse at 60% 40%, #18182f 0%, #0a0a16 100%)',
        mixBlendMode: 'darken',
      }} />
      <canvas ref={canvasRef2} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1,pointerEvents:'none'}} />
    </>
  );
};

export default ComplexParticles;
