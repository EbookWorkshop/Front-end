<template>
  <a-progress
    v-if="isShow || (beginPercent ?? -1) >= 0"
    status="success"
    :percent="percent"
    size="large"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useSocket from '@/hooks/socket';

  // 入参
  const props = defineProps({
    bookid: {
      type: Number,
    },
    beginPercent: {
      type: Number,
    },
  });

  const isShow = ref(false);
  const percent = ref(0);

  if ((props.beginPercent ?? -1) > 0) percent.value = props.beginPercent ?? 0;

  const { io: socket } = useSocket();
  socket.on(
    'WebBook.UpdateChapter.Process',
    ({ bookid, rate, chapterId, ok, fail, all }) => {
      if (bookid !== props.bookid) return;
      isShow.value = true;
      percent.value = Math.floor(rate * 1000) / 1000;

      console.log('更新进度：', rate, chapterId, ok, fail, all);

      if (rate >= 1)
        setTimeout(() => {
          isShow.value = false;
          setTimeout(() => {
            percent.value = 0;
          }, 300);
        }, 280);

      // console.log("rate", rate);
    }
  );
</script>
