import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { publicAxios, protectedAxios } from './axiosConfig'; // Importa las instancias de Axios
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/main.css';

const app = createApp(App);

// Configuración global de Axios para todos los componentes
app.config.globalProperties.$publicAxios = publicAxios;
app.config.globalProperties.$protectedAxios = protectedAxios;

app.use(router).mount('#app');
