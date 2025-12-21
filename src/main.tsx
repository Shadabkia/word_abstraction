import { createRoot } from "react-dom/client";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { Capacitor } from "@capacitor/core";
import App from "./App.tsx";
import "./index.css";
import "./styles/globals.css";
import { ForgeSettingsProvider } from "@/shared/theme/ForgeSettingsProvider";

// Initialize live updates on app start
if (Capacitor.isNativePlatform()) {
  // Notify that the app is ready (required for live updates)
  CapacitorUpdater.notifyAppReady();
  
  // Optional: Check for updates manually
  // You can also configure auto-update in capacitor.config.json
  const updateUrl = import.meta.env.VITE_UPDATE_URL;
  if (updateUrl) {
    CapacitorUpdater.download({
      url: updateUrl,
      version: "latest"
    }).catch((error) => {
      console.error("Failed to download update:", error);
    });
  }
}

createRoot(document.getElementById("root")!).render(
  <ForgeSettingsProvider>
    <div className="app-viewport">
      <div className="app-frame">
        <App />
      </div>
    </div>
  </ForgeSettingsProvider>
);

