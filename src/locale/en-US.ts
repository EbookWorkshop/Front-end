import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

// import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeLibrary from '@/views/library/locale/en-US';
import localeWorkshop from '@/views/workshop/locale/en-US';
import localeWorkplace from '@/views/workplace/locale/zh-CN';
import localeSystem from '@/views/system/locale/zh-CN';

import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',

  'menu.library': 'Library',
  'menu.workshop': 'Workshop',
  'menu.workplace': 'Workplace',
  'menu.system': 'System Setting',

  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeLibrary,
  ...localeWorkshop,
  ...localeSystem,
};
