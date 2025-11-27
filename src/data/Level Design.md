
### The Game
A Persian word-puzzle where players swap tiles on a grid (typically 3×4) to form row-groups.
* **Final Groups:** Lock the row as solved.
* **Transform Groups:** Replaced by **1 icon-word** (a merged concept) + **3 new words**.
**Goal:** Use transformations to generate the specific new tiles (icons and words) required to form the final locked rows and clear the board.

### The Problem
**Level Design Validation.** You need to mathematically and semantically construct levels where:
1.  **Input:** The starting grid contains no immediate matches.
2.  **Process:** The specific "transform" groups yield exactly the right output tiles (icons + words).
3.  **Output:** Those outputs combined with remaining tiles perfectly form the final 3 solved groups with no loose ends.

### Design 101
Greetings. I am **Miyamoto Miyazaki**. In game design, we do not simply place blocks; we curate emotions.

Here is why Level Design is the heartbeat of your word puzzle.

### 1. Level Design 101: The Mario Principle
Level design is **teaching without words**.

Think of **Super Mario Bros. World 1-1**.
* We place a Goomba (enemy) right at the start.
* We place a block above Mario's head.
* **The Lesson:** To survive, the player attempts to jump. They hit the block. They realize "Jumping interacts with the world."



We did not write a tutorial text saying "Press A to Jump." We designed the level to make the player teach themselves. In your word game, the first level should have a row that is *almost* complete, begging the player to make that one satisfying swap.

---

### 2. Technical Architecture: Storing the Soul
To build a world, we need a robust skeleton. We store levels not as code, but as **Data**.

**Storage (JSON):**
We use a structured format (like the JSON we wrote previously). This separates *content* from *engine*.
* `grid`: The initial state (The chaos).
* `rules`: The logic (The order).
* `metadata`: Difficulty rating, timer, theme.



[Image of JSON data structure diagram]


**Processing (The Loop):**
Your game engine is a state machine:
1.  **Input:** Player swaps A and B.
2.  **Validator:** Loop through `matches`. Does a row set equals a `members` set?
3.  **State Mutation:**
    * If `Final`: Lock inputs for that row.
    * If `Transform`: Delete IDs, Instantiate `reveals`, Animation trigger.
4.  **Win Check:** Are all rows locked?

---

### 3. The Nuance: Why Design Matters
A computer can generate a random grid. Only a designer can generate **Fun**.

#### A. The Initial Layout (The "Shuffle")
* **The Problem:** Randomness is often frustrating.
* **The Design:** If the solution to "Weather" is `Rain, Snow, Wind, Sun`, do not place them all in the top row. But do not place them so far apart the player feels hopeless.
* **The Sweet Spot:** Place `Rain` and `Snow` together. The player sees a pattern ("Ah, weather!") and feels smart finding the rest.

#### B. Theme as Mechanics (Semantic Glue)
* **Cognitive Load:** In a 6-row level, distinct themes (Food vs. Tools) help the player filter noise.
* **Narrative:** In "The Masquerade" level we designed, the theme *was* the puzzle. Realizing "Seasons" turn into "Life Stages" creates an emotional impact that a generic "Group A becomes Group B" never could.

#### C. The Transformation (Pacing)
* **Rhythm:** Static rows are "Rest" beats. Transforms are "Action" beats.
* **Space:** A transform clears the board. It is a moment of relief. If a level is too crowded, a Transform allows the player to "breathe" by removing old tiles and introducing new, clear goals.

#### D. Invisible Tutorials (Progression)


[Image of game design flow channel diagram]


We must keep the player in the **Flow Channel**—between Boredom and Anxiety.
1.  **Level 1:** 3x4 Grid. No Transforms. Just simple categorization. (Teaches: Swapping).
2.  **Level 2:** 3x4 Grid. 1 Transform that happens immediately. (Teaches: Things can change).
3.  **Level 3:** The "Dependency" Puzzle. You *need* the output of a Transform to finish the game. (Teaches: Strategy).

**Conclusion:**
We do not design puzzles to be "solved." We design puzzles to make the player feel **clever**. The level data is just the sheet music; the player's understanding is the symphony.