import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; 



// Crée l'instance Vue, ajoute Pinia et le Router
createApp(App).use(router).use(createPinia()).mount('#app');
