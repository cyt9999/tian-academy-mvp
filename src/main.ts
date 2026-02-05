import { createApp } from 'vue'
import { createPinia } from 'pinia'
import useTokenStore from '@/stores/token'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())

const tokenStore = useTokenStore()
tokenStore.initialOidc()

app.use(router)
app.mount('#root')
