/* ============================================================
   পালা ওয়াকিল পালা! — Renderer (all draw routines)
   ============================================================ */

class Renderer {
	constructor(ctx) {
		this.ctx = ctx;
		this.hitTexts = [];   // floating Bengali hit-text bubbles

		// Load Wakil head image
		this.wakilHead = new Image();
		this.wakilHead.src = 'public/wakil.png';
		this.wakilHeadLoaded = false;
		this.wakilHead.onload = () => { this.wakilHeadLoaded = true; };

		this._polyfillRoundRect();
	}

	// ----------------------------------------------------------
	//  Floating Bengali hit-text system
	// ----------------------------------------------------------

	spawnHitText(x, y) {
		const text = BANGLA_HIT_TEXTS[Math.floor(Math.random() * BANGLA_HIT_TEXTS.length)];
		this.hitTexts.push({
			x, y,
			text,
			vy: -1.0,
			life: 180,
			maxLife: 180,
			scale: 0,
			color: ['#ff5252', '#ffeb3b', '#ff9800', '#e040fb', '#69f0ae'][Math.floor(Math.random() * 5)],
		});
	}

	spawnSalmaText(x, y) {
		const text = SALMA_CHASE_TEXTS[Math.floor(Math.random() * SALMA_CHASE_TEXTS.length)];
		this.hitTexts.push({
			x, y: y - 30,
			text,
			vy: -0.6,
			life: 200,
			maxLife: 200,
			scale: 0,
			isSalma: true,
			color: '#ff1744',
		});
	}

	updateAndDrawHitTexts(ctx) {
		for (let i = this.hitTexts.length - 1; i >= 0; i--) {
			const t = this.hitTexts[i];
			t.y += t.vy;
			t.vy *= 0.98;
			t.life--;
			// Pop-in scale
			if (t.scale < 1) t.scale = Math.min(1, t.scale + 0.12);

			const alpha = Math.min(1, t.life / 40);
			ctx.save();
			ctx.globalAlpha = alpha;
			ctx.translate(t.x, t.y);
			ctx.scale(t.scale, t.scale);

			const fontSize = t.isSalma ? 12 : 20;
			ctx.font = `bold ${fontSize}px Arial, sans-serif`;
			ctx.textAlign = 'center';

			if (t.isSalma) {
				// Speech-bubble style for Salma
				const tw = ctx.measureText(t.text).width + 14;
				ctx.fillStyle = 'rgba(255,255,255,0.92)';
				ctx.beginPath();
				ctx.roundRect(-tw / 2, -14, tw, 22, 8);
				ctx.fill();
				ctx.strokeStyle = '#f44336';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.roundRect(-tw / 2, -14, tw, 22, 8);
				ctx.stroke();
				// Tail
				ctx.fillStyle = 'rgba(255,255,255,0.92)';
				ctx.beginPath();
				ctx.moveTo(-3, 8); ctx.lineTo(3, 8); ctx.lineTo(0, 14);
				ctx.closePath(); ctx.fill();
				ctx.fillStyle = '#d32f2f';
				ctx.fillText(t.text, 0, 1);
			} else {
				// Outline text for Wakil
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 4;
				ctx.strokeText(t.text, 0, 0);
				ctx.fillStyle = t.color;
				ctx.fillText(t.text, 0, 0);
			}
			ctx.restore();

			if (t.life <= 0) this.hitTexts.splice(i, 1);
		}
	}

	// ----------------------------------------------------------
	//  Character drawing
	// ----------------------------------------------------------

	drawPlayer(player, frameCount, wifeAnger) {
		this._drawHusband(player, frameCount, wifeAnger);
	}

	drawWife(wife, frameCount) {
		this._drawWifeCharacter(wife, frameCount);
	}

	// ----------------------------------------------------------
	//  HUSBAND — cream kurta, beard, big cartoon scared eyes
	// ----------------------------------------------------------

	_drawHusband(p, fc, anger) {
		const ctx = this.ctx;
		const cx = p.x + p.w / 2;  // center x
		const isDuck = p.isDucking;
		const isHit = p.hitTimer > 0;

		ctx.save();
		if (isHit && Math.floor(fc / 3) % 2 === 0) ctx.globalAlpha = 0.5;

		const groundY = p.y;
		const headR = 18;
		const bodyTop = isDuck ? groundY - 40 : groundY - 65;
		const headCY = isDuck ? bodyTop - 6 : bodyTop - 14;
		const legSwing = Math.sin(p.runFrame * Math.PI / 2) * 16;
		const armSwing = Math.sin(p.runFrame * Math.PI / 2) * 18;

		// Shadow
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		ctx.beginPath();
		ctx.ellipse(cx, groundY + 3, 26, 6, 0, 0, Math.PI * 2);
		ctx.fill();

		// --- Legs ---
		ctx.strokeStyle = '#c4a882';
		ctx.lineWidth = 7;
		ctx.lineCap = 'round';
		if (!isDuck) {
			ctx.beginPath(); ctx.moveTo(cx - 4, groundY - 28); ctx.lineTo(cx - 4 + legSwing, groundY); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(cx + 4, groundY - 28); ctx.lineTo(cx + 4 - legSwing, groundY); ctx.stroke();
		} else {
			ctx.beginPath(); ctx.moveTo(cx - 6, groundY - 12); ctx.lineTo(cx - 16, groundY); ctx.stroke();
			ctx.beginPath(); ctx.moveTo(cx + 6, groundY - 12); ctx.lineTo(cx + 16, groundY); ctx.stroke();
		}

		// Shoes (brown)
		if (!isDuck) {
			ctx.fillStyle = '#5d4037';
			ctx.beginPath();
			ctx.ellipse(cx - 4 + legSwing, groundY, 8, 4, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.ellipse(cx + 4 - legSwing, groundY, 8, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}

		// --- Kurta body (cream/beige) ---
		const bw = isDuck ? 42 : 34;
		const bh = isDuck ? 28 : 42;
		ctx.fillStyle = p.shirtColor;
		ctx.beginPath();
		ctx.roundRect(cx - bw / 2, bodyTop, bw, bh, 6);
		ctx.fill();
		// Kurta collar line
		ctx.strokeStyle = '#c4b08a';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(cx - 5, bodyTop);
		ctx.lineTo(cx, bodyTop + 10);
		ctx.lineTo(cx + 5, bodyTop);
		ctx.stroke();

		// --- Arms ---
		ctx.strokeStyle = p.shirtColor;
		ctx.lineWidth = 7;
		// Right arm
		ctx.beginPath();
		ctx.moveTo(cx + bw / 2 - 2, bodyTop + 8);
		ctx.lineTo(cx + bw / 2 + armSwing * 0.6, bodyTop + 24);
		ctx.stroke();
		// Left arm
		ctx.beginPath();
		ctx.moveTo(cx - bw / 2 + 2, bodyTop + 8);
		ctx.lineTo(cx - bw / 2 - armSwing * 0.6, bodyTop + 24);
		ctx.stroke();
		// Hands (skin color)
		ctx.fillStyle = '#deb887';
		ctx.beginPath();
		ctx.arc(cx + bw / 2 + armSwing * 0.6, bodyTop + 26, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(cx - bw / 2 - armSwing * 0.6, bodyTop + 26, 4, 0, Math.PI * 2);
		ctx.fill();

		// --- HEAD with bobbing motion ---
		const headBob = Math.sin(fc * 0.25) * 2.5;
		const headTilt = Math.sin(fc * 0.18) * 0.08;

		ctx.save();
		ctx.translate(cx, headCY + headBob);
		ctx.rotate(headTilt);

		if (this.wakilHeadLoaded) {
			// Draw the PNG image as the head
			const imgSize = isDuck ? 40 : 52;
			ctx.drawImage(this.wakilHead, -imgSize / 2, -imgSize / 2 - 4, imgSize, imgSize);
		} else {
			// Fallback circle if image hasn't loaded yet
			ctx.fillStyle = '#c68c53';
			ctx.beginPath();
			ctx.arc(0, 0, headR, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.restore(); // end head transform

		// Name label "ওয়াকিল" (above head)
		ctx.save();
		ctx.font = 'bold 12px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#fff';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 3;
		const labelY = isDuck ? headCY - headR - 12 + headBob : headCY - headR - 18 + headBob;
		ctx.strokeText('ওয়াকিল', cx, labelY);
		ctx.fillText('ওয়াকিল', cx, labelY);
		ctx.restore();

		ctx.restore();
	}

	// ----------------------------------------------------------
	//  WIFE — white/cream saree, bindi, angry eyes, rolling pin
	// ----------------------------------------------------------

	_drawWifeCharacter(w, fc) {
		const ctx = this.ctx;
		const cx = w.x + w.w / 2;
		const groundY = w.y;
		const headR = 16;
		const bodyTop = groundY - 65;
		const headCY = bodyTop - 12;
		const legSwing = Math.sin(w.runFrame * Math.PI / 2) * 14;
		const armSwing = Math.sin(w.runFrame * Math.PI / 2) * 12;

		ctx.save();

		// Shadow
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		ctx.beginPath();
		ctx.ellipse(cx, groundY + 3, 24, 6, 0, 0, Math.PI * 2);
		ctx.fill();

		// --- Legs (under saree) ---
		ctx.strokeStyle = '#deb887';
		ctx.lineWidth = 6;
		ctx.lineCap = 'round';
		ctx.beginPath(); ctx.moveTo(cx - 4, groundY - 20); ctx.lineTo(cx - 4 + legSwing * 0.5, groundY); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(cx + 4, groundY - 20); ctx.lineTo(cx + 4 - legSwing * 0.5, groundY); ctx.stroke();

		// Feet
		ctx.fillStyle = '#deb887';
		ctx.beginPath(); ctx.ellipse(cx - 4 + legSwing * 0.5, groundY, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
		ctx.beginPath(); ctx.ellipse(cx + 4 - legSwing * 0.5, groundY, 6, 3, 0, 0, Math.PI * 2); ctx.fill();

		// --- Saree body (white/cream with gold border) ---
		ctx.fillStyle = w.sareeColor;
		ctx.beginPath();
		ctx.roundRect(cx - 18, bodyTop, 36, 48, 5);
		ctx.fill();
		// Gold border at bottom
		ctx.fillStyle = '#c9a84c';
		ctx.fillRect(cx - 18, bodyTop + 42, 36, 6);
		// Saree drape (pallu)
		ctx.fillStyle = 'rgba(245,240,225,0.7)';
		ctx.beginPath();
		ctx.moveTo(cx + 16, bodyTop + 5);
		ctx.quadraticCurveTo(cx + 28, bodyTop + 20, cx + 22, bodyTop + 40);
		ctx.lineTo(cx + 16, bodyTop + 40);
		ctx.closePath();
		ctx.fill();
		// Gold stripe on pallu
		ctx.strokeStyle = '#c9a84c';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(cx + 17, bodyTop + 5);
		ctx.quadraticCurveTo(cx + 27, bodyTop + 20, cx + 21, bodyTop + 40);
		ctx.stroke();

		// --- Left arm (swinging) ---
		ctx.strokeStyle = '#deb887';
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(cx - 16, bodyTop + 8);
		ctx.lineTo(cx - 16 - armSwing * 0.5, bodyTop + 28);
		ctx.stroke();

		// --- Right arm (holding belan/rolling pin raised) ---
		ctx.strokeStyle = '#deb887';
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(cx + 16, bodyTop + 8);
		ctx.lineTo(cx + 26, bodyTop - 10);
		ctx.stroke();

		// Rolling pin (belan)
		ctx.save();
		ctx.translate(cx + 28, bodyTop - 16);
		ctx.rotate(Math.sin(w.belanAngle) * 0.6 - 0.3);
		// Handle
		ctx.fillStyle = '#8d6e63';
		ctx.beginPath();
		ctx.roundRect(-4, -18, 8, 36, 3);
		ctx.fill();
		// Grip ends
		ctx.fillStyle = '#6d4c41';
		ctx.beginPath();
		ctx.roundRect(-5, -20, 10, 6, 2);
		ctx.fill();
		ctx.beginPath();
		ctx.roundRect(-5, 16, 10, 6, 2);
		ctx.fill();
		ctx.restore();

		// Hand
		ctx.fillStyle = '#deb887';
		ctx.beginPath();
		ctx.arc(cx + 26, bodyTop - 10, 4, 0, Math.PI * 2);
		ctx.fill();

		// --- Head ---
		ctx.fillStyle = '#deb887';
		ctx.beginPath();
		ctx.arc(cx, headCY, headR, 0, Math.PI * 2);
		ctx.fill();

		// Hair (dark, with bun)
		ctx.fillStyle = '#1a1a1a';
		ctx.beginPath();
		ctx.arc(cx, headCY - 2, headR + 1, Math.PI, 0);
		ctx.fill();
		// Hair sides
		ctx.fillRect(cx - headR - 1, headCY - 4, 5, 12);
		ctx.fillRect(cx + headR - 4, headCY - 4, 5, 12);
		// Hair bun
		ctx.beginPath();
		ctx.arc(cx - 10, headCY - 10, 8, 0, Math.PI * 2);
		ctx.fill();
		// Bun decoration
		ctx.fillStyle = '#c9a84c';
		ctx.beginPath();
		ctx.arc(cx - 10, headCY - 12, 3, 0, Math.PI * 2);
		ctx.fill();

		// --- Bindi (red dot) ---
		ctx.fillStyle = '#d32f2f';
		ctx.beginPath();
		ctx.arc(cx, headCY - 8, 3, 0, Math.PI * 2);
		ctx.fill();

		// --- Angry eyes ---
		const eyeSpread = 7;
		const eyeY = headCY + 1;

		// Eye whites
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.ellipse(cx - eyeSpread, eyeY, 6, 6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(cx + eyeSpread, eyeY, 6, 6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1.5;
		ctx.beginPath(); ctx.ellipse(cx - eyeSpread, eyeY, 6, 6, 0, 0, Math.PI * 2); ctx.stroke();
		ctx.beginPath(); ctx.ellipse(cx + eyeSpread, eyeY, 6, 6, 0, 0, Math.PI * 2); ctx.stroke();

		// Angry pupils
		ctx.fillStyle = '#000';
		ctx.beginPath(); ctx.arc(cx - eyeSpread + 1, eyeY + 1, 3, 0, Math.PI * 2); ctx.fill();
		ctx.beginPath(); ctx.arc(cx + eyeSpread + 1, eyeY + 1, 3, 0, Math.PI * 2); ctx.fill();

		// Angry eyebrows (V-shape)
		ctx.strokeStyle = '#1a1a1a';
		ctx.lineWidth = 3;
		ctx.beginPath(); ctx.moveTo(cx - eyeSpread - 6, eyeY - 7); ctx.lineTo(cx - eyeSpread + 3, eyeY - 10); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(cx + eyeSpread + 6, eyeY - 7); ctx.lineTo(cx + eyeSpread - 3, eyeY - 10); ctx.stroke();

		// --- Angry mouth (teeth gritting) ---
		ctx.fillStyle = '#8b0000';
		ctx.beginPath();
		ctx.roundRect(cx - 6, headCY + 9, 12, 6, 2);
		ctx.fill();
		// Teeth
		ctx.fillStyle = '#fff';
		ctx.fillRect(cx - 5, headCY + 9, 10, 3);
		ctx.strokeStyle = '#999';
		ctx.lineWidth = 0.5;
		for (let t = cx - 4; t < cx + 5; t += 3) {
			ctx.beginPath(); ctx.moveTo(t, headCY + 9); ctx.lineTo(t, headCY + 12); ctx.stroke();
		}

		// Nose
		ctx.fillStyle = '#c4956a';
		ctx.beginPath();
		ctx.moveTo(cx, headCY + 2);
		ctx.lineTo(cx + 3, headCY + 6);
		ctx.lineTo(cx - 3, headCY + 6);
		ctx.fill();

		// Anger veins
		ctx.strokeStyle = '#f44336';
		ctx.lineWidth = 1.5;
		const veinX = cx + headR + 2;
		const veinY = headCY - headR + 4;
		ctx.beginPath();
		ctx.moveTo(veinX, veinY); ctx.lineTo(veinX + 5, veinY - 3);
		ctx.moveTo(veinX, veinY); ctx.lineTo(veinX + 5, veinY + 3);
		ctx.moveTo(veinX, veinY); ctx.lineTo(veinX - 2, veinY - 5);
		ctx.moveTo(veinX, veinY); ctx.lineTo(veinX - 2, veinY + 5);
		ctx.stroke();

		// Name label "সলমা"
		ctx.font = 'bold 11px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#ffcdd2';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 3;
		ctx.strokeText('সলমা', cx, headCY - headR - 10);
		ctx.fillText('সলমা', cx, headCY - headR - 10);

		ctx.restore();
	}

	// ----------------------------------------------------------
	//  Obstacle drawing
	// ----------------------------------------------------------

	drawObstacles(obstacles, frameCount) {
		obstacles.forEach(obs => this._drawObstacle(obs, frameCount));
	}

	_drawObstacle(obs, frameCount) {
		const ctx = this.ctx;
		ctx.save();

		switch (obs.type) {
			case 'rock':
				ctx.fillStyle = '#9fb8c5';
				ctx.beginPath();
				ctx.moveTo(obs.x + obs.w / 2, obs.y - obs.h);
				ctx.lineTo(obs.x + obs.w, obs.y);
				ctx.lineTo(obs.x, obs.y);
				ctx.closePath();
				ctx.fill();
				ctx.fillStyle = '#b4cad4';
				ctx.beginPath();
				ctx.moveTo(obs.x + obs.w / 2, obs.y - obs.h);
				ctx.lineTo(obs.x + obs.w * 0.7, obs.y - obs.h * 0.4);
				ctx.lineTo(obs.x + obs.w, obs.y);
				ctx.lineTo(obs.x + obs.w / 2, obs.y);
				ctx.closePath();
				ctx.fill();
				break;

			case 'barrel': {
				const grad = ctx.createLinearGradient(obs.x, 0, obs.x + obs.w, 0);
				grad.addColorStop(0, '#6d4c41');
				grad.addColorStop(0.5, '#8d6e63');
				grad.addColorStop(1, '#5d4037');
				ctx.fillStyle = grad;
				ctx.beginPath();
				ctx.roundRect(obs.x, obs.y - obs.h, obs.w, obs.h, 4);
				ctx.fill();
				ctx.strokeStyle = '#9e9e9e';
				ctx.lineWidth = 2;
				ctx.beginPath(); ctx.moveTo(obs.x, obs.y - obs.h * 0.25); ctx.lineTo(obs.x + obs.w, obs.y - obs.h * 0.25); ctx.stroke();
				ctx.beginPath(); ctx.moveTo(obs.x, obs.y - obs.h * 0.75); ctx.lineTo(obs.x + obs.w, obs.y - obs.h * 0.75); ctx.stroke();
				break;
			}

			case 'bird': {
				const birdY = obs.y + Math.sin(frameCount * 0.1) * 5;
				ctx.fillStyle = '#7eb3d4';
				ctx.beginPath();
				ctx.ellipse(obs.x + obs.w / 2, birdY - obs.h / 2, obs.w / 3, obs.h / 3, 0, 0, Math.PI * 2);
				ctx.fill();
				const wingY = Math.sin(frameCount * 0.2) * 8;
				ctx.beginPath();
				ctx.moveTo(obs.x + obs.w / 2 - 5, birdY - obs.h / 2);
				ctx.lineTo(obs.x, birdY - obs.h / 2 - 15 + wingY);
				ctx.lineTo(obs.x + obs.w / 2 - 15, birdY - obs.h / 2);
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(obs.x + obs.w / 2 + 5, birdY - obs.h / 2);
				ctx.lineTo(obs.x + obs.w, birdY - obs.h / 2 - 15 + wingY);
				ctx.lineTo(obs.x + obs.w / 2 + 15, birdY - obs.h / 2);
				ctx.fill();
				// Beak
				ctx.fillStyle = '#ffa726';
				ctx.beginPath();
				ctx.moveTo(obs.x + obs.w / 2 + 10, birdY - obs.h / 2 - 2);
				ctx.lineTo(obs.x + obs.w / 2 + 18, birdY - obs.h / 2);
				ctx.lineTo(obs.x + obs.w / 2 + 10, birdY - obs.h / 2 + 2);
				ctx.fill();
				// Eye
				ctx.fillStyle = '#fff';
				ctx.beginPath(); ctx.arc(obs.x + obs.w / 2 + 6, birdY - obs.h / 2 - 3, 3, 0, Math.PI * 2); ctx.fill();
				ctx.fillStyle = '#000';
				ctx.beginPath(); ctx.arc(obs.x + obs.w / 2 + 7, birdY - obs.h / 2 - 3, 1.5, 0, Math.PI * 2); ctx.fill();
				// Warning
				ctx.fillStyle = '#ffeb3b';
				ctx.font = 'bold 11px Arial';
				ctx.fillText('DUCK!', obs.x + 2, birdY - obs.h / 2 - 20);
				break;
			}

			case 'cart':
				ctx.fillStyle = '#795548';
				ctx.beginPath();
				ctx.roundRect(obs.x, obs.y - obs.h, obs.w, obs.h - 10, 3);
				ctx.fill();
				ctx.fillStyle = '#4e342e';
				ctx.fillRect(obs.x + 2, obs.y - obs.h + 5, obs.w - 4, 8);
				ctx.fillStyle = '#424242';
				ctx.beginPath(); ctx.arc(obs.x + 12, obs.y - 3, 7, 0, Math.PI * 2); ctx.fill();
				ctx.beginPath(); ctx.arc(obs.x + obs.w - 12, obs.y - 3, 7, 0, Math.PI * 2); ctx.fill();
				ctx.fillStyle = '#757575';
				ctx.beginPath(); ctx.arc(obs.x + 12, obs.y - 3, 3, 0, Math.PI * 2); ctx.fill();
				ctx.beginPath(); ctx.arc(obs.x + obs.w - 12, obs.y - 3, 3, 0, Math.PI * 2); ctx.fill();
				break;

			case 'sign': {
				// Pole
				ctx.fillStyle = '#795548';
				ctx.fillRect(obs.x + obs.w / 2 - 3, obs.y - obs.h, 6, obs.h);
				// Sign board
				ctx.fillStyle = '#f44336';
				const signY = obs.y - obs.h;
				const signW = obs.w + 10;
				const signX = obs.x + obs.w / 2 - signW / 2;
				ctx.beginPath();
				ctx.roundRect(signX, signY, signW, 24, 4);
				ctx.fill();
				// White border
				ctx.strokeStyle = '#fff';
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.roundRect(signX + 3, signY + 3, signW - 6, 18, 2);
				ctx.stroke();
				// STOP text centered
				ctx.fillStyle = '#fff';
				ctx.font = 'bold 12px Arial';
				ctx.textAlign = 'center';
				ctx.fillText('STOP', obs.x + obs.w / 2, signY + 18);
				ctx.textAlign = 'left';
				break;
			}

			case 'lowBranch':
				ctx.strokeStyle = '#8d6e63';
				ctx.lineWidth = 6;
				ctx.beginPath();
				ctx.moveTo(obs.x + obs.w, obs.y - obs.h / 2);
				ctx.quadraticCurveTo(obs.x + obs.w * 0.6, obs.y - obs.h * 0.8, obs.x, obs.y - obs.h / 2);
				ctx.stroke();
				ctx.fillStyle = '#66bb6a';
				for (let i = 0; i < 5; i++) {
					const lx = obs.x + 5 + i * 10;
					const ly = obs.y - obs.h / 2 - 5 + Math.sin(i + frameCount * 0.05) * 3;
					ctx.beginPath();
					ctx.ellipse(lx, ly, 8, 5, Math.sin(i) * 0.5, 0, Math.PI * 2);
					ctx.fill();
				}
				ctx.fillStyle = '#ffeb3b';
				ctx.font = 'bold 11px Arial';
				ctx.fillText('DUCK!', obs.x + 5, obs.y - obs.h - 5);
				break;
		}

		ctx.restore();
	}

	// ----------------------------------------------------------
	//  HUD (score, anger bar, speed)
	// ----------------------------------------------------------

	drawHUD(score, highScore, wifeAnger, speed) {
		const ctx = this.ctx;
		const W = CONFIG.WIDTH;

		// Anger bar background
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.beginPath();
		ctx.roundRect(W / 2 - 150, 12, 300, 22, 11);
		ctx.fill();

		// Anger bar fill
		const angerColor = wifeAnger > 70 ? '#f44336' : wifeAnger > 40 ? '#ff9800' : '#4caf50';
		ctx.fillStyle = angerColor;
		ctx.beginPath();
		ctx.roundRect(W / 2 - 147, 15, (294 * wifeAnger / 100), 16, 8);
		ctx.fill();

		// Label
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 11px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(`সলমার রাগ: ${Math.floor(wifeAnger)}%`, W / 2, 27);

		// Icons
		ctx.font = '16px Arial';
		ctx.fillText('👠', W / 2 - 160, 28);
		ctx.fillText('🔥', W / 2 + 158, 28);

		// Score
		ctx.textAlign = 'left';
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 18px Arial';
		ctx.fillText(`Score: ${score}`, 15, 30);

		// Speed
		ctx.fillStyle = 'rgba(255,255,255,0.6)';
		ctx.font = '12px Arial';
		ctx.fillText(`Speed: ${speed.toFixed(1)}x`, 15, 48);

		// High score
		ctx.textAlign = 'right';
		ctx.fillStyle = '#ffd54f';
		ctx.font = '14px Arial';
		ctx.fillText(`Best: ${highScore}`, W - 15, 50);
	}

	// ----------------------------------------------------------
	//  Menu & Game-Over screens
	// ----------------------------------------------------------

	drawMenu(frameCount, highScore) {
		const ctx = this.ctx;
		const W = CONFIG.WIDTH;
		const H = CONFIG.HEIGHT;

		ctx.fillStyle = 'rgba(0,0,0,0.6)';
		ctx.fillRect(0, 0, W, H);

		ctx.textAlign = 'center';

		ctx.fillStyle = '#e94560';
		ctx.font = 'bold 44px Arial';
		ctx.fillText('পালা ওয়াকিল পালা!', W / 2, H / 2 - 60);

		ctx.fillStyle = '#ff9800';
		ctx.font = '18px Arial';
		ctx.fillText('🏃 সলমা রেগে গেছে! ওয়াকিল পালা জীবন বাঁচা! 🩴🔥', W / 2, H / 2 - 20);

		ctx.fillStyle = '#fff';
		ctx.font = '16px Arial';
		ctx.fillText('⬆ SPACE / UP  =  লাফাও (বাধা পার হও)', W / 2, H / 2 + 30);
		ctx.fillText('⬇ DOWN  =  নীচু হও (পাখি / ডাল এড়াও)', W / 2, H / 2 + 55);

		ctx.fillStyle = '#4fc3f7';
		ctx.font = 'bold 22px Arial';
		const pulse = Math.sin(frameCount * 0.05) * 0.3 + 0.7;
		ctx.globalAlpha = pulse;
		ctx.fillText('[ SPACE বা Tap করে শুরু করো ]', W / 2, H / 2 + 110);
		ctx.globalAlpha = 1;

		if (highScore > 0) {
			ctx.fillStyle = '#ffd54f';
			ctx.font = '15px Arial';
			ctx.fillText(`🏆 High Score: ${highScore}`, W / 2, H / 2 + 145);
		}
	}

	drawGameOver(score, highScore, frameCount) {
		const ctx = this.ctx;
		const W = CONFIG.WIDTH;
		const H = CONFIG.HEIGHT;

		ctx.fillStyle = 'rgba(0,0,0,0.65)';
		ctx.fillRect(0, 0, W, H);

		ctx.textAlign = 'center';

		ctx.fillStyle = '#f44336';
		ctx.font = 'bold 40px Arial';
		ctx.fillText('ওয়াকিল ধরা খাইছে! 🩴💥', W / 2, H / 2 - 55);

		ctx.fillStyle = '#ff9800';
		ctx.font = '20px Arial';
		ctx.fillText(GAMEOVER_MESSAGES[Math.floor(score / 100) % GAMEOVER_MESSAGES.length], W / 2, H / 2 - 10);

		ctx.fillStyle = '#fff';
		ctx.font = 'bold 26px Arial';
		ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 35);

		if (score >= highScore && score > 0) {
			ctx.fillStyle = '#ffd54f';
			ctx.font = 'bold 18px Arial';
			ctx.fillText('🏆 NEW HIGH SCORE! 🏆', W / 2, H / 2 + 65);
		}

		ctx.fillStyle = '#4fc3f7';
		ctx.font = 'bold 20px Arial';
		const pulse = Math.sin(frameCount * 0.05) * 0.3 + 0.7;
		ctx.globalAlpha = pulse;
		ctx.fillText('[ SPACE বা Tap করে আবার খেল ]', W / 2, H / 2 + 110);
		ctx.globalAlpha = 1;
	}

	// ----------------------------------------------------------
	//  Polyfill
	// ----------------------------------------------------------

	_polyfillRoundRect() {
		if (!this.ctx.roundRect) {
			CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
				if (typeof r === 'number') r = [r, r, r, r];
				this.moveTo(x + r[0], y);
				this.lineTo(x + w - r[1], y);
				this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
				this.lineTo(x + w, y + h - r[2]);
				this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
				this.lineTo(x + r[3], y + h);
				this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
				this.lineTo(x, y + r[0]);
				this.quadraticCurveTo(x, y, x + r[0], y);
				this.closePath();
			};
		}
	}
}
