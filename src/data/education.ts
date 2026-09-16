/** Años aquí y no en el copy: así ES y EN no pueden decir fechas distintas. */
interface Study {
  key: string;
  from: number;
  /** Ausente: sigue en curso. */
  to?: number;
}

/** De lo más reciente a lo más antiguo. */
export const studies: Study[] = [
  { key: "platzi", from: 2022 },
  { key: "tesco", from: 2019, to: 2024 },
  { key: "cecytem", from: 2015, to: 2018 },
];
