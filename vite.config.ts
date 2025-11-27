
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp1.4.2': 'input-otp',
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
      },
    },
    server: {
      host: true,
      port: 3009,
      open: true,
    },
  });