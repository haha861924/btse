<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useQuotesStore } from '@/stores/orderBook'
// import { OrderbookData } from '@/enum/orderBook'
import { convertNumber } from  '@/utils/number'

export default {
  setup() {
    const ws = ref(null);
    const serverMessage = ref('');
    const endpoint = 'wss://ws.btse.com/ws/oss/futures'; // WebSocket 服务器地址
    const topic = 'update:BTCPFC_8'; // 要订阅的主题
    const quotesStore = useQuotesStore();

    const connectWebSocket = () => {
      ws.value = new WebSocket(endpoint);

      ws.value.onopen = () => {
        console.log('WebSocket 连接已建立');
        // subscribe message
        subscribeToTopic();
      };

      ws.value.onmessage = (event) => {
        // format data
        serverMessage.value = event.data;
        // 收到快照的時候，直接存取
        // 收到增量更新的時候，只需要更新價格就好
        const quotes = JSON.parse(event.data);
        const { asks, bids, seqNum, type } = quotes.data;

        if(type === 'snapshot') {
          console.log('快照：', quotes)

          // save snapshot 50 quotes
          quotesStore.setOrderBook({
            asks: convertNumber(asks),
            bids: convertNumber(bids),
            seqNum
          })
          console.log(1, quotesStore.orderBook)

        } else {
          console.log('增量更新:', quotes);
        }
        // quotesStore.addQuote(JSON.parse(event.data));
        // console.log(quotesStore.quotes)
      };

      ws.value.onclose = () => {
        console.log('WebSocket 连接已关闭');
      };

      ws.value.onerror = (error) => {
        console.error('WebSocket 错误:', error);
      };
    };

    const subscribeToTopic = () => {
      console.log('hello')
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        const subscribeRequest = {
          op: 'subscribe',
          args: [topic],
        };

        ws.value.send(JSON.stringify(subscribeRequest));
        console.log('已发送订阅请求:', subscribeRequest);
      } else {
        console.error('WebSocket 连接未打开');
      }
    };

    const unsubscribeFromTopic = () => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        const unsubscribeRequest = {
          op: 'unsubscribe',
          args: [topic],
        };

        ws.value.send(JSON.stringify(unsubscribeRequest));
        console.log('已发送取消订阅请求:', unsubscribeRequest);
      } else {
        console.error('WebSocket 连接未打开');
      }
    };

    const closeWebSocket = () => {
      if (ws.value) {
        ws.value.close();
      }
    };

    onMounted(() => {
      connectWebSocket();
    });

    onBeforeUnmount(() => {
      closeWebSocket();
    });

    return {
      serverMessage,
      subscribeToTopic,
      unsubscribeFromTopic,
    };
  },
};
</script>

<template>
  <div>
    <ul>
      <li v-for="(quote, index) in quotes" :key="index">{{ quote['topic'] }}</li>
    </ul>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
