# পালা ওয়াকিল পালা! (Run Wakil Run!)

A fun endless runner game where Wakil runs from his angry wife Salma!

🎮 **[Play Now - pala-wakil-pala.mhrrony.com](https://pala-wakil-pala.mhrrony.com)**

## 🎮 Game Features

- **Endless Runner Gameplay** - Jump and duck to avoid obstacles
- **Bengali Humor** - Funny Bengali text messages throughout the game
- **Progressive Difficulty** - Game speed increases as your score increases
- **Mobile & Desktop Support** - Play on any device with responsive design
- **Touch Controls** - Mobile-friendly jump and duck buttons
- **High Score System** - Compete with yourself, score saved locally

## 🔗 Links

- **🎯 Live Game**: [pala-wakil-pala.mhrrony.com](https://pala-wakil-pala.mhrrony.com)
- **📦 GitHub Repo**: [MHR-RONY/Run-wakil-Run-](https://github.com/MHR-RONY/Run-wakil-Run-)
- **👨‍💻 Developer**: [MHR-RONY](https://github.com/MHR-RONY)

## 🚀 Deployment

This game is deployed on Vercel and accessible at [pala-wakil-pala.mhrrony.com](https://pala-wakil-pala.mhrrony.com)

### Deploy Your Own Copy:

1. **Fork this repository**
2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com/)
   - Click "New Project"
   - Import your forked repository
   - Click "Deploy"

3. **Or use Vercel CLI**:
   ```bash
   npm i -g vercel
   git clone https://github.com/MHR-RONY/Run-wakil-Run-.git
   cd Run-wakil-Run-
   vercel
   ```

## 🎯 How to Play

### Desktop Controls:
- Press **Space** or **↑ Arrow** to **Jump** over obstacles
- Press **↓ Arrow** to **Duck** under flying objects

### Mobile Controls:
- Tap **🏃 JUMP** button to jump over obstacles
- Tap **⬇️ DUCK** button to duck under flying objects

### Game Rules:
- Avoid all obstacles (rocks, barrels, carts, signs, ducks, branches)
- Your score increases continuously
- Game speed gradually increases as you progress
- Salma (the wife) gets angrier as you survive longer
- Hit an obstacle = Game Over

## 🎨 Game Characters

- **Wakil** - The running husband in light blue kurta, desperately running away
- **Salma** - The chasing wife in white saree with her rolling pin (belan), getting angrier!

## 🏆 Scoring System

- Score increases automatically over time
- Speed increases based on your score
- High score saved in browser's local storage
- Each session starts with your previous high score displayed

## 📁 Project Structure

```
Run-wakil-Run-/
├── index.html           # Main HTML entry point
├── vercel.json          # Vercel deployment configuration
├── .gitignore           # Git ignore rules
├── README.md            # This file
│
├── css/
│   └── style.css        # All styling & responsive design
│
├── js/
│   ├── constants.js     # Game configuration & Bengali texts
│   ├── player.js        # Player (Wakil) character class
│   ├── wife.js          # Wife (Salma) chase behavior
│   ├── obstacles.js     # Obstacle spawning & collision detection
│   ├── particles.js     # Particle effects (dust, collision)
│   ├── background.js    # Parallax scrolling backgrounds
│   ├── renderer.js      # Canvas drawing & rendering
│   ├── game.js          # Main game loop & logic
│   ├── input.js         # Keyboard & touch input handling
│   └── main.js          # Game initialization & bootstrap
│
└── public/
    └── wakil.png        # Wakil's character head sprite
```

## 🛠️ Technologies Used

- **HTML5 Canvas** - Hardware-accelerated game rendering
- **Pure Vanilla JavaScript (ES6+)** - No frameworks, no dependencies
- **CSS3** - Responsive design with media queries & flexbox
- **Local Storage API** - Persistent high score storage
- **Canvas API** - 2D graphics rendering
- **ES6 Modules** - Organized class-based architecture

## ✨ Technical Highlights

- **Object-Oriented Design** - Clean class-based architecture
- **Modular Code** - Separated concerns across multiple files
- **Responsive Canvas** - Scales properly on all screen sizes
- **Touch Events** - Full mobile touch support
- **Game Loop** - RequestAnimationFrame for smooth 60 FPS gameplay
- **Collision Detection** - Precise hitbox system
- **Parallax Scrolling** - Multi-layer background effect
- **Particle System** - Dynamic visual effects

## 📱 Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari  | ✅ | ✅ |
| Edge    | ✅ | ✅ |
| Opera   | ✅ | ✅ |

**Recommended:** Chrome/Edge for best performance

## 🎭 Bengali Texts Features

The game includes:
- **18 funny Bengali hit messages** when Wakil hits obstacles
- **16 angry chase messages** from Salma during gameplay
- **8 game over messages** in Bengali
- Full Bengali UI and instructions

## 💻 Local Development

Want to run or modify the game locally?

### Prerequisites
- Any modern web browser
- A local web server (optional but recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MHR-RONY/Run-wakil-Run-.git
   cd Run-wakil-Run-
   ```

2. **Run locally**:

   **Option A: Simple HTTP Server (Python)**
   ```bash
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000`

   **Option B: Live Server (VS Code Extension)**
   - Install "Live Server" extension in VS Code
   - Right-click `index.html` → "Open with Live Server"

   **Option C: Simple Open**
   - Just double-click `index.html` (may have image loading issues)

3. **Start playing!** 🎮

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions:
- Add more obstacle types
- Create different difficulty levels
- Add sound effects and music
- Implement power-ups
- Add more Bengali jokes and texts
- Create multiple character skins
- Add leaderboard with backend

## 📜 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

- Inspired by classic endless runner games
- Bengali culture and humor
- All the husbands who've been chased 😄

## 📞 Contact

**Developer**: MHR-RONY
- GitHub: [@MHR-RONY](https://github.com/MHR-RONY)
- Live Demo: [pala-wakil-pala.mhrrony.com](https://pala-wakil-pala.mhrrony.com)

## 🐛 Known Issues

None currently! Report issues on the [GitHub Issues page](https://github.com/MHR-RONY/Run-wakil-Run-/issues)

## 🔄 Version History

- **v1.0** - Initial release with full gameplay
  - Mobile responsive design
  - Bengali localization
  - 6 obstacle types
  - High score system

---

**Made for fun!**

*পালা ওয়াকিল পালা! শুধু দৌড়াও বাঁচো!* 🏃💨


