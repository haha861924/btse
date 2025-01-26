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
      <tbody class="bids-table">
        <tr v-for="q in quotesStore.topBidsBySize" :key="q[0]">
          <td>{{ q[0] }}</td>
          <td>{{ quotesStore.orderBook.bids[q[0]] }}</td>
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
      <tbody class="asks-table">
        <tr v-for="q in quotesStore.topAsksBySize" :key="q[0]">
          <td>{{ q[0] }}</td>
          <td>{{ quotesStore.orderBook.asks[q[0]] }}</td>
          <td>{{ q[2] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
body {
  background-color: #131B29;
  color: #F0F4F8;
}

table {
  width: 80%;
  border-collapse: collapse;
  margin-bottom: 20px;
  margin: 0 auto;
}

th {
  color: #8698aa;
  text-align: end;
  padding: 10px;
}

td {
  padding: 10px;
  vertical-align: center;
}

/* Row hover effect */
tr:hover {
  background-color: #1E3059;
}

.asks-table > tr {
  color: #00b15d;
}

.bids-table > tr {
  color: #FF5B5A;
}

.last-price {
  padding: 10px;
}

/* Last price color styles */
.last-price-up {
  color: #00b15d;
  background-color: rgba(16, 186, 104, 0.12);
}

.last-price-down {
  color: #FF5B5A;
  background-color: rgba(255, 90, 90, 0.12);
}

.last-price-same {
  color: #F0F4F8;
  background-color: rgba(134, 152, 170, 0.12);
}

/* Quote total and percentage bar styles */
.accumulative-bar {
  height: 10px;
  background-color: rgba(16, 186, 104, 0.12); /* For buy quotes */
}

.accumulative-bar-sell {
  background-color: rgba(255, 90, 90, 0.12); /* For sell quotes */
}

/* Animation styles */
.flash-green {
  animation: flash-green 0.5s forwards;
}

.flash-red {
  animation: flash-red 0.5s forwards;
}

@keyframes flash-green {
  from {
    background-color: transparent;
  }
  to {
    background-color: rgba(0, 177, 93, 0.5);
  }
}

@keyframes flash-red {
  from {
    background-color: transparent;
  }
  to {
    background-color: rgba(255, 91, 90, 0.5);
  }
}
</style>

