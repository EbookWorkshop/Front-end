<template>
    <a-row align="stretch" justify="center" style="height: 200px;">
        <a-space size="large">
            <a-button-group type="primary">
                <a-button @click="emit('CheckAll')"> 全选章节 </a-button>
                <a-button> cut </a-button>
                <a-button> find </a-button>
                <a-button> <template #icon><icon-heart-fill /></template> </a-button>
                <a-button> <template #icon><icon-star-fill /></template> </a-button>
                <a-button> <template #icon><icon-thumb-up-fill /></template> </a-button>
                <a-button> prev </a-button>
                <a-button> next </a-button>
            </a-button-group>
        </a-space>
    </a-row>
</template>
<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(["CheckAll"]);



</script>