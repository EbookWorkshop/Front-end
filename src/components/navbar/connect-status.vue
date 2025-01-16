<template>
    <icon-wifi :class="connected ? 'connected' : 'disconnected'" :strokeWidth="5" :size="24" />
</template>
<script lang="ts" setup>
import { Notification } from '@arco-design/web-vue';
import { watchEffect } from 'vue';

const props = defineProps({
    connected: Boolean,
})

watchEffect(() => {
    const connectedNotice = "CONNECT_NOTICE"
    if (!props.connected) {
        Notification.error({
            id: connectedNotice,
            duration: -1, closable: true
            , content: "服务器链接已断开"
        });
    } else {
        Notification.remove(connectedNotice);
    }
});

</script>
<style>
.connected {
    color: green;
}

.disconnected {
    color: red;
}
</style>