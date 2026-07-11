import { useQuery } from "@tanstack/react-query";
import { fetchCountries } from "@/entities/country/api/country-api";

export const countryKeys = {
  all: ["countries"] as const,
  list: () => [...countryKeys.all, "list"] as const,
};

export function useCountriesQuery() {
  return useQuery({
    queryKey: countryKeys.list(),
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60,
  });
}
