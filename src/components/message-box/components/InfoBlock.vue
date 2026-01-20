<template>
    <a-scrollbar type="track" style="height:250px;overflow: auto;">
        <a-descriptions :title="title" column="1">
            <a-descriptions-item v-for="(item, index) in showData" :key="index" :label="index">
                <div v-if="Array.isArray(item) && item.length > 1">
                    <a-descriptions column="1">
                        <a-descriptions-item v-for="(subItem, subIndex) in item" :key="subIndex" :label="subIndex">
                            {{ subItem }}
                        </a-descriptions-item>
                    </a-descriptions>
                </div>
                <div v-else>
                    {{ item }}
                </div>
            </a-descriptions-item>
        </a-descriptions>
    </a-scrollbar>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    const props = defineProps({
        title: {
            type: String,
            default: '信息'
        },
        showData: {
            type: Object,
            default: () => ({})
        }
    });
</script>