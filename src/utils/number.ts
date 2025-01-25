/**
 * Converts an array of quotes into an object format, using price as the key and quantity as the value.
 * @param quotes - A two-dimensional array of strings containing prices and quantities.
 * @returns An object with prices as keys and quantities as values.
 */
export function convertNumber(quotes: string[][]): Record<string, string> {
  const result: Record<string, string> = {};

  quotes.forEach((q: string[]) => {
    const price = formatNumberWithCommas(q[0]).toString();
    const size = formatNumberWithCommas(q[1]).toString();
    result[price] = size;
  });

  return result;
}

/**
 * Formats a string or a number into a number with thousand separators.
 * @param price - The price to be formatted.
 * @returns A formatted price number.
 */
export function formatNumberWithCommas(price: string | number): string {
  const numberValue = Number(price);

  return numberValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20
  });
}

/**
 * Sorts an array of entries in descending order based on their size.
 *
 * @param entries - An array of entries, where each entry is a tuple consisting of a string (key) and a string (size).
 * @returns An array of the top eight entries sorted by size in descending order.
 */
export function sortEntriesDescendingBySize(entries: [string, string][]): [string, string][] {

  return entries
    .sort(([, sizeA], [, sizeB]) => {
      return Number(sizeB.replace(/,/g, '')) - Number(sizeA.replace(/,/g, ''));
    })
    .slice(0, 8);
}

