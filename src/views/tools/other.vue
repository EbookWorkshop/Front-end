<template>
    <div class="container">
        <Breadcrumb :items="['menu.tools', 'menu.tools.other']" />
        <div class="wrapper">
            <div :style="{
                boxSizing: 'border-box',
                width: '100%',
                padding: '40px',
                backgroundColor: 'var(--color-fill-2)',
            }">
                <a-row :gutter="[0, { xs: 0, sm: 20 }]" :style="{ marginBottom: '20px' }">
                    <a-col :span="6" v-for="(item, index) in OtherTools" :key="index" :xs="24" :lg="12" :xxl="6">
                        <a :href="easyDecrypt(item.url, EKEY)" target="_blank">
                            <a-card hoverable :style="{ width: '90%' ,maxWidth: '360px'}">
                                <template #cover>
                                    <div :style="{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '204px',
                                        overflow: 'hidden',
                                        padding: '20px',
                                        backgroundColor: item.backgroundColor,
                                    }">
                                        <img class="banner" :alt="item.name" :src="easyDecrypt(item.icon, EKEY)" />
                                    </div>
                                </template>
                                <a-card-meta :title="item.name">
                                    <template #description>
                                        {{ item.description }}
                                    </template>
                                </a-card-meta>
                            </a-card>
                        </a>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { OtherTools, EKEY } from './data';
import { easyEncrypt, easyDecrypt } from "@/utils/crypto";

// let api = easyDecrypt;
// let temp = [];
// for (let i = 0; i < OtherTools.length; i++) {
//     temp.push(OtherTools[i]);
//     temp[i].icon = api(OtherTools[i].icon, EKEY);
//     temp[i].url = api(OtherTools[i].url, EKEY);
// }
// console.log(JSON.stringify(temp, null, 2));

// console.log(easyEncrypt("aaaaaaaaaa", EKEY));

</script>

<style lang="less" scoped>
.banner {
    width: 100%;
}
</style>