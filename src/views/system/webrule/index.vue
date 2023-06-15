<template>
  <div ref="containerRef" class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.webrule']" />
    <a-form ref="formRef" :model="form" @submit="Submit">
      <a-row>
        <a-col :span="20" :offset="2">
          <a-space>
            <a-button type="primary" @click="resetForm">新增新方案</a-button>
            <a-button type="primary" @click="showWebList"
              >编辑现有方案</a-button
            >
            <a-affix :offset-top="8">
              <a-button type="primary" status="success" html-type="submit"
                >保存当前方案</a-button
              >
            </a-affix>
            <a-popconfirm
              content="你确定要删除当前站点配置？这将无法恢复。"
              type="warning"
              @ok="DeleteIt"
            >
              <a-button type="primary" status="danger">删除当前方案</a-button>
            </a-popconfirm>
            <a-button-group>
              <a-button type="primary" @click="exportScheme"
                >导出当前方案（json）</a-button
              >
              <a-button type="primary" @click="testSocket"
                >导入当前方案（json）</a-button
              >
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
            <a-form-item
              field="hostname"
              label="网站域名"
              :rules="[{ required: true, message: '网站名为必填' }]"
              :validate-trigger="['change', 'input']"
            >
              <a-input-search
                v-model="form.hostname"
                placeholder="网站域名（域名，如：book.xiaoshuo.com）"
                search-button
              >
                <template #button-icon>
                  <a-tooltip content="打开当前网站">
                    <icon-launch @click="CheckThisWeb" />
                  </a-tooltip>
                </template>
              </a-input-search>
            </a-form-item>
            <a-form-item
              field="rulename"
              label="添加规则"
              :rules="[{ required: true, message: '至少得有一个规则' }]"
              :validate-trigger="['change', 'input']"
            >
              <a-select
                v-model="form.rulename"
                placeholder="选择需要启用的规则"
                multiple
                :options="rulesOptions"
                @change="changeRuleNamelist"
              >
              </a-select>
            </a-form-item>
            <a-form-item
              v-for="(rule, index) of form.rules"
              :key="index"
              :field="`rules.${index}.ruleShowName`"
              :label="rule.ruleShowName"
            >
              <a-space direction="vertical" fill style="width: 100%">
                <a-divider />
                <input v-model="rule.ruleName" type="hidden" />
                <a-form-item
                  label="选择器"
                  :field="`rules.${index}.selector`"
                  :rules="[
                    {
                      required: true,
                      message: '选择器为必填，用于命中操作元素。',
                    },
                  ]"
                  :validate-trigger="['change', 'input']"
                >
                  <a-input v-model="rule.selector" placeholder="CSS选择器" />
                </a-form-item>
                <a-form-item
                  label="删除的元素"
                  :field="`rules.${index}.removeSelector`"
                >
                  <a-select
                    v-model="rule.removeSelector"
                    placeholder="通过CSS选择器匹配，命中的元素会从DOM中删除。用于去广告。"
                    multiple
                    allow-create
                  >
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="获取内容"
                  :field="`rules.${index}.getContentAction`"
                >
                  <a-textarea
                    v-model="rule.getContentAction"
                    placeholder="获取内容的表达式"
                  />
                </a-form-item>
                <a-form-item
                  label="获取链接"
                  :field="`rules.${index}.getUrlAction`"
                >
                  <a-textarea
                    v-model="rule.getUrlAction"
                    placeholder="获取超链接地址的表达式"
                  />
                </a-form-item>
                <a-form-item label="内容类型" :field="`rules.${index}.type`">
                  <a-select
                    v-model="rule.type"
                    placeholder="按哪种方式获取内容"
                  >
                    <a-option value="Object">一次一个目标</a-option>
                    <a-option value="List">一次多个目标</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="命中匹配校验"
                  :field="`rules.${index}.checkSetting`"
                >
                  <a-input
                    v-model="rule.checkSetting"
                    placeholder="判断是否命中的文本。如相同的选择器，只匹配‘下一页’不匹配‘下一章’"
                  />
                </a-form-item>
                <a-button
                  v-if="isUseVisModel"
                  status="warning"
                  @click="VisRuleSetting(rule)"
                  >预览规则：{{ rule.ruleShowName }}</a-button
                >
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
    <a-modal
      v-model:visible="formUrlForVisVisible"
      title="首先：请提供两个网址用于辅助预览"
    >
      <a-form :model="formUrlForVis" layout="vertical">
        <a-form-item field="indexUrl" label="图书章节目录页网址:">
          <a-input v-model="formUrlForVis.indexUrl" />
        </a-form-item>
        <a-form-item field="contentUrl" label="图书正文阅读页网址:">
          <a-input v-model="formUrlForVis.contentUrl" />
        </a-form-item>
      </a-form>
    </a-modal>

    <WebList ref="myWebList" @set-form="setFormWithSetting"></WebList>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  import {
    saveHostSetting,
    deleteHostSetting,
    visRuleSetting,
    exportSecheme,
  } from '@/api/webbot';
  import { Message } from '@arco-design/web-vue';
  import useSocket from '@/hooks/socket';
  import WebList from './components/web-list.vue';

  const socket = useSocket();

  const formUrlForVisVisible = ref(false); // 配置弹窗是否显示
  const formUrlForVis = reactive({ indexUrl: '', contentUrl: '' }); // 弹窗表单——辅助预览的网址采集表单
  const isUseVisModel = ref(false);
  const isUseVisStatus = computed(() =>
    isUseVisModel.value ? 'warning' : 'normal'
  );

  // 规则类型选项
  const rulesOptions = [
    {
      label: '目录',
      isGroup: true,
      options: [
        { value: 'BookCover', label: '目录-封面' },
        { value: 'BookName', label: '目录-书名' },
        { value: 'ChapterList', label: '目录-章节列表' },
        { value: 'IndexNextPage', label: '目录-下一页' },
      ],
    },
    {
      label: '文章',
      isGroup: true,
      options: [
        { value: 'CapterTitle', label: '文章-标题' },
        { value: 'Content', label: '文章-正文' },
        { value: 'ContentNextPage', label: '文章-下一页' },
      ],
    },
  ];

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
        getContentAction: '',
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

  // test
  function testSocket() {
    // socket.io.connect();
    // socket.io.timeout(5000).emit("message","666666666");
    if (!socket.io.connected) socket.io.connect();
    console.log(socket);
    socket.io.emit('message', 'this message data!');
  }

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
        getContentAction: '',
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
    form.rulename = ['BookName'];
    form.rules = [];
    changeRuleNamelist(['BookName']);
  }

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

    Message.loading('正在保存...');
    saveHostSetting(myRule)
      .then(() => {
        Message.success(`保存成功！`);
      })
      .catch((err) => {
        Message.error(`保存失败：${err.message}`);
      });
  }
  function DeleteIt() {
    if (form.hostname.length === 0) {
      Message.warning('网站名为空，不能删除配置。');
      return;
    }

    Message.loading('正在删除...');
    deleteHostSetting(form.hostname)
      .then(() => {
        Message.success(`删除成功！`);
      })
      .catch((err) => {
        Message.error(`删除失败：${err.message}`);
      });
  }

  // 切换预览地址设置窗口是否可见
  const toggleFormUrl4Vis = () => {
    isUseVisModel.value = !isUseVisModel.value;
    if (isUseVisModel.value)
      formUrlForVisVisible.value = !formUrlForVisVisible.value;
  };

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
</script>

<style>
  .container {
    height: 90vh;
    overflow: auto;
  }
</style>
