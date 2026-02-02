<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.fontmanager']" />
    <div class="wrapper">
      <a-form :model="form">
        <a-row :gutter="16">
          <a-col :span="3">
            <a-form-item label="默认字体" label-col-flex="100px">
              <a-typography-text>{{ defaultFont }}</a-typography-text>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item field="showContent" label="示例文章" label-col-flex="100px">
              <a-select id="showContent" v-model="form.contentIndex as number" :default-value="form.contentIndex">
                <a-option v-for="(t, index) in demoContext" :key="t.name" :value="index">{{ t.name }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item field="showSize" label="字体大小" label-col-flex="100px">
              <a-slider v-model="form.fontSize as number" :default-value="form.fontSize" :style="{ width: '100%' }"
                :min="10" :max="64" />
            </a-form-item>
          </a-col>
          <a-col v-if="activeViewModel == 'web'" :span="6">
            <a-form-item field="showSize" label="列数" label-col-flex="100px">
              <a-slider v-model="form.colNum as number" :default-value="4" :style="{ width: '100%' }" :min="1" :max="12"
                :marks="{ 2: '2', 4: '4', 6: '6', 8: '8', 10: '10', 12: '12' }" @change="ResetCol" />
            </a-form-item>
          </a-col>
          <a-col v-else-if="activeViewModel == 'pdf'" :span="6">
            <a-form-item field="showFont" label="字体" label-col-flex="100px">
              <a-select id="showFont" v-model="form.font as string" :default-value="fontData[0]?.name" allow-search>
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
      </a-form>
      <a-tabs default-active-key="web" type="card-gutter" lazy-load v-model:activeKey="activeViewModel">
        <a-tab-pane key="web" title="在网页预览">
          <div :style="{
            boxSizing: 'border-box',
            width: '100%',
            padding: '40px',
            backgroundColor: 'var(--color-fill-2)',
          }">
            <a-row v-for="(item, index) in renderData" :key="index" :gutter="20" :style="{ marginBottom: '20px' }">
              <a-col v-for="f in item" :key="f.name" :span="Math.floor(24 / item.length)">
                <a-card :title="`${f.name} - (${formatFileSize(f.size)})`" :bordered="false" :style="{ width: '100%' }" :class="`${f.loadError?`loadError`:``}`">
                  <template #extra>
                    <a-dropdown>
                      <a-button type="dashed" :status="f.loadError?'danger':'normal'">更多</a-button>
                      <template #content>
                        <a-doption
                          @click="setDefaultReadingFont(f.name).then((rsl: any) => defaultFont = rsl.data.Value)">设置为默认阅读字体</a-doption>
                        <a-doption v-if="!f.loadError"
                          @click="setUIFont(f.name).then((rsl: any) => Message.success('设置成功，请刷新页面。'))">设置为UI字体</a-doption>
                        <a-popover title="修改字体名" popup-container="body" trigger="click" position="bottom">
                          <a-button type="text" long>修改字体名</a-button>
                          <template #content>
                            <a-input :default-value="f.name" v-model="newFontName" placeholder="请输入新的字体显示名"
                              style="width: 200px;" />
                            <a-button type="primary" style="margin-top: 10px;"
                              @click="onFontRename(f.fontFile, newFontName)">确认改名</a-button>
                          </template>
                        </a-popover>
                        <a-doption @click="viewOnPDF(f)">在PDF中预览</a-doption>
                        <a-popconfirm content="确认删除？此操作将无法恢复！" @ok="onDeleteFont(f.fontFile)">
                          <a-button status="danger" long>删除字体</a-button>
                        </a-popconfirm>
                      </template>
                    </a-dropdown>
                  </template>
                  <div class="showContent"
                    :style="{ fontFamily: f.fontFamily, fontSize: `${form.fontSize}px`}" >
                    <a-typography-title :heading="4">{{ demoContext[form.contentIndex]?.name }}</a-typography-title>
                    <a-typography-paragraph v-for="(p, pI) in demoContext[form.contentIndex]?.content.split('\n')" :key="pI">{{ p
                    }}</a-typography-paragraph>
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
                <iframe :ref="pdfFrame" width="1072" height="1448" :src="`${ASSETS_HOST}/services/pdf/view?content=${encodeURIComponent(
                  demoContext[form.contentIndex]?.content
                )}&fontsize=${form.fontSize}&fontfamily=${form.font}`"></iframe>
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
  renameFont,
  getDefaultReadingFont,
  setDefaultReadingFont,
  setUIFont,
  ASSETS_HOST,
} from '@/api/font';
import { Message } from '@arco-design/web-vue';
import { formatFileSize } from '@/utils/units'

interface FontFace {
  /**显示名 */
  name: string;
  path: string;
  /**css的字体名 */
  fontFamily: string;
  size: number;
  /**文件名 */
  fontFile: string;
  loadError: boolean;
}
const form = reactive({
  defaultFont: '',
  contentIndex: 0,
  fontSize: 24,
  colNum: 4,
  font: '',
});
const demoContext: Array<ContentType> = reactive([]);
const renderData: FontFace[][] = reactive([]);
const fontData: FontFace[] = []; // 默认的字体数据
const defaultFont = ref("无");//默认字体
const pdfFrame = ref(null) as any;
const newFontName = ref('');
const activeViewModel = ref('web'); // 激活的预览模式

getDefaultReadingFont().then(rsl => {
  defaultFont.value = rsl.data;
  form.font = rsl.data;
});

// 重新设置列数
const ResetCol = () => {
  const data = fontData.concat();
  renderData.length = 0;
  do {
    renderData.push([...data.splice(0, form.colNum)]);
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

/**
 * 修改字体显示名
 * @param fontName 字体文件名
 * @param newFontName 新的字体显示名
 */
const onFontRename = (fontName: string, newFontName: string) => {
  renameFont(fontName, newFontName).then(() => {
    Message.success('修改成功！');
    Init();
  }).catch((err: any) => {
    Message.error(`修改失败：${err?.response?.data?.msg}`);
  });
}

async function Init() {
  const data = (await queryFontList()) as FontFace[];
  fontData.length = 0;
  // 初始化到CSS
  // let fontFace = '';
  let i = 0;
  data.forEach((f) => {
    i += 1;
    f.fontFamily = `font_${i}`;
    let ff = new FontFace(`font_${i}`, `url('${f.path}')`);
    ff.load().then((loadFont) => {
      (document.fonts as any).add(loadFont);
      f.loadError = false;
    }).catch((err) => {
      f.loadError = true;
      ResetCol();
    })
  });

  fontData.push(...data);
  ResetCol();
  const c = await queryDemoContent();
  demoContext.push(...c.data);

  form.contentIndex = Math.floor(Math.random() * 1000) % demoContext.length;
}

function viewOnPDF(f: FontFace) {
  activeViewModel.value = 'pdf';
  form.font = f.name;
}

Init();
</script>

<style lang="less" scoped>
.showContent  {
  h4{
    text-align: center;
  }
  div::before {
    content: '　　';
    /* 段落前缩进两格 */
  }
}
.loadError {
  background-color: rgb(var(--red-1));
}
</style>
