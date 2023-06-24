<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.fontmanager']" />
    <div class="wrapper">
      <a-row :gutter="16">
        <a-col :span="3" style="text-align: center">
          <a-upload
            :action="ASSETS_HOST + '/services/font/add'"
            accept=".ttf,.fon"
            :show-file-list="false"
            @success="
              () => {
                Message.success('添加成功，请刷新页面。');
              }
            "
          />
        </a-col>
        <a-col :span="7">
          <a-form-item
            field="showContent"
            label="示例文章"
            label-col-flex="100px"
          >
            <a-select
              id="showContent"
              :default-value="contentIndex"
              @change="onContentChange"
            >
              <a-option
                v-for="(t, index) in demoContext"
                :key="t.name"
                :value="index"
                >{{ t.name }}</a-option
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item field="showSize" label="字体大小" label-col-flex="100px">
            <a-slider
              v-model:model-value="fontSize"
              :default-value="fontSize"
              :style="{ width: '100%' }"
              :min="10"
              :max="64"
            />
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item field="showSize" label="列数" label-col-flex="100px">
            <a-slider
              v-model:model-value="colNum"
              :default-value="4"
              :style="{ width: '100%' }"
              :min="1"
              :max="12"
              :marks="{ 2: '2', 4: '4', 6: '6', 8: '8', 10: '10', 12: '12' }"
              @change="ResetCol"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <div
        :style="{
          boxSizing: 'border-box',
          width: '100%',
          padding: '40px',
          backgroundColor: 'var(--color-fill-2)',
        }"
      >
        <a-row
          v-for="(item, index) in renderData"
          :key="index"
          :gutter="20"
          :style="{ marginBottom: '20px' }"
        >
          <a-col
            v-for="f in item"
            :key="f.name"
            :span="Math.floor(24 / item.length)"
          >
            <a-card
              :title="f.name"
              :bordered="false"
              :style="{ width: '100%' }"
            >
              <template #extra>
                <a-dropdown>
                  <a-button>更多</a-button>
                  <template #content>
                    <a-doption @click="onDeleteFont(f.fontFile)"
                      >删除字体</a-doption
                    >
                  </template>
                </a-dropdown>
              </template>
              <div
                :style="{ fontFamily: f.fontFamily, fontSize: fontSize + 'px' }"
                class="showContent"
              >
                <p
                  v-for="(p, pI) in demoContext[contentIndex]?.content.split(
                    '\n'
                  )"
                  :key="pI"
                  >{{ p }}</p
                >
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
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
  const fontSize = ref(24);
  const colNum = ref(4); // 列数
  const fontData: FontFace[] = []; // 默认的字体数据

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
    } catch (err: any) {
      Message.error(`删除失败：${err?.response?.data?.msg}`);
    }
  };

  async function Init() {
    const data = (await queryFontList()) as FontFace[];

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
        color:red;
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
  }

  // 切换文章
  const onContentChange = (value: any) => {
    contentIndex.value = value as number;
  };

  Init();
</script>

<style lang="less" scoped>
  .showContent p::before {
    content: '　　';
    /* 段落前缩进两格 */
  }
</style>
