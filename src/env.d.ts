declare global {
  interface Window {
    /** Lo define el script inline de `Layout`, que es quien pinta el tema. */
    __theme?: {
      key: string;
      pref: () => "light" | "dark" | "system";
      paint: (pref: "light" | "dark" | "system") => void;
    };
  }
}

export {};
