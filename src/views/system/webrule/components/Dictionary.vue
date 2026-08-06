<template>
    <a-modal :visible="visible" title="设置转码字典" width="auto" @before-ok="handleOk" @cancel="handleCancel">
        <div style="max-height:80vh">
            <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-layout>
                    <a-layout>
                        <a-layout-sider :width="360">

                            <a-form-item>
                                <a-space>
                                    <!-- 操作按钮：新增 / 删除 -->
                                    <a-button size="small" type="primary" @click="addItem(form.items.length)">新增行</a-button>
                                    <a-button size="small" type="outline" status="danger" @click="removeItem(form.items.length - 1)">删除行</a-button>
                                </a-space>
                            </a-form-item>

                            <div>
                                <h3 style="text-align:center;">【字典校阅】使用情景</h3>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;本功能实际作用是，当程序从目标网站抓取到内容后，按顺序逐一执行转码字典。是用于针对网站的批量转换方案。</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;与系统另一功能【规则校阅】都有查找内容并替换到目标文本的功能。差异在于：</p>
                                <ol>
                                    <li>【字典校阅】针对站点实现；【规则校阅】按具体书籍配置。</li>
                                    <li>【字典校阅】在抓取后立即替换，存储的是已替换的结果，转换后果单向且不可逆；【规则校阅】在每次输出前进行替换，数据库保留的是原始的数据，随时能恢复转换前的效果。</li>
                                    <li>【字典校阅】可以针对目标页面是否存在特定元素实现自动启用与否；</li>
                                </ol>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;常见的适用情景：</p>
                                <ul>
                                    <li>当目标网站使用私有区字体配合特殊字体反爬时，可以设置转换字典，将混淆的内容还原为正常文本。</li>
                                    <li>全站范围的敏感字词、错别字词还原。</li>
                                    <li>繁/简转换</li>
                                </ul>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;转换字典填写格式：每行实现一次转换，每行格式是『转换前字符&nbsp;空格分割&nbsp;转换后字符』。</p>
                            </div>
                        </a-layout-sider>

                        <a-layout-content>
                            <template v-for="(item, index) in form.items" :key="index">
                                <a-divider v-if="index > 0" />
                                <a-form-item field="['items', index, 'ExecuteType','Execute']" label="执行条件">
                                    <a-popover position="tl" title="填写说明">
                                        <a-input-group :style="{ width: '100%' }">
                                            <a-select v-model="item.ExecuteType"
                                                :options="['Selector', 'Boolean']"></a-select>
                                            <a-input v-model="item.Execute" placeholder="请输入执行内容" />
                                        </a-input-group>
                                        <template #content>
                                            <div>
                                                <p>当执行条件成功时，才按下列字典转换数据。用于应对目标站点采用随机字典的情况。</p>
                                                <dl>
                                                    <dt>Selector</dt>
                                                    <dd>当页面存在某些指定的元素时，才启用转换。填入的内容是目标页面可能存在的选择器。</dd>
                                                    <dt>Boolean</dt>
                                                    <dd>可以看作是【启用/停用】的开关模式。填入的内容最终将尝试转换为布尔值。</dd>
                                                </dl>
                                            </div>
                                        </template>
                                    </a-popover>
                                </a-form-item>
                                <a-form-item field="['items', index, 'Data']" label="转换字典">
                                    <a-textarea v-model="item.Data" />
                                </a-form-item>

                            </template>
                        </a-layout-content>

                    </a-layout>
                </a-layout>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { saveHostDictionaries } from '@/api/webbot';

// 定义 props
interface Props {
    visible: boolean;
    host: string;
    data: any[];
}

interface DictItem {
    ExecuteType: string;
    Execute: string;
    Data: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'success', data: DictItem[]): void;
}>();

const form = reactive<{ items: DictItem[] }>({
    items: [],
});

function createDictItem(item: Partial<DictItem> = {}): DictItem {
    return {
        //Host: item.Host || '',
        ExecuteType: item.ExecuteType || 'Selector',
        Execute: item.Execute || '',
        Data: item.Data || '',
    };
}

watch(
    () => props.data,
    (data) => {
        const list = Array.isArray(data) ? data : [];
        form.items =
            list.length > 0
                ? list.map((item) => createDictItem(item as Partial<DictItem>))
                : [createDictItem()];
    },
    { immediate: true, deep: true }
);

function handleCancel() {
    emit('update:visible', false);
}

async function handleOk() {
    const hasEmpty = form.items.some(
        (item) => !item.ExecuteType || !item.Execute || !item.Data
    );

    if (hasEmpty && form.items.length > 1) {
        Message.error('请完整填写转码字典信息');
        return false;
    }
    //保存
    let data = form.items.filter(i => i.Execute != '');

    await saveHostDictionaries(props.host, data);
    Message.success('保存成功');
    emit('success', data);
    return true;
}

// 新增与删除行的实现
function addItem(index: number) {
    form.items.splice(index + 1, 0, createDictItem());
}

function removeItem(index: number) {
    if (form.items.length <= 1) {
        Message.error('至少保留一行');
        return;
    }
    form.items.splice(index, 1);
}
</script>