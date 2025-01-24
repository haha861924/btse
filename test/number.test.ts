import { convertNumber, formatNumberWithCommas } from '@/utils/number';

describe('formatNumberWithCommas', () => {
  it('should format numbers correctly with commas', () => {
    expect(formatNumberWithCommas(1000)).toBe('1,000');
    expect(formatNumberWithCommas(1234567)).toBe('1,234,567');
    expect(formatNumberWithCommas('9876543210')).toBe('9,876,543,210');
    expect(formatNumberWithCommas(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumberWithCommas(-1000)).toBe('-1,000');
  });
});

describe('convertNumber', () => {
  it('should convert an array of quotes into an object format', () => {
    const quotes = [['1000', '10'], ['2000', '20'], ['3000', '30']];
    const expected = {
      '1,000': '10',
      '2,000': '20',
      '3,000': '30',
    };
    expect(convertNumber(quotes)).toEqual(expected);
  });

  it('should handle empty input', () => {
    const quotes: string[][] = [];
    const expected: Record<string, string> = {};
    expect(convertNumber(quotes)).toEqual(expected);
  });
});
