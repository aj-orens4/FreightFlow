/*
  Purpose: Manages theme (light/dark/system), accent color, font size, sidebar style.
           Persists preferences and applies them as data-attributes on <html>/.app-shell.
  Author: FreightFlow Engineering
  Version: 0.1.0
  Last Updated: 2026-07-04
*/

const FreightFlowTheme = (() => {
  const STORAGE_KEY = "ff_preferences";

  const defaults = {
    theme: "system",   // "light" | "dark" | "system"
    accent: "blue",    // "blue" | "green" | "purple" | "orange"
    fontSize: "medium",// "small" | "medium" | "large"
    sidebar: "expanded" // "expanded" | "compact" | "collapsed"
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
    } catch (e) {
      return { ...defaults };
    }
  }

  function save(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      /* storage unavailable (private mode, etc.) — fail silently, keep in-memory only */
    }
  }

  let prefs = load();

  function resolvedTheme() {
    if (prefs.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return prefs.theme;
  }

  function apply() {
    document.documentElement.setAttribute("data-theme", resolvedTheme());
    document.documentElement.setAttribute("data-accent", prefs.accent);
    document.documentElement.setAttribute("data-font-size", prefs.fontSize);

    const shell = document.querySelector(".app-shell");
    if (shell) shell.setAttribute("data-sidebar", prefs.sidebar === "collapsed" ? "compact" : prefs.sidebar);
  }

  function set(partial) {
    prefs = { ...prefs, ...partial };
    save(prefs);
    apply();
  }

  function get() {
    return { ...prefs };
  }

  // React to OS theme changes when in "system" mode
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (prefs.theme === "system") apply();
  });

  document.addEventListener("DOMContentLoaded", apply);

  return { set, get, apply };
})();
