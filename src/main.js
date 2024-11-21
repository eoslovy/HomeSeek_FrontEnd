import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Bootstrap 설정
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

import './assets/css/main.css'
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080'; // 백엔드 서버 주소

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')