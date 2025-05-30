// Hittar första ID som delar prefix med targetId.
export function findByPrefix(targetId, allIds, prefixLength = 4) {
  // Ta de första prefixLength tecknen från det inskickade ID:t
  const prefix = targetId.slice(0, prefixLength);

  // Leta bland alla giltiga ID:n efter en som börjar med samma prefix
  return allIds.find((id) => id.startsWith(prefix)) || null;
}
