import { App } from 'vue';
import Breadcrumb from './breadcrumb/index.vue';

// Manually introduce ECharts modules to reduce packing size

export default {
  install(Vue: App) {
    Vue.component('Breadcrumb', Breadcrumb);
  },
};
