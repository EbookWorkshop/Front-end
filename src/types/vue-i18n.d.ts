import { ComponentCustomProperties } from 'vue';
import { I18n } from 'vue-i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: I18n['t']; // 注入 $t 的类型
  }
}

/*
// 上述声明是用于直接使用 $t 而不触发 TypeScript 检查的报错
// 在 Vue 3 中，推荐使用 Composition API 的 useI18n 钩子来访问 $t 方法：

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
//或
const { $t:t } = useI18n();
*/