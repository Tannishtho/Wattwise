/**
 * Generates all unique combinations of size k from an array of elements (nCr)
 */
export function getCombinations<T>(elements: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (elements.length < k) return [];

  const head = elements[0];
  const tail = elements.slice(1);

  // Combinations including the head element
  const withHead = getCombinations(tail, k - 1).map((combo) => [head, ...combo]);
  // Combinations excluding the head element
  const withoutHead = getCombinations(tail, k);

  return [...withHead, ...withoutHead];
}
