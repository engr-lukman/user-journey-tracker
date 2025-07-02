<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <div class="flex-1 p-4 sm:p-6">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-8">
          <div
            class="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Success!
          </h1>
          <p class="text-gray-600">Your account has been verified</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Verification Summary
          </h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Session ID:</span>
              <span class="font-mono text-gray-900"
                >{{ sessionId?.slice(0, 8) }}...</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Completed:</span>
              <span class="text-gray-900">{{ completedAt }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Steps:</span>
              <span class="text-gray-900">{{ totalSteps }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <Button
            type="button"
            variant="primary"
            full-width
            @click="downloadData"
          >
            Download Journey Data
          </Button>
          <Button
            type="button"
            variant="secondary"
            full-width
            @click="startOver"
          >
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
