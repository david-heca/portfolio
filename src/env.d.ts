declare global {
  interface Window {
    /** Suelta los listeners del scrollspy antes de remontarlo (Navbar). */
    __spyCleanup?: () => void;
    /** El listener de `prefers-color-scheme` ya está enlazado (Layout). */
    __themeMediaListener?: boolean;
  }
}

export {};
