
class Wife {
	constructor() {
		this.x = CONFIG.WIFE_START_X;
		this.baseX = CONFIG.WIFE_START_X;
		this.y = CONFIG.GROUND_Y;
		this.w = 55;
		this.h = 90;
		this.runFrame = 0;
		this.runTimer = 0;
		this.belanAngle = 0;
		this.anger = 0;
		this.sareeColor = '#f5f0e1';
	}

	reset() {
		this.x = CONFIG.WIFE_START_X;
		this.baseX = CONFIG.WIFE_START_X;
		this.anger = 0;
	}

	update(wifeAnger, playerX) {
		this.runTimer++;
		if (this.runTimer % 5 === 0) {
			this.runFrame = (this.runFrame + 1) % 4;
		}

		this.belanAngle += 0.15;
		this.anger = wifeAnger;

		const targetX = CONFIG.WIFE_START_X + (wifeAnger / CONFIG.ANGER_MAX) * (playerX - 10);
		this.x += (targetX - this.x) * 0.03;
	}
}
