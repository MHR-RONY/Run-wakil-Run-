/* ============================================================
   RUN BHAI RUN! — Entry Point (bootstrap)
   ============================================================ */

window.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('gameCanvas');
	const game = new Game(canvas);
	game.run();
});
