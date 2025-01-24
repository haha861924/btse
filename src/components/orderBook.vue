<script>
import { onMounted, onBeforeUnmount } from 'vue';
import { useWebSocket } from '@/utils/ws';

export default {
  setup() {
    const { connectOrderBookWebSocket, closeOrderBookWebSocket } = useWebSocket();


    onMounted(() => {
      connectOrderBookWebSocket();
    });

    onBeforeUnmount(() => {
      closeOrderBookWebSocket();
    });

    return {
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
