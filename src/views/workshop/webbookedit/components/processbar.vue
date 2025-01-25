<template>
  <a-affix :offset-top="80">
    <a-progress
      v-if="isShow || (beginPercent ?? -1) >= 0"
      status="success"
      :percent="percent"
      size="large"
      :animation="true"
    />
  </a-affix>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useSocket } from '@/hooks/socket';
  import { WebBookStatus } from "./../data"

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
  if (socket.listeners(WebBookStatus.Update+`.${props.bookid}`).length === 0)
  socket.on( WebBookStatus.Update+`.${props.bookid}`,({ bookid, rate, chapterId, ok, fail, all }: { bookid: number; rate: number; chapterId: number; ok: boolean; fail: boolean; all: any }) => {
      if (bookid !== props.bookid) return;
      isShow.value = true;
      percent.value = Math.floor(rate * 1000) / 1000;

      // console.log('更新进度：', rate, chapterId, ok, fail, all);

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
