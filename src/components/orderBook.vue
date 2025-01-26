<script>
import { onMounted, onBeforeUnmount } from 'vue';
import { useQuotesStore } from '@/stores/orderBook';
import { useWebSocket } from '@/utils/ws';

export default {
  setup() {
    const { connectOrderBookWebSocket, closeOrderBookWebSocket, connectLastPriceWebSocket, closeLastPriceWebSocket } = useWebSocket();
    const quotesStore = useQuotesStore();

    onMounted(() => {
      connectOrderBookWebSocket();
      connectLastPriceWebSocket();
    });

    onBeforeUnmount(() => {
      closeOrderBookWebSocket();
      closeLastPriceWebSocket();
    });

    return {
      quotesStore
    };
  },
};
</script>

<template>
  <div>
    <h2>Order Book</h2>
    <table>
      <thead>
        <tr>
          <th>Price(USD)</th>
          <th>Size</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody class="asks-table">
        <tr v-for="q in quotesStore.topAsksBySize" :key="q[0]">
          <td>{{ q[0] }}</td>
          <td>{{ quotesStore.orderBook.asks[q[0]] }}</td>
          <td>{{ q[2] }}</td>
        </tr>
      </tbody>
    </table>

    <div class="last-price">{{ quotesStore.orderBook.lastPrice }}</div>
    <table>
      <thead>
        <tr>
          <th>Price(USD)</th>
          <th>Size</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody class="bids-table">
        <tr v-for="q in quotesStore.topBidsBySize" :key="q[0]">
          <td>{{ q[0] }}</td>
          <td>{{ quotesStore.orderBook.bids[q[0]] }}</td>
          <td>{{ q[2] }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>


<style scoped>
</style>
