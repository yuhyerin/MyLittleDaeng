import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueFullPage from 'vue-fullpage.js'
import vuetify from './plugins/vuetify';
import VueCookies from "vue-cookies";
Vue.use(VueCookies);

Vue.use(VueFullPage);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
