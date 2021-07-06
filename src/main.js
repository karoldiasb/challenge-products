import Vue from 'vue'
import App from './App.vue'
import 'bootstrap';
import './assets/app.scss';

import VueBootstrapToasts from "vue-bootstrap-toasts";
Vue.use(VueBootstrapToasts);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
