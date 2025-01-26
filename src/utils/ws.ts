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
        console.log(`${endpoint} WebSocket 连接已建立`);
        subscribe();
      };

      ws.value.onmessage = onMessage;

      ws.value.onclose = () => {
        console.log(`${endpoint} WebSocket 连接已关闭`);
      };

      ws.value.onerror = (error) => {
        console.error(`${endpoint} WebSocket 错误:`, error);
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
        console.log('已发送订阅请求:', subscribeRequest);
      } else {
        console.error(`${endpoint} WebSocket 连接未打开`);
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
      console.log('OrderBook 快照：', quotes);

      // save store
      quotesStore.setOrderBook({
        asks: convertNumber(asks),
        bids: convertNumber(bids),
        seqNum,
        lastPrice: quotesStore.orderBook.lastPrice,
      });
      console.log('orderBook 快照', quotesStore.orderBook);
    } else {
      // 增量更新
      // 建立新的 asks 和 bids 物件
      const updatedAsks = { ...quotesStore.orderBook.asks };
      const updatedBids = { ...quotesStore.orderBook.bids };

      let hasUpdates = false; // 標記是否有更新

      // 更新 asks
      for (const [price, size] of Object.entries(asks)) {
        if (updatedAsks[price] !== undefined) {
          // 如果價格存在，更新 size
          if (updatedAsks[price] !== size) {
            updatedAsks[price] = size; // 直接更新為新的 size
            hasUpdates = true; // 標記為有更新
          }
        }
      }

      // 更新 bids
      for (const [price, size] of Object.entries(bids)) {
        if (updatedBids[price] !== undefined) {
          // 如果價格存在，更新 size
          if (updatedBids[price] !== size) {
            updatedBids[price] = size; // 直接更新為新的 size
            hasUpdates = true; // 標記為有更新
          }
        }
      }

      // 如果有更新，使用 setOrderBook 更新資料
      if (hasUpdates) {
        quotesStore.setOrderBook({
          asks: updatedAsks,
          bids: updatedBids,
          seqNum,
          lastPrice: quotesStore.orderBook.lastPrice, // 保持 lastPrice 不變
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
