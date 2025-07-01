<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <div class="flex-1 p-4 sm:p-6">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-6">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
        </div>

      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div class="text-sm text-gray-600 space-y-3">
          <p>By using our service, you agree to:</p>
          <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm">
            <li>Data collection for service improvement</li>
            <li>Privacy protection standards</li>
            <li>Responsible usage policies</li>
          </ul>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div class="space-y-3">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="termsAgreed"
              class="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span class="text-gray-700 text-sm"
              >I agree to the Terms & Conditions</span
            >
          </label>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
      >
        <button
          @click="goBackToHome"
          class="w-full sm:flex-1 bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          Back
        </button>
        <button
          @click="acceptTermsAndContinue"
          :disabled="!canProceedToNext"
          :class="[
            'w-full sm:flex-1 font-medium py-3 px-4 rounded-md transition-colors text-sm sm:text-base',
            canProceedToNext
              ? 'bg-pink-600 text-white hover:bg-pink-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          Continue
        </button>
      </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker.js";
import { JOURNEY_STEPS } from "@/constants/journeySteps.js";
import { ROUTES } from "@/constants/routes.js";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";

const router = useRouter();
const { recordJourneyStep, saveUserInformation } = useJourneyTracker();

const termsAgreed = ref(false);

const canProceedToNext = computed(() => termsAgreed.value);

onMounted(() => {
  recordJourneyStep(JOURNEY_STEPS.TERMS_PAGE_VIEWED);
});

const goBackToHome = () => {
  recordJourneyStep(JOURNEY_STEPS.TERMS_BACK_BUTTON_CLICKED);
  router.push(ROUTES.HOME.path);
};

const acceptTermsAndContinue = () => {
  if (!canProceedToNext.value) return;
  saveUserInformation({
    termsAndConditions: {
      termsAccepted: termsAgreed.value,
      acceptedAt: new Date().toISOString(),
    },
  });
  recordJourneyStep(JOURNEY_STEPS.TERMS_ACCEPTED);
  router.push(ROUTES.USER_INFO.path);
};
</script>
