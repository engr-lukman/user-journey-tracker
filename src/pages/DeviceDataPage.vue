<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 p-2 sm:p-3">
      <div class="w-full max-w-4xl mx-auto">
        <div class="text-center mb-4">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Device Information
          </h1>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          <Button @click="exportJourneyData" variant="primary"> Export </Button>
          <Button @click="goToHome" variant="secondary"> Home </Button>
        </div>

        <div class="mb-4">
          <div
            class="bg-gray-800 rounded-xl p-2 overflow-auto max-h-[55vh] text-sm font-mono shadow-lg"
          >
            <pre class="text-green-400">{{ formattedDeviceData }}</pre>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
const { deviceSystemData, exportJourneyData } = useJourneyTracker();

const formattedDeviceData = computed(() => {
  if (!deviceSystemData || Object.keys(deviceSystemData).length === 0) {
    return "{}";
  }
  return JSON.stringify(deviceSystemData, null, 2);
});

const goToHome = () => {
  router.push(JOURNEY.WELCOME_PAGE.path);
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
