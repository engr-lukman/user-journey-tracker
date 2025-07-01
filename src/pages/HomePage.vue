<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6"
  >
    <div class="w-full max-w-sm bg-white rounded-lg shadow-lg p-6 text-center">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Welcome</h1>
      <div class="space-y-3">
        <button
          @click="startJourney"
          class="w-full bg-pink-600 text-white font-medium py-3 px-4 rounded-md hover:bg-pink-700 transition-colors text-sm sm:text-base"
        >
          Get Started
        </button>
        <button
          @click="goToDebug"
          class="w-full bg-gray-600 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-xs"
        >
          🔍 Debug Fingerprinting
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker.js";

const router = useRouter();
const { initializeJourneyTracker, recordJourneyStep } = useJourneyTracker();

onMounted(async () => {
  await initializeJourneyTracker();
  recordJourneyStep("home_page_viewed");
});

const startJourney = () => {
  recordJourneyStep("get_started_button_clicked");
  router.push("/terms");
};

const goToDebug = () => {
  recordJourneyStep("debug_button_clicked");
  router.push("/debug");
};
</script>
