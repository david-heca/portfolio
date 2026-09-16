/** Los años van aquí y no en el copy, igual que en `education.ts`: el periodo
 *  se compone en el componente, así ES y EN no pueden decir fechas distintas. */
export interface Role {
  key: string;
  company: "hypertech" | "baacc" | "dec";
  from: number;
  /** Ausente: rol actual. */
  to?: number;
}

/** De lo más reciente a lo más antiguo. */
export const roles: Role[] = [
  { key: "appliedai", company: "hypertech", from: 2026 },
  { key: "architect", company: "baacc", from: 2025, to: 2026 },
  { key: "fullstack", company: "baacc", from: 2024, to: 2025 },
  { key: "junior", company: "baacc", from: 2023, to: 2024 },
  { key: "webdev", company: "dec", from: 2022, to: 2023 },
];
