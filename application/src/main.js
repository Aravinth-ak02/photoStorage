import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import FilesShow from "./components/FilesShow.vue";
const app = createApp(App);
app.use(createRouter({
    routes: [
        {
            path: "/:name",
            component: FilesShow
        },{
            path:"/",
            redirect:"/allphotos"
        }
    ],
    history: createWebHistory()
}))
app.use(bootstrap);
app.mount('#app')
