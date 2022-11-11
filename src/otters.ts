export interface Otter {
  title: string;
  link: string;
  img: string;
  pubDate: string;
}

import _otters from "./otters.json";

export const otters = _otters.filter(otter => otter.img) as Otter[];
