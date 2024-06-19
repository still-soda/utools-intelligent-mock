<template>
    <div class="relative p-4 rounded-xl px-7 transition flex justify-center
         items-center space-x-4 hover:cursor-pointer bg-gray-900
        ring-2 select-none active:bg-gray-800" :class="{
            'text-gray-600': !trigger,
            'ring-transparent': !trigger,
            'hover:text-gray-500': !success && !danger && !warning && !info,
            'hover:ring-gray-700': !success && !danger && !warning && !info,
            'text-gray-500': !success && !danger && !warning && !info && trigger,
            'ring-gray-700': !success && !danger && !warning && !info && trigger,
            'hover:text-green-400': success,
            'hover:ring-green-400': success,
            'text-green-400': success && trigger,
            'ring-green-400': success && trigger,
            'hover:text-red-400': danger,
            'hover:ring-red-400': danger,
            'text-red-400': danger && trigger,
            'ring-red-400': danger && trigger,
            'hover:text-yellow-400': warning,
            'hover:ring-yellow-400': warning,
            'text-yellow-400': warning && trigger,
            'ring-yellow-400': warning && trigger,
            'hover:text-blue-400': info,
            'hover:ring-blue-400': info,
            'text-blue-400': info && trigger,
            'ring-blue-400': info && trigger,
        }">
        <span>
            <slot></slot>
        </span>
        <slot name="icon"></slot>
    </div>
</template>

<script lang="ts">
export default {
    name: 's-button',
    props: {
        default: Boolean,
        success: Boolean,
        danger: Boolean,
        warning: Boolean,
        info: Boolean,
        trigger: Boolean
    }
}
</script>