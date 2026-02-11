
class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		canvas.width = CONFIG.WIDTH;
		canvas.height = CONFIG.HEIGHT;

		this.state = 'menu';
		this.score = 0;
		this.highScore = parseInt(localStorage.getItem('runBhaiHighScore')) || 0;
		this.speed = CONFIG.BASE_SPEED;
		this.frameCount = 0;
		this.difficultyTimer = 0;
		this.screenShake = 0;
		this.wifeAnger = 0;

		this.player = new Player();
		this.wife = new Wife();
		this.obstacleManager = new ObstacleManager();
		this.particleSystem = new ParticleSystem();
		this.background = new Background();
		this.renderer = new Renderer(this.ctx);
		this.input = new InputHandler(canvas, this);

		document.getElementById('instructions').textContent = '⬆ Jump  |  ⬇ Duck  |  Space দিয়ে শুরু';
	}

	start() {
		this.state = 'playing';
		document.getElementById('instructions').textContent = '';
	}

	reset() {
		this.score = 0;
		this.speed = CONFIG.BASE_SPEED;
		this.frameCount = 0;
		this.difficultyTimer = 0;
		this.wifeAnger = 0;
		this.screenShake = 0;

		this.player.reset();
		this.wife.reset();
		this.obstacleManager.reset();
		this.particleSystem.reset();

		this.state = 'menu';
	}


	update() {
		if (this.state !== 'playing') return;

		this.frameCount++;
		this.difficultyTimer++;

		if (this.difficultyTimer % CONFIG.SPEED_INTERVAL === 0 && this.speed < CONFIG.MAX_SPEED) {
			this.speed += CONFIG.SPEED_INCREMENT;
		}
		const scoreSpeed = CONFIG.BASE_SPEED + this.score * CONFIG.SCORE_SPEED_FACTOR;
		this.speed = Math.min(CONFIG.MAX_SPEED, Math.max(this.speed, scoreSpeed));

		this.score += Math.floor(this.speed * 0.5);

		this.player.update(this.input, this.particleSystem);
		this.wife.update(this.wifeAnger, this.player.x);
		this.particleSystem.update();
		this.background.update(this.speed);

		const results = this.obstacleManager.update(
			this.speed, this.difficultyTimer, this.player, this.state
		);

		results.hits.forEach(obs => {
			this.wifeAnger = Math.min(CONFIG.ANGER_MAX, this.wifeAnger + CONFIG.ANGER_HIT_AMOUNT);
			this.player.onHit(this.particleSystem);
			this.screenShake = 10;
			this.particleSystem.spawn(obs.x + obs.w / 2, obs.y - obs.h / 2, '#ff8a65');
			this.renderer.spawnHitText(
				this.player.x + this.player.w / 2,
				this.player.y - this.player.h - 10
			);
		});

		results.dodged.forEach(() => {
			this.score += 100;
			this.wifeAnger = Math.max(0, this.wifeAnger - CONFIG.ANGER_DODGE_RELIEF);
		});

		// Running dust
		if (this.frameCount % 4 === 0 && !this.player.isJumping) {
			this.particleSystem.spawn(this.player.x + 5, CONFIG.GROUND_Y, '#a1887f');
		}

		if (this.frameCount % 280 === 0 && this.wifeAnger > 15) {
			this.renderer.spawnSalmaText(
				this.wife.x + this.wife.w / 2,
				this.wife.y - this.wife.h
			);
		}

		if (this.screenShake > 0) this.screenShake *= 0.8;

		if (this.wifeAnger >= CONFIG.ANGER_MAX) {
			this.state = 'gameover';
			if (this.score > this.highScore) {
				this.highScore = this.score;
				localStorage.setItem('runBhaiHighScore', this.highScore);
			}
		}
	}


	draw() {
		const ctx = this.ctx;

		ctx.save();

		if (this.screenShake > 0.5) {
			ctx.translate(
				(Math.random() - 0.5) * this.screenShake,
				(Math.random() - 0.5) * this.screenShake
			);
		}

		this.background.draw(ctx, this.frameCount);

		this.renderer.drawObstacles(this.obstacleManager.obstacles, this.frameCount);

		this.particleSystem.draw(ctx);

		this.renderer.updateAndDrawHitTexts(ctx);

		if (this.state === 'playing' || this.state === 'gameover') {
			this.renderer.drawWife(this.wife, this.frameCount);
		}

		this.renderer.drawPlayer(this.player, this.frameCount, this.wifeAnger);

		if (this.state === 'playing') {
			this.renderer.drawHUD(this.score, this.highScore, this.wifeAnger, this.speed);
		}

		ctx.restore();

		if (this.state === 'menu') {
			this.renderer.drawMenu(this.frameCount, this.highScore);
		}
		if (this.state === 'gameover') {
			this.renderer.drawGameOver(this.score, this.highScore, this.frameCount);
		}
	}


	run() {
		const loop = () => {
			this.update();
			this.draw();
			this.frameCount++;
			requestAnimationFrame(loop);
		};
		loop();
	}
}
