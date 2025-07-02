<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 p-4 sm:p-6">
      <div class="w-full max-w-md mx-auto">
        <!-- Success Header -->
        <div class="text-center mb-10">
          <div class="relative">
            <!-- Success Icon with Animation -->
            <div
              class="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <!-- Celebration particles -->
            <div class="absolute inset-0 pointer-events-none">
              <div
                class="absolute top-4 left-8 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              ></div>
              <div
                class="absolute top-8 right-12 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping animation-delay-300"
              ></div>
              <div
                class="absolute bottom-8 left-12 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-500"
              ></div>
            </div>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Congratulations!
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 mb-2">
            Your journey is complete
          </p>
          <p class="text-xs sm:text-sm text-gray-500">
            Account verified successfully
          </p>
        </div>

        <!-- Summary Card -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-100"
        >
          <div class="flex items-center mb-6">
            <div
              class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3"
            >
              <svg
                class="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">
              Journey Summary
            </h3>
          </div>

          <div class="space-y-4">
            <div
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span class="text-sm font-medium text-gray-600">Session ID</span>
              <span
                class="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded"
              >
                {{ sessionId?.slice(0, 8) }}...
              </span>
            </div>
            <div
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span class="text-sm font-medium text-gray-600"
                >Completed At</span
              >
              <span class="text-sm text-gray-900">{{ completedAt }}</span>
            </div>
            <div
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span class="text-sm font-medium text-gray-600">Total Steps</span>
              <span class="text-sm font-semibold text-green-600">{{
                totalSteps
              }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <Button @click="downloadData" variant="primary" full-width>
            Download Journey Data
          </Button>

          <Button @click="startOver" variant="secondary" full-width>
            Start New Journey
          </Button>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
const {
  recordJourneyStep,
  collectedUserData,
  currentSessionId,
  journeyStepsData,
  exportJourneyData,
} = useJourneyTracker();

const sessionId = computed(() => currentSessionId.value);

const completedAt = computed(() => {
  return new Date().toLocaleString();
});

const totalSteps = computed(() => {
  return journeyStepsData.value?.length || 0;
});

onMounted(() => {
  recordJourneyStep(JOURNEY.JOURNEY_COMPLETE.steps.JOURNEY_COMPLETED);
});

const downloadData = () => {
  recordJourneyStep(JOURNEY.JOURNEY_COMPLETE.steps.DATA_EXPORT_REQUESTED);
  exportJourneyData();
};

const startOver = () => {
  recordJourneyStep(JOURNEY.JOURNEY_COMPLETE.steps.RESTART_JOURNEY);
  localStorage.clear();
  router.push(JOURNEY.WELCOME_PAGE.path);
};
</script>
