<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.fontmanager']" />
    <div class="wrapper">
      <a-row :gutter="16">
        <a-col :span="3">
          <a-form-item label="默认字体"><a-typography-text>{{ defaultFont }}</a-typography-text></a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="showContent" label="示例文章" label-col-flex="100px">
            <a-select id="showContent" v-model="contentIndex as number" :default-value="contentIndex">
              <a-option v-for="(t, index) in demoContext" :key="t.name" :value="index">{{ t.name }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="showSize" label="字体大小" label-col-flex="100px">
            <a-slider v-model:model-value="fontSize as number" :default-value="fontSize" :style="{ width: '100%' }"
              :min="10" :max="64" />
          </a-form-item>
        </a-col>
        <a-col v-if="viewModel == 'web'" :span="6">
          <a-form-item field="showSize" label="列数" label-col-flex="100px">
            <a-slider v-model:model-value="colNum as number" :default-value="4" :style="{ width: '100%' }" :min="1"
              :max="12" :marks="{ 2: '2', 4: '4', 6: '6', 8: '8', 10: '10', 12: '12' }" @change="ResetCol" />
          </a-form-item>
        </a-col>
        <a-col v-else-if="viewModel == 'pdf'" :span="6">
          <a-form-item field="showFont" label="字体" label-col-flex="100px">
            <a-select id="showFont" v-model="font as string" :default-value="fontData[0]?.name" allow-search>
              <a-option v-for="t in fontData" :key="t.name" :value="t.name">{{
                t.name
              }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="3" style="text-align: center">
          <a-upload :action="ASSETS_HOST + '/services/font/add'" accept=".ttf,.fon,.otf,.woff,.woff2" :multiple="true"
            :show-file-list="false" @success="() => {
              Message.success('添加成功。');
              Init();
            }
            " />
        </a-col>
      </a-row>

      <a-tabs default-active-key="web" type="card-gutter" lazy-load @change="(type: any) => (viewModel = type)">
        <a-tab-pane key="web" title="在网页预览">
          <div :style="{
            boxSizing: 'border-box',
            width: '100%',
            padding: '40px',
            backgroundColor: 'var(--color-fill-2)',
          }">
            <a-row v-for="(item, index) in renderData" :key="index" :gutter="20" :style="{ marginBottom: '20px' }">
              <a-col v-for="f in item" :key="f.name" :span="Math.floor(24 / item.length)">
                <a-card :title="f.name" :bordered="false" :style="{ width: '100%' }">
                  <template #extra>
                    <a-dropdown>
                      <a-button>更多</a-button>
                      <template #content>
                        <a-doption
                          @click="setDefaultFont(f.name).then((rsl: any) => defaultFont = rsl.data.Value)">设置为默认字体</a-doption>
                        <a-popconfirm content="确认删除？此操作将无法恢复！" @ok="onDeleteFont(f.fontFile)">
                          <a-button status="danger" long>删除字体</a-button>
                        </a-popconfirm>
                      </template>
                    </a-dropdown>
                  </template>
                  <div :style="{ fontFamily: f.fontFamily, fontSize: fontSize + 'px' }" class="showContent">
                    <p v-for="(p, pI) in demoContext[contentIndex]?.content.split(
                      '\n'
                    )" :key="pI">{{ p }}</p>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
        <a-tab-pane key="pdf" title="在PDF预览">
          <div :style="{
            boxSizing: 'border-box',
            width: '100%',
            padding: '40px',
            backgroundColor: 'var(--color-fill-2)',
          }">
            <a-row>
              <a-col :span="24" style="text-align: center">
                <iframe :ref="pdfFrame" width="1072" height="1448" :src="ASSETS_HOST +
                  `/services/pdf/view?content=${encodeURIComponent(
                    demoContext[contentIndex]?.content
                  )}&fontsize=${fontSize}&fontfamily=${font ?? fontData[0].name}`
                  "></iframe>
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
      </a-tabs>


    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import {
  ContentType,
  queryFontList,
  queryDemoContent,
  deleteFont,
  getDefaultFont,
  setDefaultFont,
  ASSETS_HOST,
} from '@/api/font';
import { Message } from '@arco-design/web-vue';

interface FontFace {
  name: string;
  path: string;
  fontFamily: string;
  fontFile: string;
}

const demoContext: Array<ContentType> = reactive([]);
const renderData: FontFace[][] = reactive([]);
const contentIndex = ref(0);
const fontSize = ref<number>(24);
const colNum = ref(4); // 列数
const fontData: FontFace[] = []; // 默认的字体数据
const font = ref(fontData[0]?.name); // 当前预览字体
const defaultFont = ref("无");//默认字体
const pdfFrame = ref(null) as any;

const viewModel = ref('web'); // 预览模式

getDefaultFont().then(rsl => defaultFont.value = rsl.data);

// 重新设置列数
const ResetCol = () => {
  const data = fontData.concat();
  renderData.length = 0;
  do {
    renderData.push([...data.splice(0, colNum.value)]);
  } while (data.length > 0);
};

const onDeleteFont = async (fontName: any) => {
  try {
    await deleteFont(fontName);
    Message.success('删除成功！');
    Init();
  } catch (err: any) {
    Message.error(`删除失败：${err?.response?.data?.msg}`);
  }
};

async function Init() {
  const data = (await queryFontList()) as FontFace[];
  fontData.length = 0;
  // 初始化到CSS
  let fontFace = '';
  let i = 0;
  data.forEach((f) => {
    i += 1;
    f.fontFamily = `font_${i}`;
    fontFace += `
      @font-face {
        font-family: '${f.fontFamily}';
        src: url('${f.path}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
  });

  const styleTag = document.createElement('style');
  styleTag.textContent = fontFace;
  document.head.appendChild(styleTag);

  fontData.push(...data);
  ResetCol();
  const c = await queryDemoContent();
  demoContext.push(...c.data);

  contentIndex.value = Math.floor(Math.random() * 1000) % demoContext.length;
}

// // 切换文章
// const onContentChange = (value: any) => {
//   contentIndex.value = value as number;
// };

Init();
</script>

<style lang="less" scoped>
.showContent p::before {
  content: '　　';
  /* 段落前缩进两格 */
}
</style>
