/* ============================================================
   পালা ওয়াকিল পালা! — Main Game Controller
   ============================================================ */

class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		// Set canvas size
		canvas.width = CONFIG.WIDTH;
		canvas.height = CONFIG.HEIGHT;

		// Game state
		this.state = 'menu'; // menu | playing | gameover
		this.score = 0;
		this.highScore = parseInt(localStorage.getItem('runBhaiHighScore')) || 0;
		this.speed = CONFIG.BASE_SPEED;
		this.frameCount = 0;
		this.difficultyTimer = 0;
		this.screenShake = 0;
		this.wifeAnger = 0;

		// Sub-systems
		this.player = new Player();
		this.wife = new Wife();
		this.obstacleManager = new ObstacleManager();
		this.particleSystem = new ParticleSystem();
		this.background = new Background();
		this.renderer = new Renderer(this.ctx);
		this.input = new InputHandler(canvas, this);

		// Show initial hint
		document.getElementById('instructions').textContent = '⬆ Jump  |  ⬇ Duck  |  Space দিয়ে শুরু';
	}

	/** Transition from menu to playing */
	start() {
		this.state = 'playing';
		document.getElementById('instructions').textContent = '';
	}

	/** Full reset back to menu */
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

	// ----------------------------------------------------------
	//  UPDATE
	// ----------------------------------------------------------

	update() {
		if (this.state !== 'playing') return;

		this.frameCount++;
		this.difficultyTimer++;

		// Increase speed over time + score-based
		if (this.difficultyTimer % CONFIG.SPEED_INTERVAL === 0 && this.speed < CONFIG.MAX_SPEED) {
			this.speed += CONFIG.SPEED_INCREMENT;
		}
		// Also scale speed gently with score
		const scoreSpeed = CONFIG.BASE_SPEED + this.score * CONFIG.SCORE_SPEED_FACTOR;
		this.speed = Math.min(CONFIG.MAX_SPEED, Math.max(this.speed, scoreSpeed));

		// Passive score
		this.score += Math.floor(this.speed * 0.5);

		// Update sub-systems
		this.player.update(this.input, this.particleSystem);
		this.wife.update(this.wifeAnger, this.player.x);
		this.particleSystem.update();
		this.background.update(this.speed);

		// Obstacles — returns { hits, dodged }
		const results = this.obstacleManager.update(
			this.speed, this.difficultyTimer, this.player, this.state
		);

		// Handle hits
		results.hits.forEach(obs => {
			this.wifeAnger = Math.min(CONFIG.ANGER_MAX, this.wifeAnger + CONFIG.ANGER_HIT_AMOUNT);
			this.player.onHit(this.particleSystem);
			this.screenShake = 10;
			this.particleSystem.spawn(obs.x + obs.w / 2, obs.y - obs.h / 2, '#ff8a65');
			// Spawn funny Bengali floating text
			this.renderer.spawnHitText(
				this.player.x + this.player.w / 2,
				this.player.y - this.player.h - 10
			);
		});

		// Handle dodges
		results.dodged.forEach(() => {
			this.score += 100;
			this.wifeAnger = Math.max(0, this.wifeAnger - CONFIG.ANGER_DODGE_RELIEF);
		});

		// Running dust
		if (this.frameCount % 4 === 0 && !this.player.isJumping) {
			this.particleSystem.spawn(this.player.x + 5, CONFIG.GROUND_Y, '#a1887f');
		}

		// Salma periodically yells funny things while chasing
		if (this.frameCount % 280 === 0 && this.wifeAnger > 15) {
			this.renderer.spawnSalmaText(
				this.wife.x + this.wife.w / 2,
				this.wife.y - this.wife.h
			);
		}

		// Screen shake decay
		if (this.screenShake > 0) this.screenShake *= 0.8;

		// Check game over
		if (this.wifeAnger >= CONFIG.ANGER_MAX) {
			this.state = 'gameover';
			if (this.score > this.highScore) {
				this.highScore = this.score;
				localStorage.setItem('runBhaiHighScore', this.highScore);
			}
		}
	}

	// ----------------------------------------------------------
	//  DRAW
	// ----------------------------------------------------------

	draw() {
		const ctx = this.ctx;

		ctx.save();

		// Screen shake
		if (this.screenShake > 0.5) {
			ctx.translate(
				(Math.random() - 0.5) * this.screenShake,
				(Math.random() - 0.5) * this.screenShake
			);
		}

		// Background layers
		this.background.draw(ctx, this.frameCount);

		// Obstacles
		this.renderer.drawObstacles(this.obstacleManager.obstacles, this.frameCount);

		// Particles
		this.particleSystem.draw(ctx);

		// Floating hit texts
		this.renderer.updateAndDrawHitTexts(ctx);

		// Wife (behind player)
		if (this.state === 'playing' || this.state === 'gameover') {
			this.renderer.drawWife(this.wife, this.frameCount);
		}

		// Player
		this.renderer.drawPlayer(this.player, this.frameCount, this.wifeAnger);

		// HUD
		if (this.state === 'playing') {
			this.renderer.drawHUD(this.score, this.highScore, this.wifeAnger, this.speed);
		}

		ctx.restore();

		// Overlays
		if (this.state === 'menu') {
			this.renderer.drawMenu(this.frameCount, this.highScore);
		}
		if (this.state === 'gameover') {
			this.renderer.drawGameOver(this.score, this.highScore, this.frameCount);
		}
	}

	// ----------------------------------------------------------
	//  GAME LOOP
	// ----------------------------------------------------------

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
