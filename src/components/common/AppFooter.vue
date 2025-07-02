<template>
  <footer class="bg-white/95 backdrop-blur-sm border-t border-gray-100 mt-auto">
    <div class="max-w-md mx-auto px-4 py-6">
      <div class="text-center space-y-4">
        <!-- Copyright -->
        <div class="space-y-1">
          <p class="text-xs text-gray-500">
            © {{ currentYear }} Journey Tracker. All rights reserved.
          </p>
          <p class="text-xs text-gray-400">
            Secure analytics and user experience insights
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>
