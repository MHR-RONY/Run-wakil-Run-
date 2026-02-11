/* ============================================================
   RUN BHAI RUN! — Particle System
   ============================================================ */

class ParticleSystem {
	constructor() {
		this.particles = [];
	}

	reset() {
		this.particles = [];
	}

	/** Spawn a burst of particles at (x, y) */
	spawn(x, y, color) {
		for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
			this.particles.push({
				x, y,
				vx: (Math.random() - 0.5) * 4,
				vy: -Math.random() * 3 - 1,
				life: 20 + Math.random() * 15,
				maxLife: 35,
				color: color || '#d4a373',
				size: 2 + Math.random() * 3,
			});
		}
	}

	update() {
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.x += p.vx;
			p.y += p.vy;
			p.vy += 0.15;
			p.life--;
			if (p.life <= 0) this.particles.splice(i, 1);
		}
	}

	draw(ctx) {
		this.particles.forEach(p => {
			ctx.globalAlpha = p.life / p.maxLife;
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fill();
		});
		ctx.globalAlpha = 1;
	}
}
