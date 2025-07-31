<template>
  <div class="min-h-screen bg-gray-50">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";

import { useTracker } from "@/composables/useTracker";

const { initializeTracker } = useTracker();

onMounted(() => {
  // Start initialization but don't block mounting
  // Individual components will wait for this if needed
  initializeTracker().catch((error) => {
    console.error("Failed to initialize tracker:", error);
  });
});
</script>
