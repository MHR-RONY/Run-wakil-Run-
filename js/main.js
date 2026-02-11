
window.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('gameCanvas');
	const game = new Game(canvas);

	function resizeCanvas() {
		const container = document.getElementById('gameContainer');
		const maxWidth = Math.min(window.innerWidth - 20, CONFIG.WIDTH);
		const scale = maxWidth / CONFIG.WIDTH;

		if (window.innerWidth <= 768) {
			canvas.style.width = maxWidth + 'px';
			canvas.style.height = (CONFIG.HEIGHT * scale) + 'px';
		} else {
			canvas.style.width = CONFIG.WIDTH + 'px';
			canvas.style.height = CONFIG.HEIGHT + 'px';
		}
	}

	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
	window.addEventListener('orientationchange', resizeCanvas);

	game.run();
});
