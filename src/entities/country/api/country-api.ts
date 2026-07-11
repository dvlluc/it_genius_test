import { countriesClient } from "@/shared/api/client";
import type { Country } from "@/entities/country/model/types";

export async function fetchCountries(): Promise<Country[]> {
  const { data } = await countriesClient.get<Country[]>("/all", {
    params: {
      fields: "name,cca2,flags,region,population",
    },
  });
  return data;
}
