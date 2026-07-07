<template>
    <div>
        <a-divider orientation="center">自动任务</a-divider>
        <SettingForm :form="settingData" :value="value" @update="save">
            <template #runInterval v-if="value.autowork">
                <a-input-group>
                    <a-input-number v-model="value.intervalData" @change="save('runInterval')" />
                    <a-select v-model="value.intervalUnit" :options="['秒', '分钟', '小时', '天']" :style="{ width: '160px' }"
                        @change="nexUpdate" />
                </a-input-group>
            </template>
        </SettingForm>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import SettingForm from './settingform.vue'
import type { SettingFormType } from './types'
import { getAutoWrokSetting, saveAutoWrokSetting } from '@/api/system'
const HOUR_MS = 360_0000;

const settingData: SettingFormType[] = [{
    dataId: 'autowork',
    title: '开启自动任务',
    controlType: 'switch',
}, {
    dataId: "runInterval",
    title: "执行间隔",
    controlType: "VNode",
    isHide: false,
}]

const value = reactive({
    autowork: false,
    intervalUnit: "",
    intervalData: 0,
});

getAutoWrokSetting().then(res => {
    let { runInterval } = res.data;
    runInterval *= 1;
    if (runInterval > 0) value.autowork = true;
    if (runInterval >= HOUR_MS * 24) {
        value.intervalUnit = "天";
        value.intervalData = runInterval / (HOUR_MS * 24);
    } else if (runInterval >= HOUR_MS) {
        value.intervalUnit = "小时";
        value.intervalData = runInterval / HOUR_MS;
    } else if (runInterval >= 60000) {
        value.intervalUnit = "分钟";
        value.intervalData = runInterval / 60000;
    } else {
        value.intervalUnit = "秒";
        value.intervalData = runInterval / 1000;
    }

    updateSwitch();
})

function getRunIntervalMS() {
    let newValue = 0;
    switch (value.intervalUnit) {
        case "天": newValue = value.intervalData * HOUR_MS * 24; break;
        case "小时": newValue = value.intervalData * HOUR_MS; break;
        case "分钟": newValue = value.intervalData * 60000; break;
        case "秒": newValue = value.intervalData * 1000; break;
    }
    return newValue;
}

function save(dataId: string) {
    let newValue = (value as any)[dataId];
    let setting = {
        runInterval: getRunIntervalMS(),
    };

    if (dataId === "autowork" && newValue === false) {
        setting.runInterval = -1;
    }

    saveAutoWrokSetting(setting).then(() => {
        // 成功提示
    }).catch(() => {
        // 失败提示
        (value as any)[dataId] = !newValue;
    });

    updateSwitch();
}

function updateSwitch() {
    let item = settingData.filter(item => item.dataId === "runInterval")
    item[0].isHide = value.autowork;
}
function nexUpdate() {
    setTimeout(() => updateSwitch, 2000)
}
</script>