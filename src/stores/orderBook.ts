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
    // // TODO 改 quote type
    // addQuote(quote: object) {
    //   this.quotes.push(quote); // 添加新引用到 quotes 数组
    // },
    setOrderBook(data: OrderbookData) {
      this.orderBook = data;
    },
    updateQuote(data: OrderbookData) {
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