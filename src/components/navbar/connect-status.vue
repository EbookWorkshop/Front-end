<template>
    <icon-wifi :class="connected?'connected':'disconnected'" :strokeWidth="5" :size="24" />
</template>
<script lang="ts" setup>

defineProps({
    connected:Boolean,
})
</script>
<style>
    .connected{
        color:green;
    }
    .disconnected{
        color:red;
    }
</style>