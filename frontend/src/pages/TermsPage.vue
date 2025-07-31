<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div
      class="flex-1 flex items-start justify-center p-2 sm:p-3 md:p-4 pt-4 sm:pt-6 md:pt-8"
    >
      <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div class="text-center mb-4">
          <div
            class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1
            class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3"
          >
            Terms & Conditions
          </h1>
          <p class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
            Please review and accept our terms to continue
          </p>
        </div>

        <div
          class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 border border-gray-100"
        >
          <h3
            class="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center"
          >
            <svg
              class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 mr-1 sm:mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            Service Agreement
          </h3>
          <div
            class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 space-y-2 sm:space-y-3 md:space-y-4"
          >
            <p class="leading-relaxed px-1 sm:px-2">
              By using our service, you agree to the following terms:
            </p>
            <div
              class="bg-gray-50 rounded-lg p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2"
            >
              <div class="flex items-start space-x-2 sm:space-x-3">
                <div
                  class="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-500 rounded-full mt-1 sm:mt-2 flex-shrink-0"
                ></div>
                <span class="text-xs sm:text-sm md:text-base lg:text-lg"
                  >Data collection for service improvement and analytics</span
                >
              </div>
              <div class="flex items-start space-x-2 sm:space-x-3">
                <div
                  class="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-500 rounded-full mt-1 sm:mt-2 flex-shrink-0"
                ></div>
                <span class="text-xs sm:text-sm md:text-base lg:text-lg"
                  >Privacy protection according to industry standards</span
                >
              </div>
              <div class="flex items-start space-x-2 sm:space-x-3">
                <div
                  class="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-500 rounded-full mt-1 sm:mt-2 flex-shrink-0"
                ></div>
                <span class="text-xs sm:text-sm md:text-base lg:text-lg"
                  >Responsible usage and compliance with policies</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4 sm:mb-6 md:mb-8">
          <Checkbox
            v-model="termsAgreed"
            label="I have read and agree to the Terms & Conditions"
            size="md"
            @change="acceptTermsAndConditionsClick"
          />
        </div>

        <div
          class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 md:space-x-4"
        >
          <Button
            @click="goBackToHome"
            variant="secondary"
            full-width
            class="sm:flex-1"
          >
            <span class="text-sm sm:text-base md:text-lg">Back</span>
          </Button>
          <Button
            @click="acceptTermsAndContinue"
            :disabled="!canProceedToNext"
            variant="primary"
            full-width
            class="sm:flex-1"
          >
            <span class="text-sm sm:text-base md:text-lg">Continue</span>
          </Button>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";
import Checkbox from "@/components/ui/Checkbox.vue";

const router = useRouter();
const { recordJourneyStep, saveUserInformation } = useJourneyTracker();

const termsAgreed = ref(false);

const canProceedToNext = computed(() => termsAgreed.value);

onMounted(() => {
  recordJourneyStep(JOURNEY.TERMS_CONDITIONS.steps.PAGE_VIEWED);
});

const goBackToHome = () => {
  recordJourneyStep(JOURNEY.TERMS_CONDITIONS.steps.BACK_CLICKED);
  router.push(JOURNEY.WELCOME_PAGE.path);
};

const acceptTermsAndContinue = () => {
  if (!canProceedToNext.value) return;
  saveUserInformation({
    termsAndConditions: {
      termsAccepted: termsAgreed.value,
      acceptedAt: new Date().toISOString(),
    },
  });
  recordJourneyStep(JOURNEY.TERMS_CONDITIONS.steps.ACCEPTED);
  router.push(JOURNEY.PERSONAL_INFORMATION.path);
};

const acceptTermsAndConditionsClick = () => {
  recordJourneyStep(JOURNEY.TERMS_CONDITIONS.steps.CLICK);
};
</script>
