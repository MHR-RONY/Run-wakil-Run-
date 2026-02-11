
class Player {
	constructor() {
		this.x = CONFIG.PLAYER_X;
		this.y = CONFIG.GROUND_Y;
		this.w = CONFIG.PLAYER_W;
		this.h = CONFIG.PLAYER_H;
		this.vy = 0;
		this.isJumping = false;
		this.isDucking = false;
		this.runFrame = 0;
		this.runTimer = 0;
		this.hitTimer = 0;
		this.shirtColor = '#a8d5e2';
		this.pantColor = '#9ec4d1';
	}

	reset() {
		this.y = CONFIG.GROUND_Y;
		this.vy = 0;
		this.isJumping = false;
		this.isDucking = false;
		this.hitTimer = 0;
	}

	update(input, particleSystem) {
		if (input.isJumping() && !this.isJumping && !this.isDucking) {
			this.vy = CONFIG.JUMP_FORCE;
			this.isJumping = true;
		}

		this.isDucking = input.isDucking() && !this.isJumping;

		if (this.isJumping || this.y < CONFIG.GROUND_Y) {
			this.vy += CONFIG.GRAVITY;
			this.y += this.vy;
			if (this.y >= CONFIG.GROUND_Y) {
				this.y = CONFIG.GROUND_Y;
				this.vy = 0;
				this.isJumping = false;
				particleSystem.spawn(this.x + this.w / 2, CONFIG.GROUND_Y, '#8d6e63');
			}
		}

		this.runTimer++;
		if (this.runTimer % 6 === 0) {
			this.runFrame = (this.runFrame + 1) % 4;
		}

		if (this.hitTimer > 0) this.hitTimer--;
	}

	getHitbox() {
		return {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.isDucking ? CONFIG.PLAYER_DUCK_H : this.h,
		};
	}

	onHit(particleSystem) {
		this.hitTimer = 20;
		particleSystem.spawn(this.x + this.w / 2, this.y - this.h / 2, '#ef5350');
	}
}
