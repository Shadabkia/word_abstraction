# Feature Spec — Splash (Startup Sequence)

## Purpose
Provide a short, brand-forward startup moment that sets tone before the app becomes interactive.

## Behavior
- On app launch, a splash sequence plays **two motion clips in order**:
  - A logo reveal clip
  - A “living picture” scene clip
- Background music begins **at the start of the second clip**.
- The sequence is shown **once per app start** (per page load / launch session).
- The user can **skip** at any time.

## Experience Requirements
- Splash is **full-screen** and blocks interaction with the underlying UI until it completes or is skipped.
- Splash should be **fast and lightweight** (optimized assets; no heavy computation).
- Motion should be **smooth** and not stutter on mid-range mobile devices.

## Failure / Fallback
- If motion playback fails, the app should **continue to the main UI** rather than getting stuck on splash.


