
# Forge UI Library

A high-quality, authentic mobile game UI component library showcasing various themes (Casual, Sci-Fi, Fantasy, etc.) with delightful animations.

## Installation

1. Copy the `forge-ui` folder into your project (e.g., `src/forge-ui`).
2. Ensure you have `tailwindcss` and `lucide-react` installed.
3. Update your `tailwind.config.js` to safeguard the dynamic classes and fonts used by Forge UI.

## Usage

Wrap your application in the `ForgeProvider`:

```tsx
import { ForgeProvider } from './forge-ui';

function App() {
  return (
    <ForgeProvider>
      <YourGame />
    </ForgeProvider>
  );
}
```

Import components:

```tsx
import { GameButton, useForge } from './forge-ui';

const MyComponent = () => {
  const { theme } = useForge();
  return <GameButton variant="primary" label="Play" />;
}
```

## Structure

- **`types.ts`**: All Typescript interfaces.
- **`context.tsx`**: State management for themes.
- **`themes/`**: Theme definitions. Add new themes here and register them in `context.tsx`.
- **`components/`**:
    - `primitives/`: Basic inputs and buttons.
    - `patterns/`: Complex composite components (Cards, Dialogs).
    - `display/`: Visual decorations and gamified elements.
