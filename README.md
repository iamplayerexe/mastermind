<div align="center">

# Mastermind Dashboard 🧠

</div>

<p align="center">
  <!-- Tech Stack Badges -->
  <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5"><img src="https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="https://www.python.org"><img src="https://img.shields.io/badge/Python-3.x-%233776AB.svg?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>
  <a href="https://github.com/kitao/pyxel"><img src="https://img.shields.io/badge/Pyxel-Engine-%23FF6699.svg?style=for-the-badge" alt="Pyxel"></a>
  <!-- Deployment Badges -->
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-Build_Tool-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS"></a>
  
  <!-- This is the official badge link. It will work once the workflow runs. -->
  <a href="https://github.com/iamplayerexe/mastermind/actions/workflows/deploy.yml">
    <img src="https://github.com/iamplayerexe/mastermind/actions/workflows/deploy.yml/badge.svg?branch=main" alt="GitHub Actions Status" style="height: 28px;">
  </a>

  <!-- License Badge -->
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"></a>
</p>

> A fully responsive web dashboard showcasing a classic Mastermind game. The game, originally built in Python with the Pyxel retro engine, is deployed to the web via WebAssembly and is playable on both desktop and mobile devices.

---

## 🚀 Live Demo

**[Click here to play and explore the dashboard!](https://iamplayerexe.github.io/mastermind/)**

---

## 🖼️ Preview

**(👇 Click to expand!)**

<details>
  <summary><strong>✨ Main Views & Functionality</strong></summary>
  <br/>
  <p align="center">
    <em>The Mastermind game, embedded and fully playable on desktop and mobile.</em>
    <br/>
    <img src="https://raw.githubusercontent.com/iamplayerexe/mastermind/main/mockup-game.jpeg" alt="Mastermind Game View" width="600"/>
    <br/><br/>
    <em>The Product Vision Board, displayed as responsive cards.</em>
    <br/><br/>
    <em>The Mockups section, with a fancy horizontal scroll on desktop and vertical stack on mobile.</em>
  </p>
</details>

---

## ✨ Features Checklist

-   [x] 🐍 **Python to Web:** A complete Python/Pyxel game made playable in any modern web browser using WebAssembly.
-   [x] 📱 **Fully Responsive Design:** A fluid layout that adapts seamlessly from large desktop monitors to mobile phones.
-   [x] 👆 **Full Touch Support:** The embedded game is fully controllable on touch devices, with mouse events being simulated from touch input.
-   [x] 💅 **Themed UI:** A custom "cyberpunk" theme with animated gradient text, glowing elements, and custom scrollbars.
-   [x] 🧩 **Component-Based Views:** A tabbed dashboard interface to showcase different aspects of the project (Game, PVB, Mockups).
-   [x] 🚀 **Automated CI/CD:** A GitHub Actions workflow automatically builds and deploys any changes pushed to the `main` branch to GitHub Pages.

---

## 🎯 Project Goals

> Demonstrating a full-stack development and deployment workflow.

*   ✅ **Python to Web:** Showcase the ability to take a non-web language like Python and deploy it as an interactive web application.
*   ⚡ **Modern Frontend:** Build a clean, responsive, and visually appealing user interface using modern HTML and CSS practices (Flexbox, custom properties, animations).
*   🤖 **CI/CD Automation:** Implement a professional CI/CD pipeline that automates the testing, building, and deployment process, ensuring rapid and reliable updates.

---

## 🛠️ Built With

*   🎨 **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   🎮 **Game Engine:** [Python](https://www.python.org/) with the [Pyxel](https://github.com/kitao/pyxel) library
*   ⚙️ **Build Tools:** [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/) for running cross-platform build scripts.
*   🚀 **Deployment:** [GitHub Actions](https://github.com/features/actions) for CI/CD and [GitHub Pages](https://pages.github.com/) for hosting.

---

## 📦 Key Dependencies

*   **`rimraf`**: (Dev) A cross-platform tool for deleting files and folders (used in the build script).
*   **`cpx`**: (Dev) A cross-platform tool for copying files and folders (used in the build script).

---

## 🚀 Getting Started (Development)

Want to run the project locally? You'll need [Node.js](https://nodejs.org/) and `npm` installed.

1.  **Clone** the repository:
    ```bash
    git clone https://github.com/iamplayerexe/mastermind.git
    ```
2.  **Navigate** to the project directory:
    ```bash
    cd mastermind
    ```
3.  **Install** the build dependencies:
    ```bash
    npm install
    ```
4.  **Run** the project with a live server extension.
    *   The recommended way is using the **"Live Server"** extension for VS Code. Right-click `index.html` and select "Open with Live Server".

---

## 📖 How to Use the Dashboard

1.  🖱️ **Visit the Site:** Open the [live demo link](https://iamplayerexe.github.io/mastermind/).
2.  🎮 **Play the Game:** The Mastermind game loads by default. You can play it with a mouse or by tapping on a touch device. Use the fullscreen button for an immersive experience.
3.  🧭 **Switch Views:** Use the top navigation links ("Product Vision Board", "Conception Interfaces") to switch between the different project showcases.
4.  🖼️ **View Mockups:** In the "Conception Interfaces" view, click on any mockup image to see a larger version in a modal window.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
➡️ Please check the [**Issues Page**](https://github.com/iamplayerexe/mastermind/issues).

---

## 📜 License

This project is distributed under the **MIT License**.