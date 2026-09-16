declare global {
  interface Window {
    /** El listener de `prefers-color-scheme` ya está enlazado (Layout). */
    __themeMediaListener?: boolean;
  }
}

export {};
