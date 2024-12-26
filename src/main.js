import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'

// Bootstrap 설정
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

import './assets/css/main.css'
import axios from 'axios';

axios.defaults.baseURL = '/api'; // 프록시 서버 주소로 변경

const app = createApp(App)

app.use(store)
app.use(router)
app.use(VueCookies)

app.mount('#app')