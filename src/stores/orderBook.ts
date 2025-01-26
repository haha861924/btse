import { defineStore } from 'pinia';
import { OrderbookData } from '@/enum/orderBook'

import { sortEntriesDescendingBySize, calculateCumulativeAsks, calculateCumulativeBids } from '@/utils/number'

export const useQuotesStore = defineStore('quotes', {
  state: () => ({
    quotes: [],
    orderBook : {
      asks: {},
      bids: {},
      lastPrice: { price: 0, side: 'BUY' },
      seqNum: 0
    },
  }),
  getters: {
    /**
     * Retrieves the top eight entries of the specified type, sorted by size.
     * @param type - 'bids' or 'asks'
     * @returns The top eight sorted entries.
     */
    topBySize: (state) => {
      return (type: 'bids' | 'asks'): [string, string][] => {
        const entries = Object.entries(state.orderBook[type]);

        const sortQuotes = sortEntriesDescendingBySize(entries);

        if(type==='bids'){
          const totalQuote = calculateCumulativeBids(sortQuotes)
          return totalQuote
        } else {
          const totalQuote = calculateCumulativeAsks(sortQuotes)
          return totalQuote
        }
      };
    },

    /**
     * Retrieves the top eight bids data.
     * @returns The top eight sorted bids data.
     */
    topBidsBySize(state) {
      return this.topBySize('bids');
    },

    /**
     * Retrieves the top eight asks data.
     * @returns The top eight sorted asks data.
     */
    topAsksBySize(state) {
      return this.topBySize('asks');
    },
  },
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