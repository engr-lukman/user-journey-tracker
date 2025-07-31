<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col"
  >
    <AppHeader />
    <div
      class="flex-1 flex items-start justify-center p-2 sm:p-3 md:p-4 pt-4 sm:pt-6 md:pt-8"
    >
      <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div class="text-center mb-4 sm:mb-6 md:mb-8">
          <div class="relative">
            <div
              class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white"
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
            <div class="absolute inset-0 pointer-events-none">
              <div
                class="absolute top-2 left-4 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full animate-ping"
              ></div>
              <div
                class="absolute top-3 right-6 w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-pink-400 rounded-full animate-ping animation-delay-300"
              ></div>
              <div
                class="absolute bottom-3 left-6 w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-blue-400 rounded-full animate-ping animation-delay-500"
              ></div>
            </div>
          </div>

          <h1
            class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3"
          >
            Congratulations!
          </h1>
          <p
            class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-1 sm:mb-2"
          >
            Your onboarding is complete
          </p>
          <p class="text-xs sm:text-sm md:text-base text-gray-500">
            Account verified successfully
          </p>
        </div>

        <div
          class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 border border-gray-100"
        >
          <div class="flex items-center mb-3 sm:mb-4 md:mb-6">
            <div
              class="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3"
            >
              <svg
                class="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-blue-600"
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
            <h3
              class="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900"
            >
              Onboarding Summary
            </h3>
          </div>

          <div class="space-y-2 sm:space-y-3 md:space-y-4">
            <div
              class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg"
            >
              <span
                class="text-xs sm:text-sm md:text-base font-medium text-gray-600"
                >User ID</span
              >
              <span
                class="text-xs sm:text-sm md:text-base font-mono text-gray-900 bg-white px-1 sm:px-2 py-1 rounded"
              >
                {{ userId?.slice(0, 8) }}...
              </span>
            </div>
            <div
              class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg"
            >
              <span
                class="text-xs sm:text-sm md:text-base font-medium text-gray-600"
                >Completed At</span
              >
              <span class="text-xs sm:text-sm md:text-base text-gray-900">{{
                completedAt
              }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-1 sm:space-y-2">
          <Button @click="viewReports" variant="primary" full-width>
            <span class="text-sm sm:text-base md:text-lg">View Reports</span>
          </Button>

          <Button @click="goToBack" variant="text" full-width>
            <span class="text-sm sm:text-base md:text-lg">Back to Home</span>
          </Button>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

import { useTracker } from "@/composables/useTracker";
import { ROUTES } from "@/constants/routes";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
const { userId } = useTracker();

const completedAt = computed(() => new Date().toLocaleString());

const viewReports = async () => {
  router.push(ROUTES?.REPORTS?.path);
};

const goToBack = () => {
  router.push(ROUTES?.WELCOME_PAGE?.path);
};
</script>
