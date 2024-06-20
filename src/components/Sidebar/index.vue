<template>
    <div class=" bg-gray-900 w-64 flex flex-col relative shrink-0 transition-all"
        :class="{ '-ml-64': hide, 'ml-0': !hide }">
        <div class="absolute text-gray-400 right-0 top-[45%] py-3 px-1.5 bg-slate-700 rounded-md
            hover:bg-slate-600 transition hover:cursor-pointer z-30" @click="hide = !hide"
            :class="{ 'translate-x-[80%]': hide, 'translate-x-[30%]': !hide }">
            <i class="fa fa-angle-left transition" :class="{ 'rotate-180': hide }"></i>
        </div>
        <div class="flex items-center text-xl mx-3 space-x-2 p-5 text-blue-50">
            <div class="size-12 bg-yellow-400 shrink-0 rounded-full items-center justify-center flex font-bold
                text-green-500">
                <i class="fas fa-database"></i>
            </div>
            <span class="font-bold">Intelligent Mock</span>
        </div>
        <div class="h-0.5 bg-gray-700 mb-3 mx-3"></div>
        <div class="overflow-y-auto m-3 mb-2">
            <div v-for="option in options" :key="option.title" class="relative w-full px-5 py-3 pt-0 overflow-x-hidden">
                <div class="text-xl text-blue-50 font-bold py-2 sticky top-0">
                    {{ option.title }}
                </div>
                <div v-for="item in option.data" :key="item.key" class="text-xl text-gray-400
                    [&_span]:hover:text-yellow-400 hover:cursor-pointer transition py-2 flex 
                    items-center justify-between relative group" @click="select(item)">
                    <input class="transition overflow-hidden outline-none bg-transparent" :class="{
                        'hover:cursor-text': item.editable,
                        'text-yellow-400': item.key === selected,
                        'bg-gray-600': item.editable,
                        'pointer-events-none': !item.editable,
                    }" :contenteditable="item.editable" :disabled="!item.editable" @input="rename(item.id)"
                        :ref="item.id" v-model="item.name" />
                    <div class="absolute right-0 group-hover:[&_i]:opacity-100 [&_i]:opacity-0 [&_span]:transition transition 
                        space-x-3 shrink-0 bg-gradient-to-l from-gray-900 to-transparent pl-2 group-hover:bg-gray-900"
                        :class="{
                            '[&_i]:opacity-100 group-hover:bg-transparent from-transparent': item.editable
                        }">
                        <i class="fa fa-edit hover:text-green-400 text-gray-400 transition"
                            @click="item.editable = true" title="重命名" v-if="!item.editable"></i>
                        <i class="fas fa-check text-green-400" @click="item.editable = false" title="完成" v-else></i>
                        <i class="fa fa-trash hover:text-red-400 text-gray-400 transition" @click="remove(item)"
                            title="删除" v-if="!item.editable"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="mx-3">
            <div class="rounded-lg border-dashed border-2 border-gray-700 flex justify-center p-2
                hover:border-solid hover:bg-gray-700 [&_div]:hover:text-gray-300 hover:cursor-pointer transition
                items-center" @click="append">
                <div class="text-gray-700 transition space-x-2 mx-3">
                    <span>添加</span>
                    <i class="fa fa-plus-circle"></i>
                </div>
            </div>
        </div>
        <!-- FOOTER -->
        <div class="mt-auto w-64 transition-all z-50" :class="{ '-ml-64': hide, 'ml-0': !hide }">
            <div class="w-64 p-3 text-center font-bold text-gray-600 select-none bg-gray-900">
                趁没人跳个街舞 ጿ ኈ ቼ ዽ ጿ
            </div>
            <div class="flex space-x-2 w-64 justify-end p-2 bg-gray-900">
                <div class="relative p-1 rounded-lg bg-gray-800 w-10 h-10 hover:bg-gray-700 hover:cursor-pointer 
                    transition-all flex items-center justify-center [&_span]:opacity-0 
                    hover:w-20 [&_span]:hover:opacity-100 overflow-hidden shrink-0
                    [&_i]:hover:rotate-180" v-for="option in footerOptions" :key="option.name"
                    @click="patch(option.type)">
                    <i class="absolute left-2.5 text-xl text-blue-50 transition" :class="option.icon"></i>
                    <span class="absolute right-0 text-nowrap text-blue-50 w-10 font-bold transition">
                        {{ option.name }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useGlobalDataStore } from '../../store/gloablDataStore';

type MockData = {
    name: string,
    key: symbol,
    editable: boolean,
    id: string
}

export default {
    name: 'side-bar',
    data() {
        return {
            hide: false,
            options: {
                mock: {
                    title: '我的Mock',
                    data: [] as MockData[],
                },
            },
            selected: Symbol(),
            footerOptions: [
                {
                    name: '日间',
                    icon: 'fa fa-sun',
                    type: 'main'
                },
                {
                    name: '设置',
                    icon: 'fa fa-gear',
                    type: 'option'
                }
            ]
        }
    },
    directives: {
        focus: {
            mounted(el: HTMLElement) {
                el.focus();
            }
        }
    },
    mounted() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.options.mock.data.forEach(item => item.editable = false);
            }
        });
        this.selected = this.options.mock.data[0]?.key || Symbol();
    },
    methods: {
        rename(id: string) {
            const content =
                this.options.mock.data
                    .find(item => item.id === id)!
                    .name;

            if (!content) {
                return;
            }

            this.global.currentRecording.name = content;
            this.global.saveCurrentRecord();
        },
        patch(type: string) {
            if (type === 'option') {
                this.$emit('changeComponent', 'option');
            }
            if (type === 'main') {
                this.$emit('changeComponent', 'main');
            }
        },
        append() {
            let id = `r-${Date.now()}`;
            let suffix = 0;

            const existId = (id: string) => {
                return this.options.mock.data
                    .some(item => item.id === id);
            }

            while (existId(id)) {
                id = `r-${Date.now()}-${suffix++}`;
            }

            this.options.mock.data
                .push({
                    name: 'new-mock',
                    key: Symbol(),
                    editable: false,
                    id
                });

            window.data.setRecords({
                data: [],
                id: id,
                count: 1,
                name: 'new-mock',
                result: 'empty'
            });
        },
        remove(data: MockData) {
            const item = this.options.mock;
            item.data = item.data.filter(item => item.key !== data.key);

            this.global.removeRecord(data.id);
        },
        select(item: MockData) {
            this.selected = item.key
            this.global.switchRecord(item.id);
        }
    },
    setup() {
        return {
            global: useGlobalDataStore()
        }
    },
    created() {
        const mockList = window.data.getRecords();
        if (mockList.length > 0) {
            this.global.currentRecording = mockList[0];
        }
        this.options.mock.data
            .push(
                ...mockList.map(item => ({
                    name: item.name,
                    key: Symbol(),
                    editable: false,
                    id: item.id
                }))
            );
    },
}
</script>

<style scoped></style>