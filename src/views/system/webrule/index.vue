<template>
  <div ref="containerRef" class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.webrule']" />
    <div class="wrapper">
      <a-spin dot :loading="dataLoading">
        <a-form ref="formRef" :model="form" @submit="Submit">
          <a-row>
            <a-col :span="20" :offset="2">
              <a-space>
                <a-button type="primary" @click="resetForm">新增新方案</a-button>
                <a-button type="primary" @click="showWebList">编辑现有方案</a-button>
                <a-button type="primary" @click="CheckSiteAccessibility">检查站点存活情况</a-button>
                <a-affix :offset-top="8">
                  <a-button type="primary" status="success" html-type="submit"
                    :disabled="form.hostname.length == 0">保存当前方案</a-button>
                </a-affix>
                <a-popconfirm content="你确定要删除当前站点配置？这将无法恢复。" type="warning" @ok="DeleteIt">
                  <a-button type="primary" status="danger" :disabled="form.hostname.length == 0">删除当前方案</a-button>
                </a-popconfirm>
                <a-button-group>
                  <a-button type="primary" @click="exportScheme"
                    :disabled="form.hostname.length == 0">导出当前方案（json）</a-button>
                  <a-upload :action="ASSETS_HOST + '/services/botrule/import'" :show-file-list="false" :accept="'.json'"
                    name="data" @success="importScheme">
                    <template #upload-button>
                      <a-button type="primary">导入方案（json）</a-button>
                    </template>
                  </a-upload>
                </a-button-group>
                <a-button :status="isUseVisStatus" @click="toggleFormUrl4Vis">
                  <template #icon><icon-eye /></template>
                  <template #default>启用预览辅助配置模式</template>
                </a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-row style="margin-top: 50px">
            <a-col :span="20">
              <!--方案表单 -->
              <a-space direction="vertical" size="large" :style="{ width: '100%' }">
                <a-form-item field="hostname" label="网站域名" :rules="[{ required: true, message: '网站名为必填' }]"
                  :validate-trigger="['change', 'input']">
                  <a-input-search v-model="form.hostname" placeholder="网站域名（域名，如：book.xiaoshuo.com）" search-button
                    @blur="FormatHost">
                    <template #button-icon>
                      <a-tooltip content="打开当前网站">
                        <icon-launch @click="CheckThisWeb" />
                      </a-tooltip>
                    </template>
                  </a-input-search>
                </a-form-item>
                <a-form-item field="rulename" label="添加规则" :rules="[{ required: true, message: '至少得有一个规则' }]"
                  :validate-trigger="['change', 'input']">
                  <a-select v-model="form.rulename" placeholder="选择需要启用的规则" multiple :options="rulesOptions"
                    @change="changeRuleNamelist">
                  </a-select>
                </a-form-item>
                <a-form-item v-for="(rule, index) of form.rules" :key="index" :field="`rules.${index}.ruleShowName`"
                  :label="rule.ruleShowName">
                  <a-space direction="vertical" fill style="width: 100%">
                    <a-divider />
                    <input v-model="rule.ruleName" type="hidden" />
                    <a-form-item label="选择器" :field="`rules.${index}.selector`" :rules="[
                      {
                        required: true,
                        message: '选择器为必填，用于命中操作元素。',
                      },
                    ]" :validate-trigger="['change', 'input']">
                      <a-input v-model="rule.selector" placeholder="CSS选择器" />
                    </a-form-item>
                    <a-form-item label="删除的元素" :field="`rules.${index}.removeSelector`">
                      <a-select v-model="rule.removeSelector" placeholder="通过CSS选择器匹配，命中的元素会从DOM中删除。用于去广告/按钮。" multiple
                        allow-create>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="获取内容" :field="`rules.${index}.getContentAction`">
                      <SelectAction v-model="rule.getContentAction" />
                    </a-form-item>
                    <a-form-item v-if="[`ChapterList`, `IndexNextPage`, `ContentNextPage`].includes(rule.ruleName)"
                      label="获取链接" :field="`rules.${index}.getUrlAction`">
                      <SelectAction v-model="rule.getUrlAction" />
                    </a-form-item>
                    <a-form-item label="内容类型" :field="`rules.${index}.type`"
                      tooltip="部分规则即使配置了多个目标也不生效的，如‘书名’、‘标题’、‘正文’等">
                      <a-radio-group v-model="rule.type" type="button">
                        <a-radio value="Object">一次一个目标（独立元素）</a-radio>
                        <a-radio value="List">一次多个目标（列表型）</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="命中匹配校验" :field="`rules.${index}.checkSetting`"
                      tooltip="注意：当需要使用命中匹配时，内容类型要选【一次多个目标】">
                      <a-input v-model="rule.checkSetting" placeholder="判断是否命中的文本。如相同的选择器，只匹配‘下一页’不匹配‘下一章’" />
                    </a-form-item>
                    <a-button v-if="isUseVisModel" status="warning" @click="VisRuleSetting(rule)">预览规则：{{
                      rule.ruleShowName
                    }}</a-button>
                  </a-space>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" status="success" html-type="submit">{{
                    $t('system.form.save')
                  }}</a-button>
                </a-form-item>
              </a-space>
            </a-col>
          </a-row>
        </a-form>
        <a-modal v-model:visible="formUrlForVisVisible" title="首先：请提供两个网址用于辅助预览" @ok="onSetVisUrl">
          <a-form :model="formUrlForVis" layout="vertical">
            <a-form-item field="indexUrl" label="图书章节目录页网址:">
              <a-input v-model="formUrlForVis.indexUrl" />
            </a-form-item>
            <a-form-item field="contentUrl" label="图书正文阅读页网址:">
              <a-input v-model="formUrlForVis.contentUrl" />
            </a-form-item>
          </a-form>
        </a-modal>
        <a-modal v-model:visible="isTableModalVisible" title="站点存活情况检查结果">
          <a-table :data="siteAccessibilityData">
            <template #columns>
              <a-table-column title="站点" data-index="hostName"></a-table-column>
              <a-table-column title="返回状态" data-index="statusCode"></a-table-column>
              <a-table-column title="是否可访问">
                <template #cell="{ record }">
                  <a-spin v-if="record.siteAccessibility === '检查中'" />
                  <a-alert v-else :type="record.siteAccessibility === '成功' ? 'success' : 'error'"></a-alert>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-modal>
      </a-spin>
    </div>
    <WebList ref="myWebList" @set-form="setFormWithSetting"></WebList>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue';
import { ApiResultCode } from '@/types/global';
import { checkSiteAccessibility } from '@/api/system';
import {
  queryHostList,
  saveHostSetting,
  deleteHostSetting,
  visRuleSetting,
  exportSecheme,
  ASSETS_HOST
} from '@/api/webbot';
import { FileItem, Message, Spin } from '@arco-design/web-vue';
import WebList from './components/web-list.vue';
import { rulesOptions } from './data';  // 规则类型选项
import useRequest from '@/hooks/request';

import SelectAction from './components/SelectAction.vue';


const formUrlForVisVisible = ref(false); // 配置弹窗是否显示
const formUrlForVis = reactive({ indexUrl: '', contentUrl: '' }); // 弹窗表单——辅助预览的网址采集表单
const isUseVisModel = ref(false);
const isUseVisStatus = computed(() =>
  isUseVisModel.value ? 'warning' : 'normal'
);
const dataLoading = ref(false);
const isTableModalVisible = ref(false);


// 绑定数据的规则配置表单
const form = reactive({
  hostname: '',
  rulename: ['BookName'], // ,"ChapterList","Content"],
  rules: [
    {
      ruleShowName: '目录-书名',
      ruleName: 'BookName',
      selector: '',
      type: 'Object',
      checkSetting: '',
      getContentAction: 'attr/',
      getUrlAction: '',
      removeSelector: [],
    },
  ],
});

// 展开右边网站列表
const myWebList = ref(WebList);
const showWebList = () => {
  myWebList.value.show();
};

const siteAccessibilityData = ref<any[]>([]);      // 站点存活情况数据

/**
 * 根据规则值-找到对应的规则显示名称
 * @param type 规则值
 */
function findOptionName(type: string) {
  let txt = '';
  rulesOptions.filter((x) => {
    const t = x.options.filter((y) => y.value === type);
    if (t.length > 0) txt = t[0].label;
    return false;
  });
  return txt;
}

// 按选好的内容设置表单——加载已知网站配置
const setFormWithSetting = (setting: any) => {
  if (setting.length === 0) return;

  form.hostname = setting[0].host;
  form.rulename = [];
  const temform: any[] = [];
  setting.map((item: any) => {
    form.rulename.push(item.ruleName);
    temform.push({
      ruleShowName: findOptionName(item.ruleName),
      ruleName: item.ruleName,
      selector: item.selector,
      type: item.type,
      checkSetting: item.checkSetting,
      getContentAction: item.getContentAction,
      getUrlAction: item.getUrlAction,
      removeSelector: item.removeSelector,
    });
    return 0;
  });
  form.rules = temform;
};

/**
 * 切换规则名时，过滤并查找当前规则，进行添加或删除
 * @param result 已选中的规则值-数组
 */
function changeRuleNamelist(result: string[] | any) {
  const optionSet = new Set(result);

  // 找到取消
  const inter = form.rules.filter((item) => !optionSet.has(item.ruleName));
  // 找到新增
  const getnew = result.filter(
    (item: string) => !form.rules.find((x) => x.ruleName === item)
  );
  // 删除不存在的
  inter.map((item: any) => {
    const index = form.rules.indexOf(item);
    if (index >= 0) form.rules.splice(index, 1);
    return 0;
  });
  // 插入新增的
  getnew.map((type: string) => {
    form.rules.push({
      ruleShowName: findOptionName(type),
      ruleName: type,
      selector: '',
      type: 'Object',
      checkSetting: '',
      getContentAction: 'attr/',
      getUrlAction: '',
      removeSelector: [],
    });
    return type;
  });
}
/**
 * 重置表单
 */
function resetForm() {
  form.hostname = '';
  form.rulename = ['BookName', 'ChapterList', 'Content'];
  form.rules = [];
  changeRuleNamelist(form.rulename);
}
//初始化表单
resetForm();

/**
 * 打开检查网站——看看网站是不是挂了
 */
function CheckThisWeb() {
  if (form.hostname.length > 0) window.open(`//${form.hostname}`);
}

/**
 * 保存
 * @param param0
 */
function Submit({ values, errors }: any) {
  if (errors) {
    Message.error('请先填写完表单，不需要的规则请删除。');
    return;
  }
  const myRule: any[] = [];

  values.rules.map((item: any) => {
    myRule.push({ host: values.hostname, ...item });
    return 0;
  });

  dataLoading.value = true;
  saveHostSetting(myRule)
    .then(() => {
      Message.success(`保存成功！`);
    })
    .catch((err) => {
      Message.error(`保存失败：${err.message}`);
    })
    .finally(() => {
      dataLoading.value = false;
    });
}
function DeleteIt() {
  if (form.hostname.length === 0) {
    Message.warning('网站名为空，不能删除配置。');
    return;
  }

  dataLoading.value = true;
  deleteHostSetting(form.hostname)
    .then(() => {
      Message.success(`删除成功！`);
    })
    .catch((err) => {
      Message.error(`删除失败：${err.message}`);
    })
    .finally(() => {
      dataLoading.value = false;
    });
}

// 切换预览地址设置窗口是否可见
const toggleFormUrl4Vis = () => {
  isUseVisModel.value = !isUseVisModel.value;
  if (isUseVisModel.value)
    formUrlForVisVisible.value = !formUrlForVisVisible.value;
};

function onSetVisUrl() {
  let visUrl = new URL(formUrlForVis.indexUrl);
  form.hostname = visUrl.hostname;
}

/**
 * 检查站点存活情况
 */
async function CheckSiteAccessibility() {
  isTableModalVisible.value = true;
  const { response: hostList } = useRequest<string[]>(queryHostList);
  watch(hostList, (newVal /*, oldVal*/) => {
    siteAccessibilityData.value = [];
    for (const host of newVal) {
      siteAccessibilityData.value.push({
        hostName: host,
        siteAccessibility: '检查中',
        statusCode: '',
      });

      checkSiteAccessibility(host)
        .then((res: any) => {
          let isOK = res.data;
          const index = siteAccessibilityData.value.findIndex(
            (item) => item.hostName === host
          );
          siteAccessibilityData.value[index].siteAccessibility = isOK ? '成功' : '失败';
          siteAccessibilityData.value[index].statusCode = res.status;

        })
        .catch((err) => {
          const index = siteAccessibilityData.value.findIndex(
            (item) => item.hostName === host
          );
          siteAccessibilityData.value[index].siteAccessibility = '失败';
          console.log(err);
        });
    }
  });

}

/**
 * 点击预览规则按钮
 */
function VisRuleSetting(rule: any) {
  let url = '';
  switch (rule.ruleName) {
    case 'BookCover':
    case 'BookName':
    case 'ChapterList':
    case 'IndexNextPage':
      url = formUrlForVis.indexUrl;
      break;
    case 'CapterTitle':
    case 'Content':
    case 'ContentNextPage':
      url = formUrlForVis.contentUrl;
      break;
    default:
      break;
  }
  visRuleSetting(url, rule).then((data) => {
    console.log(data); // TODO：结果可视化，前端显示
  });
}

/**
 * 导出按钮点击
 */
function exportScheme() {
  if (form.hostname === '') {
    Message.error('请先选择方案！');
    return;
  }
  // exportSecheme(form.hostname)
  // .then(()=>Message.success("导出成功"))
  // .catch((err)=>Message.error("导出失败"+err));
  window.open(exportSecheme(form.hostname));
}
/**
 * 导入按钮点击
 */
function importScheme(fileItem: FileItem) {
  if (fileItem.response.code === ApiResultCode.Success) {
    Message.success(fileItem.response.msg);
    setFormWithSetting(fileItem.response.data);
  } else {
    Message.error(fileItem.response.msg);
  }

}
function FormatHost() {
  let host = new URL(form.hostname);
  if (host != null && host.hostname != form.hostname) form.hostname = host.hostname;
}
</script>

<style>
.container {
  height: 90vh;
  overflow: auto;
}
</style>
