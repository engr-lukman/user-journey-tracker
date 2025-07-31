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
        <span class="font-medium truncate">{{
          currentStepText || "Unknown Step"
        }}</span>
        <span class="flex-shrink-0 ml-2">{{ progressText || "0/0" }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import { EVENTS } from "@/constants/events";
import { ROUTES } from "@/constants/routes";

const route = useRoute();

const routeArray = Object.values(ROUTES);

const currentStep = computed(() => {
  const step = routeArray?.filter((s) => s.path === route.path)[0];
  return step ? step.sl : 1;
});

const currentStepText = computed(() => {
  const step = routeArray?.filter((s) => s.path === route.path)[0];
  return step ? step.title : "Welcome";
});

const progressWidth = computed(() => {
  const progress = (currentStep.value / 8) * 100;
  return `${Math.min(progress, 100)}%`;
});

const progressText = computed(() => {
  return `${currentStep.value}/8`;
});
</script>
