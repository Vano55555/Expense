import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';  // BootstrapVue3 CSS
import 'bootstrap'; 


createApp(App)
  .use(router)
  .use(createPinia())  
  .mount('#app');
