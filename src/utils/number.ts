/**
 * Converts an array of quotes into an object format, using price as the key and quantity as the value.
 * @param quotes - A two-dimensional array of strings containing prices and quantities.
 * @returns An object with prices as keys and quantities as values.
 */
export function convertNumber(quotes: string[][]): Record<string, string> {
  const result: Record<string, string> = {};

  quotes.forEach((q: string[]) => {
    const price = formatNumberWithCommas(q[0]);
    const size = formatNumberWithCommas(q[1]);
    result[price] = size;
  });

  return result;
}

/**
 * Formats a string or a number into a string with thousand separators.
 * @param price - The price to be formatted.
 * @returns A formatted price string.
 */
export function formatNumberWithCommas(price: string | number): string {
  return String(price)
    .split('')
    .reverse()
    .reduce((prev: string, next: string, index: number) => {
      return (index % 3 === 0 && index !== 0 ? next + ',' : next) + prev;
    }, '');
}

