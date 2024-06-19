import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import './index.css';
import hljs from 'highlight.js';
import hljsVuePlugin from '@highlightjs/vue-plugin';

import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

createApp(App)
    .use(hljsVuePlugin)
    .use(createPinia())
    .mount('#app')
