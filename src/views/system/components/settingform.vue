<template>
    <div ref="containerRef" style="padding-bottom: 2.33em;">
        <form>
            <div name="target" class="setting-item-contents settings-row-inner-container" v-for="(item, index) in form"
                :key="item.title" :class="{ active: activeIndex === index, [item.status as string ||'']: true }"
                @click="setActive(index)">
                <div v-if="item.isHide !== false">
                    <div class="setting-item-title">
                        <!-- 设置文字。 -->
                        <h3>{{ item.title }}</h3>
                    </div>
                    <div class="setting-item-description">
                        <!-- 功能描述文字。 -->
                        <span>{{ item.description }}</span>
                    </div>
                    <div class="setting-item-value">
                        <!-- 编辑控件 -->
                        <slot v-if="item.controlType === 'VNode'" :name="item.dataId"> </slot>
                        <a-select v-else-if="item.controlType === 'select'" v-model="value[item.dataId]"
                            @change="updateValue(item.dataId)" :id="item.dataId" :defaultValue="value[item.dataId]">
                            <a-option v-for="option in item.options" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </a-option>
                        </a-select>

                        <a-switch v-else-if="item.controlType === 'switch'" v-model:model-value="value[item.dataId]"
                            @change="updateValue(item.dataId)" :id="item.dataId"
                            :checked-value="item.options?.[0].value" :unchecked-value="item.options?.[1].value"
                            :disabled="item.status === 'disabled'" />

                        <a-input-number v-else-if="item.controlType === 'number'" v-model:value="value[item.dataId]"
                            @change="updateValue(item.dataId)" :id="item.dataId" :default-value="value[item.dataId]" />

                        <a-color-picker v-else-if="item.controlType === 'color'" v-model:value="value[item.dataId]"
                            size="large" @change="updateValue(item.dataId)" :id="item.dataId" />

                        <a-input v-else-if="item.controlType === 'text'" v-model="value[item.dataId]"
                            :disabled="item.status === 'disabled'" @change="updateValue(item.dataId)"
                            :id="item.dataId" />

                        <a-input-password v-else-if="item.controlType === 'password'" v-model="value[item.dataId]"
                            @change="updateValue(item.dataId)" :id="item.dataId" autocomplete />

                        <a-button v-else-if="item.controlType === 'button'" type="primary" @click="item.callback"
                            :id="item.dataId">{{ item.buttonText }}</a-button>

                    </div>
                    <div class="setting-item-deprecation-message">
                        <div class="codicon codicon-error"></div>
                    </div>
                    <div class="setting-item-validation-message">{{ item.message }}</div>
                </div>
            </div>
        </form>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { SettingFormType } from './types'

const props = defineProps({
    form: {
        type: Array as () => SettingFormType[],
        default: () => []
    },
    value: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update']);

const activeIndex = ref<number | null>(null)
const containerRef = ref<HTMLElement | null>(null)

function setActive(index: number) {
    activeIndex.value = index
}
function handleDocumentClick(event: MouseEvent) {
    if (!containerRef.value?.contains(event.target as Node)) {
        activeIndex.value = null
    }
}
onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick)
})

function updateValue(dataId: string) {
    emit('update', dataId);
}
</script>


<style lang="less" scoped>
:global(.arco-divider-text) {
    font-size: 1.5em;
}

.setting-item-contents {
    margin: 2px;
    color: var(--color-text-1);
    width: 99%;
    box-sizing: border-box;
    
    &:has(div) {
        padding: 10px;
    }

    &.warning {
        border-left: 5px solid rgb(var(--orange-2)) !important;
        border-radius: 5px !important;
    }
}

.settings-row-inner-container {
    border: 1px solid transparent;
    border-radius: 3px;

    &:hover {
        border: 1px solid var(--color-border);
        background-color: var(--color-fill-2);
    }

    &:active,
    &.active {
        background-color: var(--color-fill-3);
        border-color: rgb(var(--arcoblue-6));
    }

    &.disabled {
        color: var(--color-text-3);
        cursor: not-allowed;

        .setting-item-title,
        .setting-item-description {
            color: var(--color-text-3);
        }

        .setting-item-value {
            pointer-events: none;
            opacity: 0.5;
        }

        &:hover,
        &:active,
        &.active {
            border-color: transparent;
            background-color: transparent;
        }
    }
}
</style>