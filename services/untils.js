//Made from ChatGPT

// Hittar första ID som delar prefix med targetId.
export function findByPrefix(targetId, allIds, prefixLength = 4) {
  // Ta de första prefixLength tecknen från det inskickade ID:t
  const prefix = targetId.slice(0, prefixLength);

  // Leta bland alla giltiga ID:n efter en som börjar med samma prefix
  return allIds.find((id) => id.startsWith(prefix)) || null;
}

// Paginerar en array genom att returnera både metadata och de paginerade resultaten.
export function paginate(items, page = 1, perPage = 10) {
  // Räkna totalt antal items
  const total = items.length;
  // Beräkna hur många sidor det blir totalt
  const totalPages = Math.ceil(total / perPage);
  // Säkerställ att sidan är mellan 1 och totalPages
  const safePage = Math.min(Math.max(1, page), totalPages);
  // Beräkna startindex för slice
  const start = (safePage - 1) * perPage;
  // Skapa den delmängd av items som tillhör den här sidan
  const results = items.slice(start, start + perPage);

  // Returnera objekt med både sidmetadata och resultaten
  return {
    page: safePage,
    perPage,
    total,
    totalPages,
    results,
  };
}
