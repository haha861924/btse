<script>
import { onMounted, onBeforeUnmount, computed } from 'vue';
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

    const lastPrice = computed(() => quotesStore.orderBook.lastPrice);

    return {
      orderBook: quotesStore.orderBook,
      lastPrice
    };
  },
};
</script>

<template>
  <div>
    <h2>Order Book</h2>
    <h3>Asks</h3>
    <table>
      <thead>
        <tr>
          <th>Price</th>
          <th>Size</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(size, price) in orderBook.asks" :key="price">
          <td>{{ price }}</td>
          <td>{{ size }}</td>
          <td>{{ calculateTotal(price, size) }}</td>
        </tr>
      </tbody>
    </table>

    <h3>Last Price: {{ lastPrice }}</h3>

    <h3>Bids</h3>
    <table>
      <thead>
        <tr>
          <th>Price</th>
          <th>Size</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(size, price) in orderBook.bids" :key="price">
          <td>{{ price }}</td>
          <td>{{ size }}</td>
          <td>{{ calculateTotal(price, size) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
