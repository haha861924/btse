/**
 * @enum {string}
 * @description Represents the types of messages for the order book updates.
 */
export enum MessageType {
  /**
   * @description Snapshot of the orderbook with a maximum of 50 levels
   */
  SNAPSHOT = 'snapshot',
  /**
   * @description Updates of the orderbook
   */
  DELTA = 'delta',
}

/**
 * @interface Quote
 * @description Represents a quote in the order book, including price and size.
 */
export interface Quote {
  /**
   * @type {number}
   * @description The price of the quote.
   */
  price: number;

  /**
   * @type {number}
   * @description The size of the quote.
   */
  size: number;
}

/**
 * @interface OrderbookData
 * @description Represents the complete data structure of the order book, including bids, asks, and metadata.
 */
export interface OrderbookData {
  /**
   * @type {Quote[]}
   * @description An array of buy quotes in the order book.
   */
  bids: Quote[];

  /**
   * @type {Quote[]}
   * @description An array of sell quotes in the order book.
   */
  asks: Quote[];

  /**
   * @type {number}
   * @description The current sequence number of the order book update.
   */
  seqNum: number;

  /**
   * @type {number}
   * @description The previous sequence number for validation of message order.
   */
  prevSeqNum: number;

  /**
   * @type {MessageType}
   * @description The type of message indicating whether it's a snapshot or delta update.
   */
  type: MessageType;

  /**
   * @type {number}
   * @description The timestamp indicating when the order book data was generated.
   */
  timestamp: number;

  /**
   * @type {string}
   * @description The symbol representing the order book (e.g., trading pair).
   */
  symbol: string;
}
