"use client";

import {
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

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
// Client / mounted detection
// ──────────────────────────────────────────────

function subscribeClient() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getClientServerSnapshot() {
  return false;
}

// ──────────────────────────────────────────────
// Splash session storage
// ──────────────────────────────────────────────

function subscribeSplashSeen() {
  return () => {};
}

function getSplashSeenSnapshot() {
  if (typeof window === "undefined") return false;

  return sessionStorage.getItem("ERA-splash-seen") !== null;
}

function getSplashSeenServerSnapshot() {
  return false;
}

export function Providers({ children }: { children: ReactNode }) {
  // Hydration-safe mounted/client detection
  const isMounted = useSyncExternalStore(
    subscribeClient,
    getClientSnapshot,
    getClientServerSnapshot,
  );

  const specs = useDeviceCheck();

  const seenAlready = useSyncExternalStore(
    subscribeSplashSeen,
    getSplashSeenSnapshot,
    getSplashSeenServerSnapshot,
  );

  const [dismissed, setDismissed] = useState(false);

  const showSplash = isMounted
    ? !seenAlready && !dismissed
    : true;

  const handleSplashComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ERA-splash-seen", "true");
    }

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

        {isMounted && !specs.isSupported && (
          <UnsupportedDevice specs={specs} />
        )}

        {isMounted && showSplash && specs.isSupported && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </SplashProvider>
    </AnimationProvider>
  );
}