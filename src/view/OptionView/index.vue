<template>
    <div class="bg-gray-800 w-full h-full p-3 gap-3 flex flex-col max-h-screen overflow-y-auto scroll-smooth">
        <h1 class="text-5xl text-blue-50 p-2">设置</h1>
        <div class="w-full my-3 h-0.5 bg-gray-600"></div>
        <s-button info class="text-2xl tracking-widest" @click="back">
            <i class="fas fa-chevron-left mr-1"></i>
            返回
        </s-button>
        <s-container>
            <div class="space-y-4">
                <span class="w-full justify-between items-center flex">
                    <span>API 设置</span>
                    <s-popover position="right">
                        <template #trigger>
                            <span class="hover:text-green-400 hover:cursor-pointer transition">
                                <i class="far fa-question-circle mr-4"></i>
                            </span>
                        </template>
                        <div class="w-64 text-lg text-center font-normal">
                            <i>API Key</i> 和 <i>Secret Key</i>的获取是完全免费的，包括使用的Api也是免费的👍👍👍
                            <br>
                            只需要按照
                            <s-link href="https://ai.baidu.com/ai-doc/REFERENCE/Ck3dwjgn3">
                                <i class="fas fa-book-atlas"></i>
                                百度智能云AI接入指南
                            </s-link>
                            的步骤获取即可~~~
                        </div>
                    </s-popover>
                </span>
                <div class="flex space-x-6 items-center" v-for="item, idx in appDataList" :key="idx">
                    <span class="w-[20%] min-w-28 text-end text-xl">{{ item.name }}</span>
                    <form class="relative w-full p-3 bg-gray-800 rounded-xl px-4 has-[input:focus]:ring-2 
                        ring-green-400 transition flex items-center text-lg">
                        <input type="text" class="bg-transparent outline-none border-none w-full mx-4"
                            :placeholder="`请输入 ${item.name}`" v-model="item.data">
                    </form>
                </div>
                <s-button success class="tracking-widest" @click="save">
                    <span v-if="!saved">
                        <i class="fas fa-save mr-1"></i>
                        保存
                    </span>
                    <span v-else>
                        <i class="fas fa-check"></i>
                        成功
                    </span>
                </s-button>
            </div>
        </s-container>
    </div>
</template>

<script lang="ts">
import SContainer from '../../components/SContainer/index.vue';
import SButton from '../../components/SButton.vue';
import SPopover from '../../components/SPopover.vue';
import SLink from '../../components/SLink.vue';

export default {
    name: 'option-view',
    components: {
        SContainer, SButton, SPopover, SLink
    },
    data() {
        return {
            saved: false
        }
    },
    methods: {
        back() {
            this.$emit('changeComponent', 'main');
        },
        save() {
            window.data.setApiData({
                apiKey: this.appDataList[0].data,
                appSecret: this.appDataList[1].data
            });

            this.saved = true;

            setTimeout(() => {
                this.saved = false;
            }, 4000);
        }
    },
    setup() {
        const data = window.data.getApiData();
        const { apiKey, appSecret } = data ?? {
            apiKey: '',
            appSecret: ''
        }
        return {
            appDataList: [
                { name: 'API Key', data: apiKey },
                { name: 'Secret Key', data: appSecret },
            ],
        }
    },
}
</script>