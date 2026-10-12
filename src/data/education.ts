interface Study {
  key: string;
  from: number;
  to?: number;
}

/** De lo más reciente a lo más antiguo. */
export const studies: Study[] = [
  { key: "tesco", from: 2019, to: 2024 },
  { key: "cecytem", from: 2015, to: 2018 },
];
