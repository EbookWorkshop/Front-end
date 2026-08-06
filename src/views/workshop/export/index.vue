<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.export', 'menu.workshop.export.guide']" />
    <div class="wrapper">
      <div class="frame-bg">
        <div class="frame-body">
          <div class="frame-aside">
            <a-steps :current="current" direction="vertical">
              <a-step>选一本书</a-step>
              <a-step>选章节范围</a-step>
              <a-step>生成文件</a-step>
              <a-step>结果</a-step>
            </a-steps>
          </div>
          <div class="frame-main">
            <keep-alive>
              <a-form :model="form" ref="formRef" auto-label-width>
                <div v-if="current == 1" class="main-content">
                  <a-row>
                    <a-col :span="12">
                      <a-form-item label="选择书籍" field="bookId" :rules="[{ required: true, message: '需要先选择书籍' }]">
                        <SelectBook v-model="form.bookId" />
                      </a-form-item>
                      <a-form-item label="嵌入书名" v-if="isImgCover">
                        <a-switch v-model="form.isEmbedBookName" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <BookCover v-show="form.bookId ?? 0 > 0" :book-id="form.bookId" ref="captureCover"
                        style="margin:0 auto;" :show-embed-book-name="form.isEmbedBookName" @complete="onCaptureCover"
                        @click="onCaptureCover" />
                    </a-col>
                  </a-row>
                </div>
                <div v-if="current == 2" class="main-content">
                  <a-form-item label="导出范围" field="chapterScope" required>
                    <a-radio-group type="button" v-model="form.chapterScope" @change="getBookIndex">
                      <a-radio value="all">全部章节</a-radio>
                      <a-radio value="volume">指定卷</a-radio>
                      <a-radio value="range">指定范围</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <div v-if="form.chapterScope == 'volume'">
                    <a-form-item field="volumes" label="选择卷:"
                      :rules="[{ required: true, message: '至少要选择一个卷，若不想按卷导出，请在导出范围选其它方式。' }]">
                      <a-select v-model="form.volumes" :options="Volumes" multiple allow-search
                        :field-names="{ value: 'VolumeId', label: 'Title' }" :virtual-list-props="{ height: 200 }" />
                    </a-form-item>
                  </div>
                  <div v-if="form.chapterScope == 'range'">
                    <a-form-item field="cBegin" label="开始章节:"
                      :rules="[{ required: true, message: '按范围导出时，需要设置导出范围开始章节' }]">
                      <SelectChapter v-model="form.cBegin" :volume="Volumes" :chapters="Chapters" />
                    </a-form-item>
                    <a-form-item field="cEnd" label="结束章节:"
                      :rules="[{ required: true, message: '按范围导出时，需要设置导出范围结束章节' }]">
                      <SelectChapter v-model="form.cEnd" :volume="Volumes" :chapters="Chapters" :is-reverse="true" />
                    </a-form-item>
                  </div>
                </div>
                <div v-if="current == 3" class="main-content">
                  <a-row>
                    <a-col :span="7" :offset="5">
                      <a-form-item label="文件类型" required field="fileType">
                        <a-radio-group v-model="form.fileType">
                          <a-radio value="epub">EPUB</a-radio>
                          <a-radio value="pdf">PDF</a-radio>
                          <a-radio value="txt">TXT</a-radio>
                        </a-radio-group>
                      </a-form-item>
                      <a-form-item v-if="form.fileType == 'pdf'" label="选择字体">
                        <a-select v-model="form.fontFamily">
                          <a-option v-for="font in fontData" :key="font.name" :value="font.name">
                            {{ font.name }}
                          </a-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item v-if="form.fileType == 'epub'" label="紧凑排版">
                        <a-switch v-model="form.isCompact" />
                      </a-form-item>
                      <a-form-item label="嵌入章节标题">
                        <a-switch v-model="form.isEmbedTitle" />
                      </a-form-item>
                      <a-form-item label="段首强制缩进">
                        <a-switch v-model="form.isEnableIndent" />
                      </a-form-item>
                      <a-form-item label="发送到默认邮箱">
                        <a-switch v-model="form.isSendEmail" />
                      </a-form-item>
                      <a-form-item label="导出到库存">
                        <a-switch v-model="form.isExportToInventory" />
                      </a-form-item>

                    </a-col>
                    <a-col :span="6" :offset="2" style="max-height:400px;">
                      <img v-if="form.fileType !== 'txt'" :src="coverData"
                        style="scale:0.25;transform-origin: top left;margin:0 auto;" />
                    </a-col>
                  </a-row>

                  <a-table>
                    <a-tr><a-th>导出文件类型</a-th><a-th>优点</a-th><a-th>缺点</a-th></a-tr>
                    <a-tr>
                      <a-td>EPUB</a-td><a-td>
                        <ul>
                          <li>适用大多流行的阅读器设备</li>
                          <li>支持设置封面</li>
                          <li>在 Kindle 上可以设置显示的字体、字号大小</li>
                          <li>可以保存书籍的元数据（作者、出版社、ISBN等）</li>
                          <li>占用空间最少（对比其它格式）</li>
                          <li>丰富的在线转换工具可转为其它格式</li>
                          <li>带目录可以方便跳转（需要阅读设备支持）</li>
                        </ul>
                      </a-td>
                      <a-td>
                        <ul>
                          <li>不支持直接拷贝到Kindle查看（但可以借助亚马逊的 Send to Kindle 发到邮箱）</li>
                          <li>需要专用的阅读器查看</li>
                          <li>需要专用的工具编辑</li>
                        </ul>
                      </a-td>
                    </a-tr>
                    <a-tr>
                      <a-td>PDF</a-td>
                      <a-td>
                        <ul>
                          <li>可以预设显示的效果，排版、字体、字号等，能在不同设备、平台得到相似的效果</li>
                          <li>可直接复制到 Kindle 上</li>
                          <li>带目录可以方便跳转（需要阅读设备支持）</li>
                        </ul>
                      </a-td>
                      <a-td>
                        <ul>
                          <li>需要用专用的工具编辑，而且大多需要收费</li>
                          <li>内嵌了字体，文件体积偏大</li>
                        </ul>
                      </a-td>
                    </a-tr>
                    <a-tr>
                      <a-td>TXT</a-td>
                      <a-td>
                        <ul>
                          <li>方便编辑，进行二次修改、查看</li>
                          <li>在 Kindle 上可以设置显示的字体、字号大小</li>
                          <li>方便转换成其它格式</li>
                        </ul>
                      </a-td>
                      <a-td>
                        <ul>
                          <li>在 Kindle 上显示会有吞行问题——曾经遇到过不知道解决了没</li>
                        </ul>
                      </a-td>
                    </a-tr>
                  </a-table>
                </div>
                <div v-if="current == 4" class="main-content">
                  <a-result :status="resultData.result" :title="resultData.result == 'success' ? '导出成功' : '导出失败'">
                    <template #subtitle>
                      <div>{{ resultData.msg }}</div>
                    </template>
                    <template #extra v-if="resultData.url">
                      <a-button :href="resultData.url">下载文件</a-button>
                    </template>
                  </a-result>
                </div>
              </a-form>
            </keep-alive>
            <div class="main-bottom">
              <a-button :disabled="current === 1" @click="onPrev">
                <icon-left />
                上一步
              </a-button>
              <a-button v-if="current < 3" @click="onNext">
                下一步
                <icon-right />
              </a-button>
              <a-button v-if="current === 3" @click="onSubmit" status="success" :loading="saving">
                <icon-save />
                导 出
              </a-button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import type { FormInstance } from '@arco-design/web-vue';
import { useRoute } from 'vue-router';
import SelectBook from '@/components/select-book/index.vue'
import BookCover from '@/components/book-cover/index.vue';
import SelectChapter from '@/components/chapter/select.vue';

import { HeatABook } from '@/api/library'
import { queryBookById, createTXT, createPDF, createEPUB, type ICreateBookAPI } from '@/api/book';
import { queryFontList, } from '@/api/font';
import { getKindleInbox } from '@/api/system';
import { ApiResultCode } from '@/types/global'
import { getApiBaseUrl } from '@/utils/config';
import { captureElement } from '@/utils/screenshot';
import { messageService } from '@/services/messageService'

const ASSETS_HOST = getApiBaseUrl();
const route = useRoute();
const bookid = Number(route.params.bookid);

const saving = ref(false);
const formRef = ref<FormInstance>();
const form = ref({
  bookId: bookid || undefined as number | undefined,
  chapterScope: "all",
  chapterRange: '',
  fontFamily: '',
  isEnableIndent: true,
  volumes: [],
  cBegin: undefined as number | undefined,
  cEnd: undefined as number | undefined,
  fileType: "epub",
  isSendEmail: false,
  isCompact: false,
  isEmbedTitle: true,
  isEmbedBookName: false,
  isExportToInventory: false,
});
const current = ref(1);
const Chapters = ref<Array<any>>([]);
const Volumes = ref<Array<any>>([]);
let chapterBookId = -1;   // 记录当前获取的章节索引的书籍ID
let fontData: Array<any> = [];
const resultData = ref({} as any);
const captureCover = ref<InstanceType<typeof BookCover> | null>(null); // 截图的封面
const coverData = ref("");
const isImgCover = ref(false);

function getBookIndex() {
  if (!form.value.bookId || form.value.chapterScope == 'all' || chapterBookId == form.value.bookId) return;
  queryBookById(form.value.bookId).then(res => {
    if (res.code === ApiResultCode.Success) {
      chapterBookId = form.value.bookId ?? -1;
      Chapters.value = res.data.Index;
      Volumes.value = res.data.Volumes;
    }
  })
}

/**
 * 生成封面图片
 */
function onCaptureCover() {
  nextTick(() => {
    if (captureCover.value?.$el) {  // 使用$el访问组件根元素
      isImgCover.value = captureCover.value?.$el.querySelector("img") != null;//通过检查封面组件是否含img标签来判断是否为图片封面
      captureElement(captureCover.value.$el, { scale: 4 }).then(result => {
        coverData.value = result;
      }).catch(error => {
        messageService.addMessage({
          id: Date.now() * -1,
          type: "message",
          title: "生成封面失败，请点击封面图片重试",
          content: error?.message,
          time: new Date().toLocaleString(),
          avatar: "error",
          status: 0,
          error
        });
        coverData.value = "";
      });
    }
  })
}

const onPrev = () => {
  current.value = Math.max(1, current.value - 1);
};

const onNext = async () => {
  let result = await formRef.value?.validate();
  if (result) {
    return;
  }
  if (current.value == 2) {
    let result = await formRef.value?.validate();
    if (result) {
      return;
    }
    setDefaultSendMail();
  }

  current.value = Math.min(4, current.value + 1);
};

/**
 * 检查数据库是否配置了接收邮箱信息，若是则默认勾选发送邮箱
 */
function setDefaultSendMail() {
  getKindleInbox().then(res => {
    if (res.code === ApiResultCode.Success && res.data?.address) {
      form.value.isSendEmail = true;
    }
  })
}

//字体加载、切换部分
// let fontDataMap = new Map();
async function InitFont() {
  fontData = await queryFontList();
  // fontDataMap = new Map(fontData.map(t => [t.name, t]));
}
InitFont();


const onSubmit = () => {
  let chapterIds = [] as any;
  if (form.value.chapterScope == 'all') {
    chapterIds = null;
  } else if (form.value.chapterScope == 'volume') {

  } else {
    let isStart = false;
    for (let i = 0; i < Chapters.value.length; i++) {
      if (Chapters.value[i].IndexId == (form.value.cBegin ?? 0)) isStart = true;
      if (isStart) chapterIds.push(Chapters.value[i].IndexId);
      if (Chapters.value[i].IndexId == (form.value.cEnd ?? 0)) break;
    }
  };

  let CreateBookAPI: ICreateBookAPI | null = null;
  switch (form.value.fileType) {
    case "pdf":
      CreateBookAPI = createPDF;
      break;
    case "txt":
      CreateBookAPI = createTXT;
      break;
    case "epub":
      CreateBookAPI = createEPUB;
      break;
  }
  saving.value = true;

  let imageData = coverData.value?.startsWith("data:image/png;base64,") ? coverData.value.replace("data:image/png;base64,", "") : "";

  CreateBookAPI?.(form.value?.bookId ?? 0, form.value.volumes, chapterIds, form.value.isSendEmail, form.value.isExportToInventory, form.value.fontFamily, form.value.isEmbedTitle, form.value.isEmbedBookName, form.value.isEnableIndent, form.value.isCompact, imageData).then((res: any) => {
    saving.value = false;
    current.value = 4;
    if (res.code === ApiResultCode.Success) {
      resultData.value.result = 'success';
      resultData.value.url = `${ASSETS_HOST}/assets/download/${encodeURIComponent(res.data.download)}`

      if (form.value.isSendEmail) {
        resultData.value.msg = '已发送到您的邮箱';
      } else {
        resultData.value.msg = "正在准备下载..."
        window.open(resultData.value.url);
      }
    } else {
      resultData.value.result = 'error';
      resultData.value.msg = res.msg;
    }

    HeatABook(form.value.bookId ?? 0);
  }).catch((err: any) => {
    current.value = 4;
    saving.value = false;
    resultData.value.result = 'error';
    resultData.value.msg = err;
  });
}
</script>


<style scoped lang="less">
.frame-bg {
  padding: 40px;
  background: var(--color-fill-2);
}

.frame-body {
  display: flex;
  background: var(--color-bg-2);
}

.frame-aside {
  padding: 24px;
  min-height: 400px;
  border-right: 1px solid var(--color-border);
}

.frame-main {
  width: 100%;
  padding: 24px 24px;
  margin: 0px auto;
}

.main-content {
  margin-top: 40px;
  text-align: center;
  min-height: 220px;
  color: var(--color-text-2);
}

.main-bottom {
  display: flex;
  justify-content: center;

  button {
    margin: 0 20px;
  }
}
</style>
