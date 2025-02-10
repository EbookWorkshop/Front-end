import { App } from 'vue';
import Breadcrumb from './breadcrumb/index.vue';
import VueDiff from "vue-diff";


export default {
  install(Vue: App) {
    Vue.component('Breadcrumb', Breadcrumb);
    // Vue.component('Diff', VueDiff);
    Vue.use(VueDiff);//注册比较组件
  },
};
