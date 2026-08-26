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
import { ref, watch, PropType } from 'vue';
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

// 当前选中的标签ID（内部状态，与 prop 同步）
const tagId = ref<number | undefined>(props.tagid || undefined);
const curTag = ref<Tag>();
const tagNotInclude: number[] = [];

// 标签列表数据（异步）
const { response: tagsData } = useRequest<Tag[]>(getTagHasBook);

// 核心更新函数：调用 API 并触发 change 事件，同时更新 curTag
function updateData(id: number | undefined, exclude: number[] = []) {
    // 如果传入了 id，则清除排除列表（选中单个标签时不应该有排除）
    if (id !== undefined) {
        tagNotInclude.length = 0;
    }
    // 调用 API，参数：选中的标签 ID（可能为 undefined）和排除列表
    props.Api(id, exclude).then((result) => {
        emit('change', result.data);
        // 更新 curTag（如果 tagsData 已有数据则直接取，否则留空，后续 watch 会补充）
        if (id && tagsData.value) {
            curTag.value = tagsData.value.find(t => t.id === id);
        } else {
            curTag.value = undefined;
        }
    });
}

// 处理标签点击选中
function CheckTag(id: number | undefined) {
    tagId.value = id;
    updateData(id);
}

// 处理标签关闭（排除某个标签）
function CloseTag(id: number) {
    tagNotInclude.push(id);
    // 关闭标签时，清除选中状态（tagId 置为 undefined）
    tagId.value = undefined;
    updateData(undefined, tagNotInclude);
}

// 监听外部传入的 tagid，自动触发选中
watch(
    () => props.tagid,
    (newVal) => {
        const id = newVal > 0 ? newVal : undefined;
        // 同步内部 tagId
        tagId.value = id;
        // 清除排除列表（外部传入选中时，不应有排除）
        tagNotInclude.length = 0;
        // 触发数据更新
        updateData(id);
    },
    { immediate: true } // 立即执行，解决初始化不触发的问题
);

// 监听标签数据加载完成，补全 curTag（因为 tagsData 可能晚于 prop）
watch(
    tagsData,
    (data) => {
        if (data && tagId.value) {
            curTag.value = data.find(t => t.id === tagId.value);
        }
    },
    { immediate: true }
);
</script>