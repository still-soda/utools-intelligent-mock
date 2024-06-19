<template>
    <div class="bg-gray-800 w-full h-full p-3 space-y-3 max-h-screen overflow-y-auto scroll-smooth">
        <!-- DATA -->
        <inner-container>
            <span>数据</span>
            <transition-group name="fade">
                <form class="relative w-full p-3 bg-gray-800 rounded-xl px-4 has-[input:focus]:ring-2 
                        ring-green-400 transition flex items-center text-lg"
                    :class="data.enable ? 'opacity-100' : 'opacity-50'" v-for="data in mockData" :key="data.key">
                    <span @click="data.enable = !data.enable"
                        class="size-fit hover:cursor-pointer hover:text-yellow-400 text-2xl transition">
                        <i class="far mr-4" :class="data.enable ? 'fa-check-circle' : 'fa-circle'"></i>
                    </span>
                    <input type="text" class="bg-transparent w-[30%] outline-none" placeholder="属性名" v-model="data.name"
                        v-focus>
                    <span class="h-7 w-0.5 bg-gray-500 mx-4"></span>
                    <select class="bg-transparent outline-none w-[30%] [&_option]:bg-gray-800
                            [&_option]:selection:bg-yellow-400 [&_option]:font-bold [&_option]:text-gray-400
                            " v-model="data.type">
                        <option value="string">字符串</option>
                        <option value="number">数字</option>
                        <option value="boolean">布尔值</option>
                        <option value="object">对象</option>
                        <option value="array">数组</option>
                    </select>
                    <span class="h-7 w-0.5 bg-gray-500 mx-4"></span>
                    <input type="text" class="bg-transparent outline-none w-full" placeholder="描述" v-model="data.desc">
                    <span class="transition hover:text-red-400/75 text-gray-400/75 hover:cursor-pointer ml-2
                            " @click="remove(data.key)">
                        <i class="fa fa-trash"></i>
                    </span>
                </form>
            </transition-group>
            <s-button @click="append">
                添加新数据
                <template #icon>
                    <i class="fa fa-plus"></i>
                </template>
            </s-button>
        </inner-container>
        <!-- COUNT -->
        <inner-container>
            <span>生成数量</span>
            <div class="flex justify-between items-center">
                <s-button danger @click="count = Math.max(count - 1, 1)">
                    减少
                    <template #icon>
                        <i class="fa fa-minus"></i>
                    </template>
                </s-button>
                <span contenteditable ref="counter" class="p-3 rounded-xl outline-none selection:bg-green-800
                    " @input="countLimit">
                    {{ count }}
                </span>
                <s-button success @click="count = Math.min(count + 1, 50)">
                    增加
                    <template #icon>
                        <i class="fa fa-plus"></i>
                    </template>
                </s-button>
            </div>
        </inner-container>
        <inner-container>
            <span>生成结果</span>
            <div class="p-4 rounded-xl bg-gray-800 relative hover:ring-yellow-400 ring-transparent ring-2 transition
                group">
                <!-- NO RESULT -->
                <div class="mt-3 mb-1 w-full text-center text-gray-600 flex flex-col"
                    v-if="!error && (res === 'empty' || res === '')">
                    <i class="fas fa-code text-5xl"></i>
                    <span class="mt-3">no result</span>
                </div>
                <!-- ERROR -->
                <div class="mt-3 mb-1 w-full text-center text-gray-600 flex flex-col
                    " v-else-if="error">
                    <i class="far fa-times-circle text-5xl"></i>
                    <span class="mt-3">{{ res }}</span>
                </div>
                <!-- RESULT -->
                <div v-else>
                    <!-- BUTTONS -->
                    <div class="absolute group-hover:visible invisible transition right-0 top-0 mt-3 mr-3 flex gap-2">
                        <popover>
                            <div class="text-xl font-normal text-nowrap w-20 text-center">双击清空</div>
                            <template #trigger>
                                <div class=" p-2 size-10 rounded-xl flex items-center justify-center bg-gray-600 opacity-65 
                                hover:opacity-85 hover:cursor-pointer transition" @dblclick="res = 'empty'"
                                    title="清空结果">
                                    <i class="fa fa-trash absolute"></i>
                                </div>
                            </template>
                        </popover>
                        <popover>
                            <div class="text-xl font-normal text-nowrap w-20 text-center">
                                {{ editable ? '取消编辑' : '编辑内容' }}
                            </div>
                            <template #trigger>
                                <div class=" p-2 size-10 rounded-xl flex items-center justify-center
                                     bg-gray-600 opacity-65 hover:opacity-85 
                                     hover:cursor-pointer transition" @click="editable = !editable"
                                    :title="editable ? '取消编辑' : '编辑JSON'">
                                    <i class="fas fa-pen absolute transition"
                                        :class="{ 'opacity-0 scale-0': editable }"></i>
                                    <i class="fas fa-ban text-red-400 absolute transition"
                                        :class="{ 'opacity-0 scale-0': !editable }"></i>
                                </div>
                            </template>
                        </popover>
                        <popover>
                            <div class="text-xl font-normal text-nowrap w-20 text-center">
                                {{ copied ? '复制成功' : '复制内容' }}
                            </div>
                            <template #trigger>
                                <div class=" p-2 size-10 rounded-xl flex items-center justify-center
                                     bg-gray-600 opacity-65 hover:opacity-85
                                     hover:cursor-pointer transition" @click="copy" title="复制内容">
                                    <i class="fas fa-copy absolute transition"
                                        :class="{ 'opacity-0 scale-0': copied }"></i>
                                    <i class="fas fa-check text-green-400 absolute transition"
                                        :class="{ 'opacity-0 scale-0': !copied }"></i>
                                </div>
                            </template>
                        </popover>
                    </div>
                    <div class="absolute group-hover:invisible visible transition right-0 top-0 mt-3 mr-3
                        text-gray-500 select-none text-xl">
                        JSON
                    </div>
                    <!-- EDITOR -->
                    <pre class="font-semibold outline-none overscroll-x-auto overflow-x-auto text-xl
                        " ref="editor" @input="resultEdit" :contenteditable="editable">{{ res }}</pre>
                </div>
            </div>
        </inner-container>
        <s-button success :trigger="loading" class="py-5 overflow-hidden border-2 border-gray-600 
            hover:border-transparent" @click="generate">
            <div class="h-full absolute transition-all bg-green-400/25 left-0 top-0" :class="{
                'w-[80%]': loading,
                'w-[0%]': !loading
            }"></div>
            <transition name="switch" mode="out-in">
                <span class="text-2xl font-bold tracking-widest" v-if="!loading">
                    <i class="fa fa-hamburger"></i>
                    生成
                </span>
                <span class="text-2xl font-bold" v-else>
                    <i class="fas fa-spinner animate-spin"></i>
                </span>
            </transition>
        </s-button>
    </div>
</template>

<script lang="ts">
import InnerContainer from '../../components/InnerContainer/index.vue';
import SButton from '../../components/SButton.vue';
import Popover from '../../components/Popover.vue';
import type { MockData } from '../../types/mock';
import { useGlobalDataStore } from '../../store/gloablDataStore';

export default {
    components: {
        InnerContainer, SButton, Popover
    },
    data() {
        return {
            mockData: [] as MockData[],
            count: 1,
            loading: false,
            res: "empty",
            copied: false,
            editable: false,
            error: false
        }
    },
    setup() {
        const global = useGlobalDataStore()
        return {
            global,
            current: global.currentRecording
        }
    },
    watch: {
        "global.currentRecording"() {
            this.mockData = this.global.currentRecording.data;
            this.count = this.global.currentRecording.count;
            this.res = this.global.currentRecording.result;
            this.editable = false;
        },
        mockData() {
            this.global.currentRecording.data = this.mockData;
            this.global.saveCurrentRecording();
        },
        res() {
            this.global.currentRecording.result = this.res;
            this.global.saveCurrentRecording();
        },
        count() {
            this.global.currentRecording.count = this.count;
            this.global.saveCurrentRecording();
        }
    },
    directives: {
        focus: {
            mounted(el: HTMLElement) {
                el.focus();
            }
        }
    },
    methods: {
        append() {
            this.mockData.push({
                name: '',
                type: 'string',
                desc: '',
                enable: true,
                key: Symbol()
            })
        },
        remove(key: symbol) {
            this.mockData = this.mockData.filter(data => data.key !== key);
        },
        countLimit() {
            let newVal: number = Number.parseInt((this.$refs.counter as any).innerText);

            isNaN(newVal) && (newVal = 1);

            this.count = Math.max(1, newVal);
            this.count = Math.min(50, newVal);
        },
        async generate() {
            const data = this.mockData.filter(data => {
                return data.enable && data.name !== '';
            });

            if (data.length === 0) {
                return;
            }

            this.loading = true;

            let result = await window.data.requestApi({
                data: data,
                count: this.count
            });

            if (result.startsWith('[ERR]')) {
                this.error = true;
                result = result.substring(5);
            }
            else {
                this.error = false;
            }

            this.res = result.trim();
            this.loading = false;
        },
        copy() {
            navigator.clipboard.writeText(this.res);
            this.copied = true;

            setTimeout(() => {
                this.copied = false;
            }, 2000);
        },
        resultEdit() {
            const content = (this.$refs.editor as any).innerText;
            this.res = content.trim();
        }
    }
}
</script>

<style scoped>
.switch-enter-active,
.switch-leave-active {
    transition: all 0.2s ease;
}

.switch-enter-from,
.switch-leave-to {
    opacity: 0;
}

.switch-enter-to,
.switch-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
    @apply transition-all duration-300;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    max-height: 0;
    padding-block: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    max-height: 400px;
    padding-block: 10px;
}
</style>