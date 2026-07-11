export type Country = {
  name: { common: string; official: string };
  cca2: string;
  flags: { png: string; svg: string; alt?: string };
  region: string;
  population: number;
};
