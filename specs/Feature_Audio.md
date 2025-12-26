# Feature Spec — Audio (SFX + Background Music)

## Purpose
Give the app a cohesive “living” feel through subtle sound effects and a continuous background music layer.

## Background Music (BGM)
- BGM starts **during the second splash clip** and then continues looping through the app.
- BGM loops seamlessly (or as close as possible given the source track).
- The player can disable BGM via the **Music** setting.
- BGM **pauses automatically** when the app goes to background (minimized) and **resumes** when the app comes back to foreground (if music is enabled).

## Volume Behavior
- **Dashboard**: normal BGM volume.
- **Other tabs** (Feed, Profile, Arcade, Messages): lower BGM volume.
- **In-game** (e.g., Word Connect): lowest BGM volume.
- Volume changes should **fade smoothly** rather than jump.

## Failure / Fallback
- If BGM playback is blocked or fails, the app should remain usable and attempt to recover on the next user interaction.


