import { defineStore } from 'pinia';
import { OrderbookData } from '@/enum/orderBook'

export const useQuotesStore = defineStore('counter', {
  state: () => ({
    quotes: [],
    orderBook : {
      asks: {},
      bids: {},
      lastPrice: 0,
      seqNum: 0
    }
  }),
  actions: {
    /**
     * Set the order book data.
     * @param data - The order book data.
     */
    setOrderBook(data: OrderbookData) {
      this.orderBook = data;
    },

    /**
     * Update the order book data.
     * @param data - The update for the order book data.
     */
    updateQuote(data: OrderbookData) {
      // TODO: Implement the logic to update the order book data.
    },

    /**
     * Check for missed quote sequence numbers.
     * @param seqNum - The current quote sequence number.
     * @returns Returns true if the sequence is continuous; otherwise, returns false.
     */
    checkMissedQuoteNum(seqNum: number) {
      const prevSeqNum = this.orderBook.seqNum;

      return seqNum === prevSeqNum + 1;
    }
  },
});