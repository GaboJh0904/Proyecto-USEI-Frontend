import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/main.css';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App);

app.use(router);
app.use(VueApexCharts); // Registrando Vue ApexCharts globalmente

app.mount('#app');
