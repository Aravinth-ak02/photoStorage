import { reactive } from 'vue';
import { ref } from 'vue'
export const store = reactive({
    settings: {},
    page:"allphotos",
    changeSettings(value) {
        this.settings = value;
    }
});