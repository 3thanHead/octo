import Vue from 'vue'
import VueMq from 'vue-mq'

import App from '@/App'
import Extendable from '@/components/Extendable'
import { authInstance } from '@/firebase'
import router from '@/router'
import store from '@/store'

import '@/assets/app.css'

// setup the service worker
import '@/registerServiceWorker'

import {
  SET_MOD_KEY,
  SET_OFFLINE,
  SET_ONLINE,
  SET_SHOW_WELCOME,
  SET_USER,
} from '@/store/actions'

import PackageManager from '@/packages/manager'

Vue.prototype.$packageManager = PackageManager

Vue.use(VueMq, {
  breakpoints: {
    // breakpoints match as `screen_size <= value`
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: Infinity,
  },
})

if (localStorage.getItem('octo/welcome/v1') === null) {
  store.dispatch(SET_SHOW_WELCOME, true)
}

Vue.component('Extendable', Extendable)

new Vue({
  router,
  store,
  render: h => h(App),
  async created() {
    window.addEventListener('offline', () => {
      this.$store.dispatch(SET_OFFLINE)
    })

    window.addEventListener('online', () => {
      this.$store.dispatch(SET_ONLINE)
    })

    if (!navigator.onLine) {
      await this.$store.dispatch(SET_OFFLINE)
    }

    if (/Mac|iPod|iPhone|iPad/.test(navigator.platform)) {
      this.$store.dispatch(SET_MOD_KEY, '⌘ cmd')
    }
  },
}).$mount('#app')

authInstance.onAuthStateChanged((user) => {
  store.dispatch(SET_USER, { user: user || null })
})
