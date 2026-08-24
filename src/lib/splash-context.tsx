"use client";

import { createContext, useContext } from "react";

const SplashContext = createContext(false);

export const SplashProvider = SplashContext.Provider;

/**
 * Returns `true` while the splash screen is covering the page.
 * Hero gates its entrance animations on this value.
 */
export function useSplashVisible() {
  return useContext(SplashContext);
}
