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
      <tbody>
        {{ quotesStore.orderBook.topBidsBySize }}
        <tr v-for="([price, size]) in quotesStore.topAsksBySize" :key="price">
          <td>{{ price }}</td>
          <td>{{ quotesStore.orderBook.asks[price] }}</td>
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
      <tbody>
        <tr v-for="([price, size]) in quotesStore.topBidsBySize" :key="price">
          <td>{{ price }}</td>
          <td>{{ quotesStore.orderBook.bids[price] }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>


<style scoped>
</style>
