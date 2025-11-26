<template>
    <a-modal :visible="visible" title="分卷设置" :width="800" draggable @ok="close" @cancel="close" fullscreen>
        <div class="volume-setting-container">
            <!-- 左侧：卷列表 -->
            <div class="volume-list-panel">
                <div class="volume-list-header">
                    <span>卷列表</span>
                    <a-button size="small" type="primary" @click="showAddVolumeModal = true">
                        <template #icon><icon-plus /></template>
                        新增卷
                    </a-button>
                </div>
                <div class="volume-list">
                    <div v-for="volume in sortedVolumes" :key="volume.id" class="volume-item"
                        :class="{ active: selectedVolume?.id === volume.id }" @click="selectVolume(volume)">
                        <div class="volume-info">
                            <span class="volume-title">{{ volume.Title }}</span>
                            <span class="volume-chapter-count">({{ getVolumeChapterCount(volume.id) }}章)</span>
                        </div>
                        <div class="volume-actions">
                            <a-tooltip content="编辑">
                                <a-button size="small" circle @click.stop="editVolume(volume)">
                                    <template #icon><icon-edit /></template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip content="删除">
                                <a-button size="small" circle danger @click.stop="deleteVolume(volume)">
                                    <template #icon><icon-delete /></template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip content="上移" :disabled="volume.OrderNum === 1">
                                <a-button size="small" circle :disabled="volume.OrderNum === 1"
                                    @click.stop="moveVolume(volume, 'up')">
                                    <template #icon><icon-arrow-up /></template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip content="下移" :disabled="volume.OrderNum === sortedVolumes.length">
                                <a-button size="small" circle :disabled="volume.OrderNum === sortedVolumes.length"
                                    @click.stop="moveVolume(volume, 'down')">
                                    <template #icon><icon-arrow-down /></template>
                                </a-button>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧：章节管理 -->
            <div class="chapter-management-panel">
                <div v-if="!selectedVolume" class="empty-state">
                    <a-empty description="请选择一个卷进行章节管理" />
                </div>
                <div v-else class="chapter-management-content">
                    <div class="chapter-management-header">
                        <span>{{ selectedVolume.Title }} - 章节管理</span>
                    </div>

                    <!-- 范围选择工具栏 -->
                    <div class="range-selection-toolbar">
                        <a-input-group compact>
                            <a-input v-model="rangeStart" placeholder="起始章节" style="width: 100px" type="number" />
                            <span class="range-separator">-</span>
                            <a-input v-model="rangeEnd" placeholder="结束章节" style="width: 100px" type="number" />
                            <a-button>选择范围</a-button>
                        </a-input-group>

                        <a-input v-model="chapterSearch" placeholder="搜索章节标题" allow-clear
                            style="width: 200px; margin-left: 10px" prefix-icon="icon-search" />
                        <a-button v-if="chapterSearch" style="margin-left: 10px">
                            选择搜索结果
                        </a-button>
                    </div>

                    <div style="display: flex;">
                        <!-- 已在卷中的章节 -->
                        <div class="chapter-section">
                            <div class="section-header">
                                <div style="display: flex; align-items: center;">
                                    <span>已在卷中的章节 ({{ volumeChapters.length }})</span>
                                </div>
                                <div>
                                    <a-button size="small" @click="removeAllChapters"
                                        :disabled="volumeChapters.length === 0">
                                        移出全部
                                    </a-button>
                                    <a-button size="small" style="margin-left: 8px">
                                        反选
                                    </a-button>
                                </div>
                            </div>
                            <div class="chapter-list">
                                <div v-for="chapter in filteredVolumeChapters" :key="chapter.IndexId"
                                    class="chapter-item"
                                    :class="{ selected: selectedChapters.includes(chapter.IndexId) }"
                                    @click.stop="toggleChapterSelection(chapter.IndexId, $event)">
                                    <div class="chapter-info">
                                        <span class="chapter-order">{{ chapter.OrderNum }}.</span>
                                        <span class="chapter-title">{{ chapter.Title }}</span>
                                    </div>
                                    <a-button size="small" circle text @click.stop="removeChapter(chapter.IndexId)">
                                        <template #icon><icon-right /></template>
                                    </a-button>
                                </div>
                            </div>
                        </div>

                        <!-- 可用章节 -->
                        <div class="chapter-section">
                            <div class="section-header">
                                <div style="display: flex; align-items: center;">
                                    <span>可用章节 ({{ availableChapters.length }})</span>
                                </div>
                                <div>
                                    <a-button size="small" @click="addAllChapters"
                                        :disabled="availableChapters.length === 0">
                                        移入全部
                                    </a-button>
                                    <a-button size="small" style="margin-left: 8px">
                                        反选
                                    </a-button>
                                </div>
                            </div>
                            <div class="chapter-list">
                                <div v-for="chapter in filteredAvailableChapters" :key="chapter.IndexId"
                                    class="chapter-item"
                                    :class="{ selected: selectedChapters.includes(chapter.IndexId) }"
                                    @click.stop="toggleChapterSelection(chapter.IndexId, $event)">
                                    <div class="chapter-info">
                                        <span class="chapter-order">{{ chapter.OrderNum }}.</span>
                                        <span class="chapter-title">{{ chapter.Title }}</span>
                                    </div>
                                    <a-button size="small" circle text @click.stop="addChapter(chapter.IndexId)">
                                        <template #icon><icon-left /></template>
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- 批量操作 -->
        <div v-if="selectedChapters.length > 0" class="batch-operations">
            <a-button size="small" @click="addSelectedChapters">
                批量移入选中章节
            </a-button>
            <a-button size="small" @click="removeSelectedChapters">
                批量移出选中章节
            </a-button>
            <a-button size="small" @click="clearSelection">
                取消选择
            </a-button>
            <span style="margin-left: 16px; color: var(--color-text-2);">
                已选择 {{ selectedChapters.length }} 个章节
            </span>
        </div>

        <!-- 其他模态框部分保持不变 -->
        <a-modal v-model:visible="showAddVolumeModal" title="新增卷" @ok="confirmAddVolume" @cancel="cancelAddVolume">
            <a-form :model="newVolumeForm" layout="vertical">
                <a-form-item field="Title" label="卷标题" :rules="[{ required: true, message: '请输入卷标题' }]">
                    <a-input v-model="newVolumeForm.Title" placeholder="请输入卷标题" />
                </a-form-item>
                <a-form-item field="Introduction" label="卷介绍">
                    <a-textarea v-model="editVolumeForm.Introduction" placeholder="请输入卷介绍" />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 编辑卷对话框 -->
        <a-modal v-model:visible="showEditVolumeModal" title="编辑卷" @ok="confirmEditVolume" @cancel="cancelEditVolume">
            <a-form :model="editVolumeForm" layout="vertical">
                <a-form-item field="Title" label="卷标题" :rules="[{ required: true, message: '请输入卷标题' }]">
                    <a-input v-model="editVolumeForm.Title" placeholder="请输入卷标题" />
                </a-form-item>
                <a-form-item field="Introduction" label="卷介绍">
                    <a-textarea v-model="editVolumeForm.Introduction" placeholder="请输入卷介绍" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-modal>
</template>

<script lang="ts" setup>
import type { Volume, Chapter } from '@/types/book';
import { ref, reactive, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
// 导入所需的图标组件
import {
    IconEdit,
    IconDelete,
    IconPlus,
    IconArrowUp,
    IconArrowDown,
    IconLeft,
    IconRight,
    IconSearch
} from '@arco-design/web-vue/es/icon';

import { addVolume as apiAddVolume, editVolume as apiEditVolume, deleteVolume as apiDeleteVolume } from '@/api/book';
import { ApiResultCode } from '@/types/global';


const props = defineProps<{
    visible: boolean;
    bookId: number;
    volumes: Volume[];
    chapters: Chapter[];
}>();

const emit = defineEmits(['update:visible', 'update']);

// 状态管理
const selectedVolume = ref<Volume | null>(null);
const selectedChapters = ref<number[]>([]);
const showAddVolumeModal = ref(false);
const showEditVolumeModal = ref(false);
const newVolumeForm = reactive({ Title: '', Introduction: '' });
const editVolumeForm = reactive({ Title: '', Introduction: '' });
const editingVolume = ref<Volume | null>(null);

// 新增状态 - 用于范围选择和搜索
const rangeStart = ref<number | null>(null);
const rangeEnd = ref<number | null>(null);
const chapterSearch = ref('');
const lastSelectedChapterId = ref<number | null>(null);

// 计算属性
const sortedVolumes = computed(() => {
    return [...props.volumes].sort((a, b) => a.OrderNum - b.OrderNum);
});
//当前卷章节
const volumeChapters = computed(() => {
    if (!selectedVolume.value) return [];
    return props.chapters
        .filter(chapter => chapter.VolumeId === selectedVolume.value?.id)
        .sort((a, b) => a.OrderNum - b.OrderNum);
});
// 可用章节列表
const availableChapters = computed(() => {
    return props.chapters
        .filter(chapter => !chapter.VolumeId)
        .sort((a, b) => a.OrderNum - b.OrderNum);
});

// 筛选后的章节列表
const filteredVolumeChapters = computed(() => {
    if (!chapterSearch.value) return volumeChapters.value;
    const searchTerm = chapterSearch.value.toLowerCase();
    return volumeChapters.value.filter(chapter =>
        chapter.Title.toLowerCase().includes(searchTerm)
    );
});

const filteredAvailableChapters = computed(() => {
    if (!chapterSearch.value) return availableChapters.value;
    const searchTerm = chapterSearch.value.toLowerCase();
    return availableChapters.value.filter(chapter =>
        chapter.Title.toLowerCase().includes(searchTerm)
    );
});

// 全选状态计算
const isAllVolumeChaptersSelected = computed(() => {
    return filteredVolumeChapters.value.length > 0 &&
        filteredVolumeChapters.value.every(chapter =>
            selectedChapters.value.includes(chapter.IndexId)
        );
});

const isAllAvailableChaptersSelected = computed(() => {
    return filteredAvailableChapters.value.length > 0 &&
        filteredAvailableChapters.value.every(chapter =>
            selectedChapters.value.includes(chapter.IndexId)
        );
});

// 方法
function close() {
    emit('update:visible', false);
}

function selectVolume(volume: Volume) {
    selectedVolume.value = volume;
    selectedChapters.value = [];
    lastSelectedChapterId.value = null;
    // 重置搜索和范围选择
    chapterSearch.value = '';
    rangeStart.value = null;
    rangeEnd.value = null;
}

// 其他原有方法保持不变
function getVolumeChapterCount(volumeId: number): number {
    return props.chapters.filter(chapter => chapter.VolumeId === volumeId).length;
}

function showAddVolume() {
    newVolumeForm.Title = '';
    showAddVolumeModal.value = true;
}

function confirmAddVolume() {
    if (!newVolumeForm.Title.trim()) {
        Message.error('请输入卷标题');
        return;
    }

    // 这里应该调用API，现在只是模拟
    const newVolume: Volume = {
        id: Date.now(), // 临时ID，实际应从API返回
        Title: newVolumeForm.Title.trim(),
        BookId: props.bookId,
        OrderNum: sortedVolumes.value.length + 1
    };
    apiAddVolume(props.bookId, newVolume.Title, newVolumeForm.Introduction).then(response => {
        console.log(response);
        if (response.code === ApiResultCode.Success) {
            Message.success('新增卷成功');
            showAddVolumeModal.value = false;

            // 触发更新事件，通知父组件
            emit('update', { type: 'add', data: newVolume });
        } else {
            Message.error('新增卷失败: ' + response.msg);
        }
    }).catch((err) => {
        Message.error('新增卷时发生错误' + err.message);
    });
}

function cancelAddVolume() {
    newVolumeForm.Title = '';
    showAddVolumeModal.value = false;
}

function editVolume(volume: Volume) {
    editingVolume.value = volume;
    editVolumeForm.Title = volume.Title;
    showEditVolumeModal.value = true;
}

function confirmEditVolume() {
    if (!editVolumeForm.Title.trim() || !editingVolume.value) {
        Message.error('请输入卷标题');
        return;
    }

    // 这里应该调用API，现在只是模拟
    const updatedVolume: Volume = {
        ...editingVolume.value,
        Title: editVolumeForm.Title.trim()
    };

    // 模拟编辑成功
    Message.success('【模拟】编辑卷成功');
    showEditVolumeModal.value = false;

    // 触发更新事件，通知父组件
    emit('update', { type: 'edit', data: updatedVolume });
}

function cancelEditVolume() {
    editVolumeForm.Title = '';
    editingVolume.value = null;
    showEditVolumeModal.value = false;
}

function deleteVolume(volume: Volume) {
    // 检查卷中是否有章节
    if (getVolumeChapterCount(volume.id) > 0) {
        Message.error('该卷中包含章节，无法删除');
        return;
    }

    // 这里应该调用API，现在只是模拟

    // 模拟删除成功
    Message.success('【模拟】删除卷成功');

    // 如果删除的是当前选中的卷，清除选中状态
    if (selectedVolume.value?.id === volume.id) {
        selectedVolume.value = null;
        selectedChapters.value = [];
    }

    // 触发更新事件，通知父组件
    emit('update', { type: 'delete', data: volume.id });
}

function moveVolume(volume: Volume, direction: 'up' | 'down') {
    // 找到相邻的卷
    const volumes = sortedVolumes.value;
    const currentIndex = volumes.findIndex(v => v.id === volume.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= volumes.length) return;

    const targetVolume = volumes[targetIndex];

    // 交换顺序
    const updatedVolume1: Volume = { ...volume, OrderNum: targetVolume.OrderNum };
    const updatedVolume2: Volume = { ...targetVolume, OrderNum: volume.OrderNum };

    // 模拟移动成功
    Message.success('【模拟】调整顺序成功');

    // 触发更新事件，通知父组件
    emit('update', { type: 'move', data: [updatedVolume1, updatedVolume2] });
}

function toggleChapterSelection(chapterId: number, event: MouseEvent) {
    const index = selectedChapters.value.indexOf(chapterId);
    if (index > -1) {
        selectedChapters.value.splice(index, 1);
    } else {
        selectedChapters.value.push(chapterId);
    }
}

function clearSelection() {
    selectedChapters.value = [];
}

function addChapter(chapterId: number) {
    if (!selectedVolume.value) return;

    // 这里应该调用API，现在只是模拟

    // 模拟添加成功
    Message.success('【模拟】章节已移入该卷');

    // 触发更新事件，通知父组件
    emit('update', {
        type: 'addChapter',
        data: { chapterId, volumeId: selectedVolume.value?.id }
    });
}

function removeChapter(chapterId: number) {
    if (!selectedVolume.value) return;

    // 这里应该调用API，现在只是模拟

    // 模拟移出成功
    Message.success('【模拟】章节已移出该卷');

    // 触发更新事件，通知父组件
    emit('update', {
        type: 'removeChapter',
        data: { chapterId, volumeId: selectedVolume.value?.id }
    });
}

function addAllChapters() {
    if (!selectedVolume.value || availableChapters.value.length === 0) return;

    const chapterIds = availableChapters.value.map(chapter => chapter.IndexId);

    // 这里应该调用API，现在只是模拟

    // 模拟添加成功
    Message.success(`【模拟】已将${chapterIds.length}个章节移入该卷`);

    // 触发更新事件，通知父组件
    emit('update', {
        type: 'addAllChapters',
        data: { chapterIds, volumeId: selectedVolume.value?.id }
    });
}

function removeAllChapters() {
    if (!selectedVolume.value || volumeChapters.value.length === 0) return;

    const chapterIds = volumeChapters.value.map(chapter => chapter.IndexId);

    // 这里应该调用API，现在只是模拟

    // 模拟移出成功
    Message.success(`【模拟】已将${chapterIds.length}个章节移出该卷`);

    // 触发更新事件，通知父组件
    emit('update', {
        type: 'removeAllChapters',
        data: { chapterIds, volumeId: selectedVolume.value?.id }
    });
}

function addSelectedChapters() {
    if (!selectedVolume.value || selectedChapters.value.length === 0) return;

    // 只添加可用章节中的选中项
    const chaptersToAdd = selectedChapters.value.filter(chapterId =>
        availableChapters.value.some(chapter => chapter.IndexId === chapterId)
    );

    if (chaptersToAdd.length === 0) {
        Message.warning('请选择要移入的章节');
        return;
    }

    // 这里应该调用API，现在只是模拟

    // 模拟添加成功
    Message.success(`【模拟】已将${chaptersToAdd.length}个章节移入该卷`);

    // 触发更新事件，通知父组件
    emit('update', {
        type: 'addSelectedChapters',
        data: { chapterIds: chaptersToAdd, volumeId: selectedVolume.value?.id }
    });

    // 清除选中状态
    selectedChapters.value = [];
}

function removeSelectedChapters() {
    if (!selectedVolume.value || selectedChapters.value.length === 0) return;

    // 只移除卷中章节的选中项
    const chaptersToRemove = selectedChapters.value.filter(chapterId =>
        volumeChapters.value.some(chapter => chapter.IndexId === chapterId)
    );

    if (chaptersToRemove.length === 0) {
        Message.warning('请选择要移出的章节');
        return;
    }

    // 这里应该调用API，现在只是模拟

    // 模拟移出成功
    Message.success(`【模拟】已将${chaptersToRemove.length}个章节移出该卷`);

    // 触发更新事件，通知父组件
    emit('update', {
        type: 'removeSelectedChapters',
        data: { chapterIds: chaptersToRemove, volumeId: selectedVolume.value?.id }
    });

    // 清除选中状态
    selectedChapters.value = [];
}
</script>

<style lang="less" scoped>
.volume-setting-container {
    display: flex;
    gap: 20px;
    overflow: hidden;
}

.volume-list-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius);
    overflow: hidden;
}

.volume-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--color-bg-1);
    border-bottom: 1px solid var(--color-border-2);
    font-weight: 500;
}

.volume-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
}

.volume-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-bg-1);
    }

    &.active {
        background-color: var(--primary-1);
        border-color: var(--primary-6);
    }
}

.volume-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.volume-title {
    font-weight: 500;
}

.volume-chapter-count {
    color: var(--color-text-2);
    font-size: 12px;
}

.volume-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;

    .volume-item:hover & {
        opacity: 1;
    }
}

.chapter-management-panel {
    flex: 2;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border-2);
    overflow: hidden;
}

.empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chapter-management-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.chapter-management-header {
    padding: 12px 16px;
    background-color: var(--color-bg-1);
    border-bottom: 1px solid var(--color-border-2);
    font-weight: 500;
    text-align: center;
}

.chapter-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 26px;

    &:first-child {
        border-bottom: 1px solid var(--color-border-2);
    }
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: var(--color-bg-2);
    font-size: 14px;
    font-weight: 500;
}

.chapter-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
}

.chapter-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 4px;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-neutral-4);
    }

    &.selected {
        background-color: rgb(var(--arcoblue-1));
    }
}

.chapter-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.chapter-order {
    color: var(--color-neutral-8);
    font-size: 12px;
    min-width: 30px;
}

.chapter-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.batch-operations {
    position: fixed;
    bottom: 65px;
    left: 0px;
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: var(--color-bg-1);
    border-top: 1px solid var(--color-border-2);
    width: 100%;
    flex-basis: 100%;
    order: 999;
    align-self: flex-start;
}
</style>