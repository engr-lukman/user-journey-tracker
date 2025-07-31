<template>
  <header
    class="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 mb-4 sm:mb-6"
  >
    <div class="max-w-md mx-auto px-3 sm:px-4 py-3 sm:py-4">
      <!-- Header Content -->
      <div class="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <h1 class="text-sm sm:text-base font-bold text-gray-900 truncate">
            Journey Tracker
          </h1>
          <p class="text-xs text-gray-500 truncate">
            User Experience Analytics
          </p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-100 rounded-full h-1 sm:h-1.5 overflow-hidden">
        <div
          class="bg-gradient-to-r from-pink-500 to-purple-600 h-1 sm:h-1.5 rounded-full transition-all duration-500 ease-out"
          :style="{ width: progressWidth }"
        ></div>
      </div>

      <!-- Progress Steps -->
      <div class="flex justify-between mt-1 sm:mt-2 text-xs text-gray-400">
        <span class="font-medium truncate">{{ currentStepText }}</span>
        <span class="flex-shrink-0 ml-2">{{ progressText }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { JOURNEY } from "@/constants/journey";

const route = useRoute();

const journeySteps = [
  {
    path: JOURNEY.WELCOME_PAGE.path,
    name: JOURNEY.WELCOME_PAGE.title,
    step: 1,
  },
  {
    path: JOURNEY.TERMS_CONDITIONS.path,
    name: JOURNEY.TERMS_CONDITIONS.title,
    step: 2,
  },
  {
    path: JOURNEY.PERSONAL_INFORMATION.path,
    name: JOURNEY.PERSONAL_INFORMATION.title,
    step: 3,
  },
  {
    path: JOURNEY.WALLET_SETUP.path,
    name: JOURNEY.WALLET_SETUP.title,
    step: 4,
  },
  {
    path: JOURNEY.OTP_VERIFICATION.path,
    name: JOURNEY.OTP_VERIFICATION.title,
    step: 5,
  },
  {
    path: JOURNEY.JOURNEY_COMPLETE.path,
    name: JOURNEY.JOURNEY_COMPLETE.title,
    step: 6,
  },
];

const currentStep = computed(() => {
  const step = journeySteps.find((s) => s.path === route.path);
  return step ? step.step : 1;
});

const currentStepText = computed(() => {
  const step = journeySteps.find((s) => s.path === route.path);
  return step ? step.name : "Welcome";
});

const progressWidth = computed(() => {
  const progress = (currentStep.value / journeySteps.length) * 100;
  return `${Math.min(progress, 100)}%`;
});

const progressText = computed(() => {
  return `${currentStep.value}/${journeySteps.length}`;
});
</script>
