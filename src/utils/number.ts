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
 * Parses an array of orders and converts price and size from strings to numbers.
 *
 * @param data - An array of orders, where each order is an array containing a price and a size as strings.
 * @returns An array of orders with prices and sizes converted to numbers.
 */
function parseOrders(data) {
  return data.map(([price, size]) => [
    parseFloat(price.replace(/,/g, '')),
    parseFloat(size.replace(/,/g, ''))
  ]);
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

/**
 * Calculates cumulative bids from an array of bid orders.
 * Each order consists of a price and a size.
 * The function returns an array of cumulative bids with formatted prices and sizes.
 *
 * @param data - An array of bid orders, where each order is an array containing a price and a size.
 * @returns An array of arrays, where each inner array contains the formatted price, size, and cumulative size.
 */
export function calculateCumulativeBids(data) {
  const orders = parseOrders(data);
  const sortedOrders = orders.sort((a, b) => b[0] - a[0]);

  let cumulativeSize = 0;

  return sortedOrders.map(([price, size]) => {
      cumulativeSize += size;
      return [
        formatNumberWithCommas(price),
        formatNumberWithCommas(size),
        formatNumberWithCommas(cumulativeSize)
      ];
  });
}
