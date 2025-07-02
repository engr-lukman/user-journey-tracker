<template>
  <div class="min-h-screen bg-gray-50">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useJourneyTracker } from "@/composables/useJourneyTracker";

const { initializeJourneyTracker } = useJourneyTracker();

onMounted(() => {
  // Start initialization but don't block mounting
  // Individual components will wait for this if needed
  initializeJourneyTracker().catch((error) => {
    console.error("Failed to initialize journey tracker:", error);
  });
});
</script>
