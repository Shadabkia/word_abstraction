# Capacitor Setup & APK Build Guide

This guide explains how to build an APK for WordAbstraction using Capacitor and set up live updates.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Android Studio** with Android SDK installed
3. **Java Development Kit (JDK)** 11 or higher
4. **Android SDK** (API level 33 or higher)

## Configuration

The app is configured with:
- **App ID**: `com.word.abstraction`
- **App Name**: `WordAbstraction`
- **Build Directory**: `build` (Vite output)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the React App

```bash
npm run build
```

This creates the production build in the `build/` directory.

### 3. Sync with Capacitor

```bash
npm run cap:sync
```

This command:
- Copies web assets to native projects
- Updates native dependencies
- Syncs plugin configurations

## Building APK

### Option 1: Using Android Studio (Recommended)

1. **Open Android Studio**:
   ```bash
   npm run cap:open:android
   ```

2. **Wait for Gradle Sync** to complete

3. **Build APK**:
   - Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for the build to complete
   - Click **locate** in the notification to find your APK
   - APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option 2: Using Command Line

```bash
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Building Release APK (for Production)

1. **Generate a signing key** (first time only):
   ```bash
   keytool -genkey -v -keystore word-abstraction-release.keystore -alias word-abstraction -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Create `android/keystore.properties`**:
   ```properties
   storePassword=your-store-password
   keyPassword=your-key-password
   keyAlias=word-abstraction
   storeFile=../word-abstraction-release.keystore
   ```

3. **Update `android/app/build.gradle`** to use the keystore (see Android Studio documentation)

4. **Build release APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Live Updates Setup

The app uses **@capgo/capacitor-updater** for over-the-air (OTA) updates.

### How It Works

1. Deploy your React build to a CDN/server (e.g., AWS S3, Cloudflare, Vercel)
2. The app checks for updates on startup
3. If a new version exists, it downloads and replaces web assets
4. The app loads updated code on next launch

### Configuration

1. **Set Environment Variables** (create `.env` file):
   ```env
   VITE_UPDATE_URL=https://your-cdn-url.com/updates
   VITE_STATS_URL=https://your-api-url.com/stats
   ```

2. **Update Server Setup**:
   - Host your `build/` folder contents on a CDN
   - Create an update manifest endpoint that returns version info
   - The plugin will download and apply updates automatically

### Manual Update Check

You can also trigger updates manually in your app:

```typescript
import { CapacitorUpdater } from "@capgo/capacitor-updater";

// Check for updates
const update = await CapacitorUpdater.download({
  url: "https://your-cdn-url.com/updates",
  version: "1.0.1"
});

// Apply update
await CapacitorUpdater.set(update);
```

## Development Workflow

1. **Make changes** to your React app
2. **Build**: `npm run build`
3. **Sync**: `npm run cap:sync` or `npm run cap:build` (builds and syncs)
4. **Test**: Open in Android Studio and run on device/emulator

## Troubleshooting

### Build Errors

- **Gradle sync fails**: Make sure Android SDK is properly installed
- **Missing dependencies**: Run `npm install` and `npm run cap:sync`
- **Build directory not found**: Run `npm run build` first

### Live Updates Not Working

- Check that `VITE_UPDATE_URL` is set correctly
- Verify your CDN is accessible
- Check app logs for update errors
- Ensure the update manifest format is correct

### APK Installation Issues

- Enable "Install from Unknown Sources" on Android device
- For release builds, ensure proper signing configuration

## Useful Commands

```bash
# Build and sync in one command
npm run cap:build

# Copy web assets only
npm run cap:copy

# Open Android Studio
npm run cap:open:android

# Sync Capacitor (after npm install)
npm run cap:sync
```

## Next Steps

1. Set up your CDN for live updates
2. Configure update manifest endpoint
3. Test live updates on a device
4. Build and sign release APK for distribution

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Updater Documentation](https://capgo.app/docs/plugins/capacitor-updater)
- [Android Studio Guide](https://developer.android.com/studio)




