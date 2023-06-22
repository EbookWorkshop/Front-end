import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

// import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeLibrary from '@/views/library/locale/zh-CN';
import localeWorkshop from '@/views/workshop/locale/zh-CN';
import localeWorkplace from '@/views/workplace/locale/zh-CN';
import localeSystem from '@/views/system/locale/zh-CN';
// import localeMonitor from '@/views/dashboard/monitor/locale/zh-CN';

// import localeSearchTable from '@/views/list/search-table/locale/zh-CN';
// import localeCardList from '@/views/list/card/locale/zh-CN';

// import localeStepForm from '@/views/form/step/locale/zh-CN';
// import localeGroupForm from '@/views/form/group/locale/zh-CN';

// import localeBasicProfile from '@/views/profile/basic/locale/zh-CN';

// import localeDataAnalysis from '@/views/visualization/data-analysis/locale/zh-CN';
// import localeMultiDAnalysis from '@/views/visualization/multi-dimension-data-analysis/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

// import localeUserInfo from '@/views/user/info/locale/zh-CN';
// import localeUserSetting from '@/views/user/setting/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  // 'menu.dashboard': '仪表盘',
  // 'menu.server.dashboard': '仪表盘-服务端',
  // 'menu.server.workplace': '工作台-服务端',
  // 'menu.server.monitor': '实时监控-服务端',
  // 'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'EBook Workshop',
  'menu.faq': '常见问题',
  'menu.api': '后台接口文档',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',

  'menu.library': '图书馆',
  'menu.workshop': '图书工坊',
  'menu.workplace': '图书工场',
  'menu.system': '系统设置',

  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeLibrary,
  ...localeWorkshop,
  ...localeSystem,
  // ...localeMonitor,
  // ...localeSearchTable,
  // ...localeCardList,
  // ...localeStepForm,
  // ...localeGroupForm,
  // ...localeBasicProfile,
  // ...localeDataAnalysis,
  // ...localeMultiDAnalysis,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  // ...localeUserInfo,
  // ...localeUserSetting,
};
