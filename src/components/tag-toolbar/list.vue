<template>
    <a-space direction="horizontal" wrap :v-if="tagsData.length > 0">
        <span :style="{ color: 'var(--color-neutral-8)' }">标签：</span>
        <template v-if="tagId ?? 0 > 0"><!-- 已选中某标签模式 -->
            <a-tag :color="curTag?.Color" :style="{ cursor: 'pointer' }">
                {{ curTag?.Text }}({{ curTag?.Count }})
            </a-tag>
            <a-tag @click="CheckTag(undefined)"><template #icon><icon-close /></template> </a-tag>
        </template>
        <template v-else>
            <a-tag v-for="t of tagsData" :color="t.Color" :key="t.id" :style="{ cursor: 'pointer' }" :closable="true"
                @close="CloseTag(t.id)" @click="CheckTag(t.id)">
                {{ t.Text }}({{ t.Count }})
            </a-tag>
        </template>
    </a-space>
</template>
<script setup lang="ts">
import { ref, PropType } from 'vue';
import useRequest from '../../hooks/request';
import { ListQueryApi } from '@/api/library';
import { getTagHasBook, Tag } from '@/api/tag';

const emit = defineEmits(['change']);
const props = defineProps({
    tagid: {
        type: Number,
        default: 0
    },
    Api: {
        type: Function as PropType<ListQueryApi>,
        required: true
    }
});

const tagId = ref<number | undefined>(props.tagid);
const curTag = ref<Tag>();
const tagNotInclude = [];

//标签相关逻辑
const { response: tagsData } = useRequest<Tag[]>(getTagHasBook);
function CheckTag(id: number | undefined) {
    tagId.value = id;
    props.Api(id).then((result) => {
        emit('change', result.data);
        curTag.value = tagsData.value.filter(t => t.id === tagId.value)[0];
    })
}
function CloseTag(id: number) {
    tagNotInclude.push(id);
    props.Api(undefined, tagNotInclude).then((result) => {
        emit('change', result.data);
    })
}
</script>