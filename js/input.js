
class InputHandler {
	constructor(canvas, game) {
		this.keys = {};
		this.canvas = canvas;
		this.game = game;

		this._onKeyDown = this._onKeyDown.bind(this);
		this._onKeyUp = this._onKeyUp.bind(this);
		this._onTap = this._onTap.bind(this);
		this._onJumpBtn = this._onJumpBtn.bind(this);
		this._onDuckBtn = this._onDuckBtn.bind(this);

		document.addEventListener('keydown', this._onKeyDown);
		document.addEventListener('keyup', this._onKeyUp);
		canvas.addEventListener('touchstart', this._onTap);
		canvas.addEventListener('click', this._onTap);

		this.jumpBtn = document.getElementById('jumpBtn');
		this.duckBtn = document.getElementById('duckBtn');

		if (this.jumpBtn) {
			this.jumpBtn.addEventListener('touchstart', this._onJumpBtn);
			this.jumpBtn.addEventListener('mousedown', this._onJumpBtn);
		}
		if (this.duckBtn) {
			this.duckBtn.addEventListener('touchstart', this._onDuckBtn);
			this.duckBtn.addEventListener('touchend', () => this.keys['ArrowDown'] = false);
			this.duckBtn.addEventListener('mousedown', this._onDuckBtn);
			this.duckBtn.addEventListener('mouseup', () => this.keys['ArrowDown'] = false);
		}
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
	}

	_onJumpBtn(e) {
		e.preventDefault();

		if (this.game.state === 'menu') { this.game.start(); return; }
		if (this.game.state === 'gameover') { this.game.reset(); return; }

		if (this.game.state === 'playing') {
			this.keys['Space'] = true;
			setTimeout(() => this.keys['Space'] = false, 100);
		}
	}

	_onDuckBtn(e) {
		e.preventDefault();

		if (this.game.state === 'menu') { this.game.start(); return; }
		if (this.game.state === 'gameover') { this.game.reset(); return; }

		if (this.game.state === 'playing') {
			this.keys['ArrowDown'] = true;
		}
	}

	isJumping() {
		return this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'];
	}

	isDucking() {
		return this.keys['ArrowDown'] || this.keys['KeyS'];
	}

	destroy() {
		document.removeEventListener('keydown', this._onKeyDown);
		document.removeEventListener('keyup', this._onKeyUp);
		this.canvas.removeEventListener('touchstart', this._onTap);
		this.canvas.removeEventListener('click', this._onTap);

		if (this.jumpBtn) {
			this.jumpBtn.removeEventListener('touchstart', this._onJumpBtn);
			this.jumpBtn.removeEventListener('mousedown', this._onJumpBtn);
		}
		if (this.duckBtn) {
			this.duckBtn.removeEventListener('touchstart', this._onDuckBtn);
			this.duckBtn.removeEventListener('mousedown', this._onDuckBtn);
		}
	}
}
