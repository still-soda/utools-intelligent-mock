<template>
    <div class="relative justify-stretch">
        <div class="peer/slot w-fit" ref="trigger">
            <slot name="trigger"></slot>
        </div>
        <div class="peer-hover/slot:opacity-100 absolute opacity-0 transition
            z-40 peer-hover/slot:pointer-events-auto pointer-events-none flex 
            items-center justify-center w-fit peer-hover/slot:scale-x-100 scale-x-50" :style="{
                'transform': `
                    translate(
                        ${-contentWidth / 2 + triggerWidth / 2}px,
                        5px
                    )  
                    scaleX(var(--tw-scale-x))`
            }">
            <div class="absolute top-0 rounded-md size-5 rotate-45 bg-gray-500" :style="{
                'left': left
            }"></div>
            <div ref="content" class="bg-gray-500 rounded-xl p-3 translate-y-1">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'popover',
    data() {
        return {
            contentWidth: 0,
            triggerWidth: 0,
        }
    },
    computed: {
        left() {
            if (this.position === 'right') {
                return `${this.contentWidth / 2 - 15}px`;
            }
            else if (this.position === 'center') {
                return undefined;
            }
            else {
                return `${this.triggerWidth / 2 - 10}px`;
            }
        }
    },
    mounted() {
        const content = this.$refs.content as HTMLElement;
        const offset = ['left', 'center', 'right'].indexOf(this.position) - 1;
        this.contentWidth = content.offsetWidth * (offset + 1) - (20 * offset);
        if (this.position === 'left') {
            this.contentWidth += 25;
        }

        const trigger = this.$refs.trigger as HTMLElement;
        this.triggerWidth = trigger.offsetWidth;
    },
    props: {
        position: {
            default: 'center' as 'center' | 'left' | 'right',
        }
    }
}
</script>