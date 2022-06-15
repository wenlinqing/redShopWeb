import Vue from 'vue'
import App from './App'
import moment from 'moment'
Vue.prototype.$moment=moment;


Vue.config.productionTip = false


// import uSticky from 'pages/u-sticky.vue'
// Vue.component('uSticky', uSticky)

import request from 'units/request.js'
Vue.prototype.$request=request

Vue.prototype.imgHost='http://115.227.18.87:9999/public/'


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
