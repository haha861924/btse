import { ref } from 'vue';
import { useQuotesStore } from '@/stores/orderBook';
import { convertNumber } from '@/utils/number';

import {
  WS_PATH,
  ORDERBOOK_ENDPOINT,
  LAST_PRICE_ENDPOINT,
  ORDERBOOK_TOPIC,
  LAST_PRICE_TOPIC
} from '@/enum/ws';


export function useWebSocket() {
  const quotesStore = useQuotesStore();

  const createWebSocket = (endpoint: string, onMessage: (event: MessageEvent) => void) => {
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
          args: [endpoint === ORDERBOOK_ENDPOINT ? ORDERBOOK_TOPIC : LAST_PRICE_TOPIC],
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
    const { asks, bids, seqNum, type } = quotes.data;

    if (type === 'snapshot') {
      console.log('OrderBook 快照：', quotes);
      quotesStore.setOrderBook({
        asks: convertNumber(asks),
        bids: convertNumber(bids),
        seqNum,
      });
      console.log(1, quotesStore.orderBook);
    } else {
      console.log('OrderBook 增量更新:', quotes);
    }
  };

  const lastPriceOnMessage = (event: MessageEvent) => {
    console.log('LastPrice 消息:', event.data);
    // 這裡可以根據需要處理 lastPriceMessage
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
