<template>
    <div class="w-full bg-gray-950 rounded-2xl
            transition text-blue-50 p-4">
        <div class="text-2xl font-bold space-y-4">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 's-container',
}
</script>