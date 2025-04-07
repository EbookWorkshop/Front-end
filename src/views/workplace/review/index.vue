<template>
    <div class="container">
        <Breadcrumb :items="['menu.workplace', 'menu.workplace.correction.reviewbook']" />
        <div class="wrapper">
            <SelectBook  v-model="bookId" />
            <a-divider class="divider" />
            
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import SelectBook from '@/components/select-book/index.vue';

const bookId = ref('');
</script>