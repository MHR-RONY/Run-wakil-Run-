
class Background {
	constructor() {
		this.bgOffset1 = 0;
		this.bgOffset2 = 0;
		this.bgOffset3 = 0;


		this.stars = [];
		for (let i = 0; i < 60; i++) {
			this.stars.push({
				x: Math.random() * CONFIG.WIDTH,
				y: Math.random() * (CONFIG.GROUND_Y - 60),
				size: Math.random() * 2 + 0.5,
				twinkle: Math.random() * Math.PI * 2,
			});
		}


		this.clouds = [];
		for (let i = 0; i < 5; i++) {
			this.clouds.push({
				x: Math.random() * CONFIG.WIDTH,
				y: 30 + Math.random() * 80,
				w: 60 + Math.random() * 80,
				speed: 0.2 + Math.random() * 0.5,
			});
		}
	}

	update(speed) {
		this.bgOffset1 = (this.bgOffset1 + speed * 0.2) % CONFIG.WIDTH;
		this.bgOffset2 = (this.bgOffset2 + speed * 0.5) % CONFIG.WIDTH;
		this.bgOffset3 = (this.bgOffset3 + speed) % 80;
	}

	draw(ctx, frameCount) {
		const W = CONFIG.WIDTH;
		const H = CONFIG.HEIGHT;
		const GY = CONFIG.GROUND_Y;
		const C = CONFIG.COLORS;

		const skyGrad = ctx.createLinearGradient(0, 0, 0, GY);
		skyGrad.addColorStop(0, C.sky[0]);
		skyGrad.addColorStop(0.5, C.sky[1]);
		skyGrad.addColorStop(1, C.sky[2]);
		ctx.fillStyle = skyGrad;
		ctx.fillRect(0, 0, W, H);

		this.stars.forEach(s => {
			const alpha = 0.4 + Math.sin(frameCount * 0.03 + s.twinkle) * 0.3;
			ctx.fillStyle = `rgba(255,255,255,${alpha})`;
			ctx.beginPath();
			ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
			ctx.fill();
		});

		ctx.fillStyle = C.moonLight;
		ctx.beginPath();
		ctx.arc(W - 100, 60, 30, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = C.moonShadow;
		ctx.beginPath();
		ctx.arc(W - 90, 55, 25, 0, Math.PI * 2);
		ctx.fill();

		this.clouds.forEach(c => {
			c.x -= c.speed;
			if (c.x + c.w < 0) c.x = W + 20;
			ctx.fillStyle = 'rgba(255,255,255,0.06)';
			ctx.beginPath();
			ctx.ellipse(c.x, c.y, c.w / 2, 15, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.ellipse(c.x - c.w * 0.2, c.y + 5, c.w / 3, 12, 0, 0, Math.PI * 2);
			ctx.fill();
		});

		ctx.fillStyle = C.farBuilding;
		for (let i = 0; i < 12; i++) {
			const bx = (i * 100 - this.bgOffset1 % 100 + W) % (W + 100) - 50;
			const bh = 40 + (i * 37) % 60;
			ctx.fillRect(bx, GY - bh, 50, bh);
			ctx.fillStyle = C.windowGlow;
			for (let wy = GY - bh + 8; wy < GY - 10; wy += 14) {
				for (let wx = bx + 8; wx < bx + 42; wx += 14) {
					if (Math.random() > 0.3) ctx.fillRect(wx, wy, 6, 8);
				}
			}
			ctx.fillStyle = C.farBuilding;
		}


		ctx.fillStyle = C.nearBuilding;
		for (let i = 0; i < 8; i++) {
			const bx = (i * 140 - this.bgOffset2 % 140 + W) % (W + 140) - 70;
			const bh = 60 + (i * 47) % 80;
			ctx.fillRect(bx, GY - bh, 70, bh);
		}

		const groundGrad = ctx.createLinearGradient(0, GY, 0, H);
		groundGrad.addColorStop(0, C.ground[0]);
		groundGrad.addColorStop(0.3, C.ground[1]);
		groundGrad.addColorStop(1, C.ground[2]);
		ctx.fillStyle = groundGrad;
		ctx.fillRect(0, GY, W, H - GY);

		ctx.strokeStyle = C.groundLine;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, GY);
		ctx.lineTo(W, GY);
		ctx.stroke();

		ctx.strokeStyle = C.groundDash;
		ctx.lineWidth = 1;
		for (let i = 0; i < 20; i++) {
			const dx = (i * 50 - this.bgOffset3 * 5 % 50 + W) % W;
			ctx.beginPath();
			ctx.moveTo(dx, GY + 8);
			ctx.lineTo(dx + 15, GY + 8);
			ctx.stroke();
		}
	}
}
