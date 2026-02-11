/* ============================================================
   RUN BHAI RUN! — Input Handler
   ============================================================ */

class InputHandler {
	constructor(canvas, game) {
		this.keys = {};
		this.canvas = canvas;
		this.game = game;

		this._onKeyDown = this._onKeyDown.bind(this);
		this._onKeyUp = this._onKeyUp.bind(this);
		this._onTap = this._onTap.bind(this);

		document.addEventListener('keydown', this._onKeyDown);
		document.addEventListener('keyup', this._onKeyUp);
		canvas.addEventListener('touchstart', this._onTap);
		canvas.addEventListener('click', this._onTap);
	}

	_onKeyDown(e) {
		this.keys[e.code] = true;

		if (this.game.state === 'menu' && (e.code === 'Space' || e.code === 'Enter')) {
			this.game.start();
		}
		if (this.game.state === 'gameover' && (e.code === 'Space' || e.code === 'Enter')) {
			this.game.reset();
		}
	}

	_onKeyUp(e) {
		this.keys[e.code] = false;
	}

	_onTap(e) {
		e.preventDefault();

		if (this.game.state === 'menu') { this.game.start(); return; }
		if (this.game.state === 'gameover') { this.game.reset(); return; }

		if (this.game.state === 'playing') {
			const rect = this.canvas.getBoundingClientRect();
			const tapY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

			if (tapY > CONFIG.HEIGHT * 0.6) {
				this.keys['ArrowDown'] = true;
				setTimeout(() => this.keys['ArrowDown'] = false, 300);
			} else {
				this.keys['Space'] = true;
				setTimeout(() => this.keys['Space'] = false, 100);
			}
		}
	}

	/** Check if jump keys are pressed */
	isJumping() {
		return this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'];
	}

	/** Check if duck keys are pressed */
	isDucking() {
		return this.keys['ArrowDown'] || this.keys['KeyS'];
	}

	destroy() {
		document.removeEventListener('keydown', this._onKeyDown);
		document.removeEventListener('keyup', this._onKeyUp);
		this.canvas.removeEventListener('touchstart', this._onTap);
		this.canvas.removeEventListener('click', this._onTap);
	}
}
