<template>
  <div class="min-h-screen bg-gray-50">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useJourneyTracker } from "@/composables/useJourneyTracker.js";

const { initializeJourneyTracker, loadPreviousJourneySession } =
  useJourneyTracker();

onMounted(async () => {
  loadPreviousJourneySession();
  await initializeJourneyTracker();
});
</script>
