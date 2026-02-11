/* ============================================================
   RUN BHAI RUN! — Obstacle Manager
   ============================================================ */

class ObstacleManager {
	constructor() {
		this.obstacles = [];
		this.spawnTimer = 0;
	}

	reset() {
		this.obstacles = [];
		this.spawnTimer = 0;
	}

	update(speed, difficultyTimer, player, gameState) {
		this.spawnTimer++;
		const minInterval = Math.max(
			CONFIG.MIN_OBSTACLE_INTERVAL,
			CONFIG.BASE_OBSTACLE_INTERVAL - difficultyTimer / 200
		);

		if (this.spawnTimer > minInterval + Math.random() * 40) {
			this._spawn();
			this.spawnTimer = 0;
		}

		// Move and check each obstacle
		const results = { hits: [], dodged: [] };

		for (let i = this.obstacles.length - 1; i >= 0; i--) {
			const obs = this.obstacles[i];
			obs.x -= speed;

			// Collision detection
			const playerBox = player.getHitbox();
			if (!obs.passed && this._checkCollision(playerBox, obs)) {
				obs.passed = true;
				results.hits.push(obs);
			}

			// Successfully dodged
			if (!obs.passed && obs.x + obs.w < player.x) {
				obs.passed = true;
				results.dodged.push(obs);
			}

			// Remove off-screen
			if (obs.x + obs.w < -20) {
				this.obstacles.splice(i, 1);
			}
		}

		return results;
	}

	_spawn() {
		const typeData = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
		this.obstacles.push({
			x: CONFIG.WIDTH + 20,
			y: CONFIG.GROUND_Y + typeData.yOffset,
			w: typeData.w,
			h: typeData.h,
			type: typeData.type,
			needJump: typeData.needJump,
			needDuck: typeData.needDuck,
			passed: false,
		});
	}

	_checkCollision(a, b) {
		const s = CONFIG.COLLISION_SHRINK;
		return (
			a.x + s < b.x + b.w - s &&
			a.x + a.w - s > b.x + s &&
			a.y - a.h + s < b.y &&
			a.y > b.y - b.h + s
		);
	}
}
