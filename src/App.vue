<template>
  <div class="h-screen w-screen flex relative bg-gray-800">
    <!-- SIDE_BAR -->
    <sidebar @changeComponent="changeComponent" />
    <div class="w-full relative overflow-hidden z-0">
      <transition>
        <keep-alive>
          <component :is="currentComponent" @changeComponent="changeComponent" />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, markRaw } from 'vue';
import Sidebar from './components/Sidebar/index.vue'
import MainView from './view/MainView/index.vue'
import OptionView from './view/OptionView/index.vue'

export default {
  components: {
    Sidebar, MainView, OptionView
  },
  data() {
    return {
      currentComponent: MainView as Component
    }
  },
  methods: {
    changeComponent(name: 'main' | 'option') {
      if (name === 'main')
        this.currentComponent = markRaw(MainView)
      else
        this.currentComponent = markRaw(OptionView)
    }
  }
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: 0.4s ease;
  position: absolute;
}

.v-leave-to {
  opacity: 0;
  transform: translateX(30%);
}

.v-enter-from {
  opacity: 0;
  transform: translateX(-30%);
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
  transform: translateX(0) !important;
}
</style>