'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface MovingParticlesProps {
	particleCount?: number;
	particleSpeed?: number;
	particleOpacity?: number;
	particleColors?: string[];
	connectionDistance?: number;
	connectionOpacity?: number;
	height?: string;
}

interface Particle {
	x: number;
	y: number;
	radius: number;
	vx: number;
	vy: number;
	color: string;
	colorIndex: number;
	colorProgress: number;
}

const MovingParticles: React.FC<MovingParticlesProps> = ({
	particleCount = 50,
	particleSpeed = .1,
	particleOpacity = 0.8,
	particleColors = ['#ffffff', '#e6f3ff', '#b3e0ff', '#66c2ff', '#0099ff'],
	connectionDistance = 200,
	connectionOpacity = 0.7,
	height = "auto",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const particlesRef = useRef<Particle[]>([]);
	const frameRef = useRef<number>();

	const initParticles = useCallback(() => {
		return Array.from({ length: particleCount }, () => ({
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
			radius: Math.random() * 2 + 1,
			vx: (Math.random() - 0.5) * particleSpeed * .2, // Reduced velocity by factor of 0.2
			vy: (Math.random() - 0.5) * particleSpeed * .2, // Reduced velocity by factor of 0.2
			color: particleColors[Math.floor(Math.random() * particleColors.length)],
			colorIndex: 0,
			colorProgress: 0,
		}));
	}, [particleCount, particleSpeed, particleColors]);

	const updateParticle = (particle: Particle, canvas: HTMLCanvasElement): void => {
		// Add some random movement with increased variation
		particle.vx += (Math.random() - 0.5) * particleSpeed * .2;
		particle.vy += (Math.random() - 0.5) * particleSpeed * .2;
	
		// Limit maximum speed with higher cap
		// const maxSpeed = 3;
		// const speed = (Math.random() - 0.5) * particleSpeed * .2;
		// if (speed > maxSpeed) {
		// 	particle.vx = (particle.vx / speed);
		// 	particle.vy = (particle.vy / speed);
		// }
	
		// Update position with momentum
		particle.x += particle.vx;
		particle.y += particle.vy;
	
		// Screen wrapping with smoother transition
		if (particle.x < -50) particle.x = canvas.width + 49;
		if (particle.x > canvas.width + 50) particle.x = -49;
		if (particle.y < -50) particle.y = canvas.height + 49;
		if (particle.y > canvas.height + 50) particle.y = -49;
	
		// Reduced friction for more persistent movement
		const friction = 0.995;
		particle.vx *= friction;
		particle.vy *= friction;
	};

	const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle): void => {
		ctx.beginPath();
		ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
		ctx.fillStyle = particle.color;
		ctx.fill();
	};

	const drawConnections = (
		ctx: CanvasRenderingContext2D,
		particle: Particle,
		index: number,
		particles: Particle[],
		connectionDistance: number,
		connectionOpacity: number
	): void => {
		for (let j = index + 1; j < particles.length; j++) {
			const other = particles[j];
			const dx = particle.x - other.x;
			const dy = particle.y - other.y;
			const distance = dx * dx + dy * dy;

			if (distance < connectionDistance * connectionDistance) {
				const opacity = connectionOpacity * (1 - Math.sqrt(distance) / connectionDistance);
				ctx.beginPath();
				ctx.strokeStyle = `${particle.color.slice(0, 7)}${Math.floor(opacity * 255)
					.toString(16)
					.padStart(2, '0')}`;
				ctx.lineWidth = 0.5;
				ctx.moveTo(particle.x, particle.y);
				ctx.lineTo(other.x, other.y);
				ctx.stroke();
			}
		}
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d', { alpha: true });
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth - 6;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();

		if (particlesRef.current.length === 0) {
			particlesRef.current = initParticles();
		}

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particlesRef.current.forEach((particle, index) => {
				// Update particle position and properties
				updateParticle(particle, canvas);

				// Draw particle
				drawParticle(ctx, particle);

				// Draw connections
				drawConnections(ctx, particle, index, particlesRef.current, connectionDistance, connectionOpacity);
			});

			frameRef.current = requestAnimationFrame(animate);
		};

		window.addEventListener('resize', resizeCanvas);
		frameRef.current = requestAnimationFrame(animate);

		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [particleCount, particleSpeed, particleOpacity, particleColors, connectionDistance, connectionOpacity, initParticles]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				opacity: particleOpacity,
				overflow: "hidden",
				zIndex: -1
			}}
		/>
	);
};

export default MovingParticles;