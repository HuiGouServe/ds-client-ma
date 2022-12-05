import { createApp } from 'vue'
import App from './App.vue'
import './css/index.css'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import router from './router/index'
import { createPinia } from 'pinia'
// import 'default-passive-events' //处理警告
import './permission'



console.log(process.env.VITE_BASE_API);

const app = createApp(App)
// app.config.globalProperties.http = $http;
app.use(ElementPlus, { locale })
app.use(router)
app.use(createPinia());
app.mount('#app')
