<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-md">
        <!-- Welcome Hero Card -->
        <div
          class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-gray-100"
        >
          <!-- Icon -->
          <div
            class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8 text-white"
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

          <!-- Content -->
          <h1
            class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            Welcome to Your Journey
          </h1>
          <p
            class="text-xs sm:text-sm md:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2"
          >
            Discover our comprehensive user experience tracking system. Navigate
            through personalized steps while we securely analyze your
            interactions for valuable insights.
          </p>

          <!-- CTA Button -->
          <Button @click="startJourney" variant="primary" full-width>
            Start Your Journey
          </Button>

          <!-- Trust Badge -->
          <div
            class="mt-4 sm:mt-6 flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500"
          >
            <svg
              class="w-3 h-3 sm:w-4 sm:h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Privacy Protected & Secure</span>
          </div>
        </div>

        <!-- Features -->
        <div class="mt-4 sm:mt-6 grid grid-cols-3 gap-3 sm:gap-4 text-center">
          <div
            class="bg-white/60 backdrop-blur rounded-xl p-3 sm:p-4 border border-gray-100"
          >
            <div
              class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center"
            >
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-xs font-medium text-gray-700">Secure</p>
          </div>
          <div
            class="bg-white/60 backdrop-blur rounded-xl p-3 sm:p-4 border border-gray-100"
          >
            <div
              class="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center"
            >
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <p class="text-xs font-medium text-gray-700">Fast</p>
          </div>
          <div
            class="bg-white/60 backdrop-blur rounded-xl p-3 sm:p-4 border border-gray-100"
          >
            <div
              class="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center"
            >
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <p class="text-xs font-medium text-gray-700">Analytics</p>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
const { recordJourneyStep } = useJourneyTracker();

onMounted(async () => {
  recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.PAGE_VIEWED);
});

const startJourney = () => {
  recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.GET_STARTED_CLICKED);
  router.push(JOURNEY.TERMS_CONDITIONS.path);
};
</script>
