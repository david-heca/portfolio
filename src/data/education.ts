/** Los años son estructura: sitúan cada fila en el eje. Escribirlos también en el
 *  copy dejaría que la frase y el tramo pintado dijeran cosas distintas. */
export interface Study {
  key: string;
  from: number;
  /** Ausente: sigue en curso. El tramo llega hasta hoy y se desvanece. */
  to?: number;
}

/** Un certificado es una fecha, no un periodo: en el eje es un punto. */
export interface Certification {
  key: string;
  year: number;
}

/** De lo más reciente a lo más antiguo: así los tramos bajan en escalera. */
export const studies: Study[] = [
  { key: "platzi", from: 2022 },
  { key: "tesco", from: 2019, to: 2024 },
  { key: "cecytem", from: 2015, to: 2018 },
];

export const certifications: Certification[] = [
  { key: "azure", year: 2024 },
  { key: "python", year: 2022 },
];
