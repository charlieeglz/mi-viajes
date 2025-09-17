import { useQuery } from "@tanstack/react-query";

export function useSearch(filters = {}) {
  const {
    origin = "",
    budget = "",
    daysMin = "",
    daysMax = "",
    selectedMonth = "",
  } = filters;

  return useQuery({
    queryKey: ["search", origin, budget, daysMin, daysMax, selectedMonth],
    enabled: Boolean(
      origin.trim() &&
        budget !== "" &&
        daysMin !== "" &&
        daysMax !== "" &&
        selectedMonth !== ""
    ),
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      const queryString = new URLSearchParams({
        origin,
        budget: String(budget),
        daysMin: String(daysMin),
        daysMax: String(daysMax),
        selectedMonth: String(selectedMonth),
      }).toString();

      const res = await fetch(`${baseUrl}/api/search?${queryString}`, {
        credentials: "include",
      });

      if (!res.ok) {
        let text = "";
        try {
          text = await res.text();
        } catch {}
        throw new Error(`Error ${res.status}${text ? ": " + text : ""}`);
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
