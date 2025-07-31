<template>
  <div
    class="min-h-screen bg-gradient-to </div> </div>a-white t </Button> </div> </div>x-col"
  >
    <AppHeader />
    <div
      class="flex-1 flex items-start justify-center p-2 sm:p-3 md:p-4 pt-4 sm:pt-6 md:pt-8"
    >
      <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div
          class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 text-center border border-gray-100"
        >
          <div
            class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center"
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
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h1
            class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3"
          >
            Welcome to Your Journey
          </h1>
          <p
            class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-2 sm:mb-3 md:mb-4 leading-relaxed px-1 sm:px-2 text-justify"
          >
            Experience our advanced
            <span class="font-semibold text-blue-600"
              >user journey tracking</span
            >
            system that captures detailed
            <span class="font-semibold text-green-600"
              >device fingerprinting</span
            >
            and
            <span class="font-semibold text-purple-600"
              >behavioral analytics</span
            >. Our
            <span class="font-semibold text-orange-600"
              >client-side solution</span
            >
            collects comprehensive data including browser information and
            hardware specifications.
          </p>

          <p
            class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-2 sm:mb-3 md:mb-4 leading-relaxed px-1 sm:px-2 text-justify"
          >
            Navigate through our
            <span class="font-semibold text-red-600">multi-step journey</span>
            while we demonstrate real-time
            <span class="font-semibold text-indigo-600">data collection</span>
            capabilities. Track network details and user interactions for
            research and development purposes.
          </p>

          <p
            class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 md:mb-5 leading-relaxed px-1 sm:px-2 text-justify"
          >
            All collected data remains
            <span class="font-semibold text-teal-600">locally processed</span>
            and can be exported for comprehensive analysis and insights.
          </p>

          <div class="space-y-1 sm:space-y-2">
            <Button @click="startOnboarding" variant="primary" full-width>
              <span class="text-sm sm:text-base md:text-lg"
                >Start Onboarding</span
              >
            </Button>

            <Button @click="viewReports" variant="secondary" full-width>
              <span class="text-sm sm:text-base md:text-lg">View Reports</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";
import { ROUTES } from "@/constants/routes";

const router = useRouter();

const startOnboarding = async () => {
  router.push(ROUTES?.WALLET_NUMBER?.path);
};

const viewReports = async () => {
  router.push(ROUTES?.REPORTS?.path);
};
</script>
