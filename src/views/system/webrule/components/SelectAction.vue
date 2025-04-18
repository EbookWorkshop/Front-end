<template>
    <a-popover position="tl" title="填写说明">
        <a-input-group :style="{ width: '100%' }">
            <a-select v-model="type" :options="['attr', 'fun', 'reg']" :style="{ width: '160px' }" title="获取方式" />
            <a-input v-model="action" :style="{ width: '80%' }" placeholder="action" />
            <a-input v-if="type === 'fun'" v-model="param" :style="{ width: '50%' }" placeholder="param" />
        </a-input-group>
        <template #content>
            <div v-if="valueParts[0] === `attr`">
                <p>当前规则为：属性模式——直接读取命中元素对应属性的值。</p>
                <p>action常见值：
                    <a-typography-text code>innerText</a-typography-text>
                    <a-typography-text code>href</a-typography-text>
                </p>
                <p>实际将执行：document.querySelector("className").{{ valueParts[1] }}</p>
            </div>
            <div v-else-if="valueParts[0] === `fun`">
                <p>当前规则为：函数模式——在命中元素上直接执行指定函数，可以传入参数。</p>
                <p>action常见值：<a-typography-text code>getAttribute</a-typography-text></p>
                <p>实际将执行：document.querySelector("className").{{ valueParts[1] }}({{
                    valueParts[2] ? `"${valueParts[2]}"` : '' }})</p>
            </div>
            <div v-else>
                <p>当前规则为：。。。。——还没想好，目前上面两种模式已经够用了</p>
                <p>开发中</p>
            </div>
            <p>生成执行表达式：{{ valueFormat(valueParts) }}</p>
        </template>
    </a-popover>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: 'attr/innerText'
    }
});

const emit = defineEmits(['update:modelValue']);

const valueParts = computed({
    get: () => {
        // console.log('get', props.modelValue);
        const parts = props.modelValue?.split('/') || [];
        return [parts[0] || '', parts[1] || '', parts[2] || ''];
    },
    set: (vals) => {
        let val = valueFormat(vals);
        emit('update:modelValue', val);
    }
});

function valueFormat(vals: string[] | null | undefined) {
    if (!vals) return null;
    var val = vals?.join('/');
    if (val.endsWith('/')) {
        val = val.substring(0, val.length - 1);
    }
    return val;
}

const type = computed({
    get: () => valueParts.value[0],
    set: (val) => { valueParts.value = [val, '', ''] }
});

const action = computed({
    get: () => valueParts.value[1],
    set: (val) => { valueParts.value = [valueParts.value[0], val, valueParts.value[2]] }
});

const param = computed({
    get: () => valueParts.value[2],
    set: (val) => { valueParts.value = [valueParts.value[0], valueParts.value[1], val] }
});
</script>