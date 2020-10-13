import Vue from 'vue';
import App from './App';
import router from './router';
import VueI18n from 'vue-i18n'

import {FabricCanvas } from '../src/components';
import GeminiScrollbar from 'vue-gemini-scrollbar'

Vue.use(VueI18n) // 通过插件的形式挂载
Vue.use(GeminiScrollbar);
Vue.use(FabricCanvas);

Vue.config.productionTip = false;
const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('./common/lang/zh'),   // 中文语言包
    'en-US': require('./common/lang/en')    // 英文语言包
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  template: '<App/>',
  components: { App }
});
