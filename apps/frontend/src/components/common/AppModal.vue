<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeOnBackdrop && close()" />

        <!-- Modal -->
        <div :class="['relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl', sizeClass]">
          <!-- Header -->
          <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
            <slot name="header" />
            <button
              v-if="showClose"
              class="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click="close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="p-6 pt-0 flex justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    size: {
      type: String as () => 'sm' | 'md' | 'lg' | 'xl',
      default: 'md',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    sizeClass(): string {
      const sizes: Record<string, string> = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
      };
      return sizes[this.size] || sizes.md;
    },
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false);
    },
  },
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
