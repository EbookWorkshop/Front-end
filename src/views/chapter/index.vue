<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list',renderData.Book?.BookName, renderData.Title]" />
    <div class="wrapper" :style="{ backgroundColor: bgColor }">
      <!-- loading用的骨架页 -->
      <a-row v-if="loading" :gutter="[0, 32]">
        <a-col :span="6" :offset="9">
          <a-skeleton :animation="true">
            <a-skeleton-line :rows="1" :line-height="42" :line-spacing="10" />
          </a-skeleton>
        </a-col>
        <a-col></a-col>
      </a-row>
      <a-row v-if="loading" :gutter="160">
        <a-col :span="20" :offset="2">
          <a-skeleton :animation="true">
            <a-skeleton-line :rows="20" :line-height="24" :line-spacing="10" />
          </a-skeleton>
        </a-col>
      </a-row>

      <a-row class="grid-chapter" :gutter="[0, 120]">
        <a-col v-if="!pdfModel" :span="20" class="content" :offset="2" >
          <a-typography :style="{ marginTop: '-40px', color: ftColor }">
            <a-typography-title class="title">{{ renderData.Title }}
            </a-typography-title>
            <a-typography-paragraph v-for="(p, index) in renderData.Content?.split('\n')" :key="index"
              :style="{ color: ftColor, fontSize: ftSize + 'px', fontFamily: 'MyCustomFont' }">
              {{ p }}
            </a-typography-paragraph>
          </a-typography>
        </a-col>
        <a-col v-else :span="24" style="text-align: center">
          <iframe class="pdfFrame" width="1072" height="1448" style="border:0px"
            :src="`${ASSETS_HOST}/services/pdf/view?chapterId=${chapterId}&fontsize=${ftSize}&fontfamily=${ftFamily}`"></iframe>
        </a-col>
      </a-row>

      <a-row :gutter="[8, 120]" class="toolbar">
        <a-col :span="2" :offset="9"><a-button long :disabled="!adjChap.pre"
            @click="gotoChapter(adjChap?.pre?.id)">上一章</a-button></a-col>
        <a-col :span="2"><a-button long @click="gotoIndex">目录</a-button></a-col>
        <a-col :span="2"><a-button long :disabled="!adjChap.next"
            @click="gotoChapter(adjChap?.next?.id)">下一章</a-button></a-col>
      </a-row>
      <ToolMenu @toggle-pdf-model="togglePDF" @change-font-color="ftChange" @change-font-size="ftSizeChange"
        @change-font-family="ftFamilyChange" @change-bg-color="bgChange"></ToolMenu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Chapter } from '@/types/book';
import {
  queryChapterById,
  queryAdjacentChapterInfo,
} from '@/api/book';
import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

import ToolMenu from './components/toolmenu.vue'

const ASSETS_HOST = import.meta.env.VITE_API_BASE_URL;

//变量
const pdfModel = ref(false);//在PDF模式查看
const ftColor = ref("var(--color-neutral-8)");
const ftSize = ref(20);
const ftFamily = ref("");
const bgColor = ref("var(--color-bg-2)");
const { chapterId, gotoChapter, gotoIndex } = useBookHelper();
const { loading, response: renderData } = useRequest<Chapter>(
  queryChapterById.bind(null, chapterId)
);
const { response: adjChap } = useRequest<any>(
  queryAdjacentChapterInfo.bind(null, chapterId)
);



function ftFamilyChange(fontFamily: any) {
  if (!fontFamily) return;
  ftFamily.value = fontFamily.path;

  let fontStyle = document.getElementById("fontStyle");
  if (!fontStyle) {
    fontStyle = document.createElement('style');
    fontStyle.setAttribute("id", "fontStyle");
    document.head.appendChild(fontStyle);
  }
  fontStyle.textContent = `
    @font-face {
      font-family: 'MyCustomFont';
      src: url('${ftFamily.value}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;

}
function ftChange(color: string) { ftColor.value = color; }
function ftSizeChange(size: number) { ftSize.value = size; }
function bgChange(color: string) { bgColor.value = color; }
function togglePDF() { pdfModel.value = !pdfModel.value; }

</script>

<style>
.title {
  color: var(--color-neutral-10);
  text-align: center;
}

.content {
  color: var(--color-neutral-10);
  font-size: var(--font-size-body-3);
}
.toolbar{
  margin-top: 48px;
}

.pdfFrame{
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}
</style>
