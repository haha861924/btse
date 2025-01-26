import { ref } from 'vue';
import { useQuotesStore } from '@/stores/orderBook';
import { convertNumber, formatNumberWithCommas } from '@/utils/number';

import {
  WS_PATH,
  ORDERBOOK_ENDPOINT,
  LAST_PRICE_ENDPOINT,
  ORDERBOOK_TOPIC,
  LAST_PRICE_TOPIC,
} from '@/enum/ws';

export function useWebSocket() {
  const quotesStore = useQuotesStore();

  const createWebSocket = (
    endpoint: string,
    onMessage: (event: MessageEvent) => void
  ) => {
    const ws = ref<WebSocket | null>(null);

    const connect = () => {
      ws.value = new WebSocket(`${WS_PATH}${endpoint}`);

      ws.value.onopen = () => {
        console.log(`${endpoint} WebSocket open connection`);
        subscribe();
      };

      ws.value.onmessage = onMessage;

      ws.value.onclose = () => {
        console.warn(`${endpoint} WebSocket close connection`);
      };

      ws.value.onerror = (error) => {
        console.error(`${endpoint} WebSocket error:`, error);
      };
    };

    const subscribe = () => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        const subscribeRequest = {
          op: 'subscribe',
          args: [
            endpoint === ORDERBOOK_ENDPOINT
              ? ORDERBOOK_TOPIC
              : LAST_PRICE_TOPIC,
          ],
        };
        ws.value.send(JSON.stringify(subscribeRequest));
      }
    };

    const close = () => {
      if (ws.value) {
        ws.value.close();
      }
    };

    return { connect, close };
  };

  const orderBookOnMessage = (event: MessageEvent) => {
    const quotes = JSON.parse(event.data);

    if (!quotes.data) return;

    const { asks, bids, seqNum, type } = quotes.data;

    if (type === 'snapshot') {
      // save store
      quotesStore.setOrderBook({
        asks: convertNumber(asks),
        bids: convertNumber(bids),
        seqNum,
        lastPrice: quotesStore.orderBook.lastPrice,
      });
    } else {
      // check any quotes are missing
      quotesStore.setHasReconnect(quotesStore.checkMissedQuoteNum(seqNum));

      const updatedAsks = { ...quotesStore.orderBook.asks };
      const updatedBids = { ...quotesStore.orderBook.bids };

      let hasUpdates = false;

      // update asks
      for (const [price, size] of asks) {
        const formattedPrice = formatNumberWithCommas(price);

        if (updatedAsks[formattedPrice] !== undefined) {
          updatedAsks[formattedPrice] = size;
          hasUpdates = true;
        }
      }

      // update bids
      for (const [price, size] of bids) {
        const formattedPrice = formatNumberWithCommas(price);

        if (updatedBids[formattedPrice] !== undefined) {
          updatedBids[formattedPrice] = size;
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        quotesStore.setOrderBook({
          asks: updatedAsks,
          bids: updatedBids,
          seqNum,
          lastPrice: quotesStore.orderBook.lastPrice,
        });
      }
    }
  };

  const lastPriceOnMessage = (event: MessageEvent) => {
    const { data } = JSON.parse(event.data);

    if (!data) return;

    const formatPrice = formatNumberWithCommas(data[0].price);

    // save store
    quotesStore.setOrderBook({
      ...quotesStore.orderBook,
      lastPrice: { price: formatPrice, side: data[0].side },
    });
  };

  const orderBookWs = createWebSocket(ORDERBOOK_ENDPOINT, orderBookOnMessage);
  const lastPriceWs = createWebSocket(LAST_PRICE_ENDPOINT, lastPriceOnMessage);

  return {
    connectOrderBookWebSocket: orderBookWs.connect,
    connectLastPriceWebSocket: lastPriceWs.connect,
    closeOrderBookWebSocket: orderBookWs.close,
    closeLastPriceWebSocket: lastPriceWs.close,
  };
}
