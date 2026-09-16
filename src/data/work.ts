/** Años aquí y no en el copy, como en `education.ts`: así ES y EN no pueden
 *  decir fechas distintas. */
interface Role {
  key: string;
  from: number;
  /** Ausente: rol actual. */
  to?: number;
}

/** La unidad es la empresa: sus etapas van dentro y el raíl mide el total. */
interface Company {
  key: "hypertech" | "baacc" | "dec";
  /** De la más reciente a la más antigua. */
  roles: Role[];
}

/** De la más reciente a la más antigua. */
export const companies: Company[] = [
  { key: "hypertech", roles: [{ key: "appliedai", from: 2026 }] },
  {
    key: "baacc",
    roles: [
      { key: "architect", from: 2025, to: 2026 },
      { key: "fullstack", from: 2024, to: 2025 },
      { key: "junior", from: 2023, to: 2024 },
    ],
  },
  { key: "dec", roles: [{ key: "webdev", from: 2022, to: 2023 }] },
];
