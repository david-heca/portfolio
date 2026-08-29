export const email = "hello@davidherrera.dev";

export interface Channel {
  key: "github" | "linkedin" | "x";
  href: string;
  icon: string;
}

/** El nombre visible sale de `common.channels.<key>`; aquí solo la URL y el icono.
 *  El `sameAs` del JSON-LD lee de aquí: una URL que diverja miente a los buscadores. */
export const channels: Channel[] = [
  { key: "github", href: "https://github.com/david-heca", icon: "ph:github-logo" },
  { key: "linkedin", href: "https://www.linkedin.com/in/david-heca/", icon: "ph:linkedin-logo" },
  { key: "x", href: "https://x.com/david_heca_", icon: "ph:x-logo" },
];
