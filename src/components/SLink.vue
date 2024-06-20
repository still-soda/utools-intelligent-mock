<template>
    <a class="text-green-400 hover:text-green-300 transition 
        underline-offset-4 font-normal hover:cursor-pointer" @click="open">
        <slot></slot>
    </a>
</template>

<script lang="ts">
export default {
    name: 's-link',
    props: {
        href: {
            type: String,
            required: true
        }
    },
    methods: {
        open() {
            window.openUrl(this.href);
        }
    }
}
</script>