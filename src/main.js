import Vue from 'vue';
import App from './App';
import router from './router';

import {FabricCanvas } from '../src/components';

Vue.use(FabricCanvas);

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
