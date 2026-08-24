"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimationProvider } from "@/lib/animation-provider";
import { SplashProvider } from "@/lib/splash-context";
import { useDeviceCheck } from "@/lib/use-device-check";

import CustomCursor from "../components/ui/CustomCursor";
import ScrollProgress from "../components/ui/ScrollProgress";
import GrainCanvas from "../components/ui/GrainCanvas";
import GlassNavbar from "../components/sections/GlassNavbar";
import Footer from "../components/sections/Footer";
import UnsupportedDevice from "../components/unsupported-device/unsupported-device";
import SplashScreen from "../components/splash-screen/splash-screen";

// ──────────────────────────────────────────────
// External-system read: sessionStorage "has the splash
// already played this session" flag. No live cross-tab
// updates matter here, so subscribe is a no-op — but
// useSyncExternalStore still gives us the correct SSR/
// hydration handling without an effect.
// ──────────────────────────────────────────────

function subscribeSplashSeen() {
  return () => {};
}
function getSplashSeenSnapshot() {
  return sessionStorage.getItem("ERA-splash-seen") !== null;
}
function getSplashSeenServerSnapshot() {
  return true; 
}

export function Providers({ children }: { children: ReactNode }) {
  const specs = useDeviceCheck();

  const seenAlready = useSyncExternalStore(
    subscribeSplashSeen,
    getSplashSeenSnapshot,
    getSplashSeenServerSnapshot,
  );

  // Local, event-driven override for "user just finished watching it."
  // This setState lives in a click/timeout callback, not an effect
  // body, so it's not subject to the same rule.
  const [dismissed, setDismissed] = useState(false);
  const showSplash = !seenAlready && !dismissed;

  const handleSplashComplete = () => {
    sessionStorage.setItem("ERA-splash-seen", "true");
    setDismissed(true);
  };

  return (
    <AnimationProvider skipSplash={!showSplash}>
      <SplashProvider value={showSplash}>
        <CustomCursor />
        <ScrollProgress />
        <GrainCanvas />
        <GlassNavbar />

        {children}

        <Footer />

        {!specs.isSupported && <UnsupportedDevice specs={specs} />}

        {showSplash && specs.isSupported && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </SplashProvider>
    </AnimationProvider>
  );
}
