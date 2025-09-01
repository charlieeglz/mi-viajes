import { useQuery } from "@tanstack/react-query";

export function useSearch(filters = {}) {
  // Default vacío para evitar null/destructuring
  const {
    origin = "",
    budget = "",
    daysMin = "",
    daysMax = "",
    selectedMonth = "",
  } = filters;

  return useQuery({
    // Key única por conjunto de filtros
    queryKey: ["search", origin, budget, daysMin, daysMax, selectedMonth],
    // Sólo dispara cuando TODOS los filtros están completos
    enabled: Boolean(
      origin.trim() &&
        budget !== "" &&
        daysMin !== "" &&
        daysMax !== "" &&
        selectedMonth
    ),
    // Construye la URL y apunta al backend
    queryFn: async () => {
      // Si no usas proxy: const baseUrl = 'http://localhost:5002'
      const url = `/api/search?${new URLSearchParams({
        origin,
        budget: String(budget),
        daysMin: String(daysMin),
        daysMax: String(daysMax),
        selectedMonth,
      }).toString()}`;

      const res = await fetch(url, {
        // Esto con proxy irá al backend en 5002
        // Si no usas proxy, usa:
        // fetch(`http://localhost:5002${url}`, { credentials: 'include', ... })
        credentials: "include",
      });

      if (!res.ok) {
        // Leer el body si quieres más detalle:
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
