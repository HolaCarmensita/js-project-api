//Made from ChatGPT

// Hittar suggested id att använda vid felaktigt id
export function findByPrefix(targetId, allIds, prefixLength = 4) {
  // Ta de första prefixLength tecknen från det inskickade ID:t
  const prefix = targetId.slice(0, prefixLength);

  // Leta bland alla giltiga ID:n efter en som börjar med samma prefix
  return allIds.find((id) => id.startsWith(prefix)) || null;
}

// Paginerar en array genom att returnera både metadata och de paginerade resultaten.
export function paginate(items, pageParam = 1, perPageParam = 10) {
  // 1) Tolka parametrarna till tal (default 1 och 10)
  const requestedPage = Number(pageParam) || 1;
  const perPage = Number(perPageParam) || 10;

  // 2) Totalt antal items
  const total = items.length;
  // 3) Totalt antal sidor (rundar alltid upp)
  const totalPages = Math.ceil(total / perPage);
  // 4) Säker sida inom spannet [1, totalPages]
  const safePage = Math.min(Math.max(1, pageParam), totalPages);
  // 5) Beräkna startindex och skär ut resultat
  const start = (safePage - 1) * perPage;
  const results = items.slice(start, start + perPage);

  // 6) Returnera metadata + resultat
  return { pageParam, perPage, total, totalPages, results };
}

export function sortItems(items, key, directionParam) {
  // Bestäm riktning: om directionParam === 'ascending' → 'ascending', annars 'descending'
  const direction = directionParam === 'ascending' ? 'ascending' : 'descending';
  const dir = direction === 'ascending' ? 1 : -1;

  // Gör en kopia så vi inte muterar originalet
  const arr = [...items];

  arr.sort((a, b) => {
    if (a[key] < b[key]) return -1 * dir;
    if (a[key] > b[key]) return 1 * dir;
    return 0;
  });

  return arr;
}
