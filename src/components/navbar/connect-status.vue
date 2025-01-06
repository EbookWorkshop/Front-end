<template>
    <icon-wifi :class="connected?'connected':'disconnected'"/>
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