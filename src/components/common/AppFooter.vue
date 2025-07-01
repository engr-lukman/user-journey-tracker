<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-md mx-auto px-4 py-4">
      <div class="text-center space-y-2">
        <p class="text-xs text-gray-500">
          © {{ currentYear }} Journey Tracker. All rights reserved.
        </p>
        <p class="text-xs text-gray-400">
          Version 1.0.0 | Built with Vue 3 & Tailwind CSS
        </p>
        <p class="text-xs text-gray-400">
          Data collected for analytics and user experience improvement
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>
