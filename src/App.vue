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

onMounted(async () => {
  await initializeJourneyTracker();
});
</script>
