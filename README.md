# Word Abstraction Game

A multilingual puzzle game where you find connections between words. Group 16 words into 4 categories to clear the board!

## 🎮 Introduction & Gameplay

**The Goal:** Organize a grid of 16 words into 4 meaningful groups of 4 words each.

**How to Play:**
1.  **Read**: Look at the 16 words on the board.
2.  **Connect**: Find 4 words that belong together (e.g., they are all "Dairy Products").
3.  **Drag & Drop**: Move the words into a single row to group them.
4.  **Solve**: If correct, the words merge into a category tile (or an icon!).

**Example:**
*   **Words**: Cheese, Butter, Milk, Cream
*   **Category**: 🥛 Dairy
*   **Result**: The row locks and transforms into a single "Dairy" block.

## 🛠️ Setup & Development

### Prerequisites
*   Node.js (v18+)
*   Android Studio (for mobile build)

### Quick Start
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The game will open at `http://localhost:5173`.

## 🧩 Levels & Design

Levels are stored as JSON files in `src/data/levels/`.

### File Structure
Each level file (e.g., `chapter1/level1.json`) contains:
*   **Meta**: Title, description, difficulty.
*   **Dictionary**: The 16 word tiles with translations and colors.
*   **Mechanics**: The 4 valid groups (rules) and their outcomes (e.g., transform to icon).
*   **Layout**: The initial grid arrangement.

### Design Principles
1.  **Economy**: Exactly 16 tiles must be used. No leftovers, no missing pieces.
2.  **Solvability**: The level must be solvable without guessing.
3.  **Groups**: Must have exactly 4 groups of 4 words.

### How to Add a Level
1.  Create a new JSON file in a chapter folder (e.g., `src/data/levels/chapter1/level2.json`).
2.  Define your words and groups following the format of existing levels.
3.  Update the `meta.json` in that chapter to include your new level filename.
4.  Run the validator to check your work.

## ✅ Level Validator

We have a built-in tool to ensure levels are broken-free and solvable.

**Run Validator:**
```bash
npm run validate-levels
```

**What it Checks:**
*   **Schema**: Is the JSON valid?
*   **Economy**: Do inputs equal outputs? (Are all 16 tiles used?)
*   **Simulation**: Can the AI solve it? (Detects deadlocks).

## 📱 Capacitor & Mobile Build

This project uses [Capacitor](https://capacitorjs.com/) to run on Android.

### Basic Commands
*   **Sync Changes**: Copies your web build to the Android project.
    ```bash
    npm run cap:sync
    ```
*   **Open Android Studio**: Opens the native project for building/running on device.
    ```bash
    npm run cap:open:android
    ```

### Building the APK
1.  Build the web app: `npm run build`
2.  Sync with Capacitor: `npm run cap:sync`
3.  Open Android Studio: `npm run cap:open:android`
4.  In Android Studio: `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.

### Live Updates
We use **Capacitor Updater** to push updates without re-downloading the app store version.
*   Configured in `capacitor.config.json`.
*   Updates are downloaded from the URL specified in `VITE_UPDATE_URL`.
