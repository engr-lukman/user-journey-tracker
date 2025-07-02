<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 p-4 sm:p-6">
      <div class="w-full max-w-md mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-white"
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
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Terms & Conditions
          </h1>
          <p class="text-gray-600">
            Please review and accept our terms to continue
          </p>
        </div>

        <!-- Terms Content -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-100"
        >
          <h3
            class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
          >
            <svg
              class="w-5 h-5 text-blue-600 mr-2"
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
          <div class="text-sm text-gray-600 space-y-4">
            <p class="leading-relaxed">
              By using our service, you agree to the following terms:
            </p>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div class="flex items-start space-x-3">
                <div
                  class="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"
                ></div>
                <span
                  >Data collection for service improvement and analytics</span
                >
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"
                ></div>
                <span>Privacy protection according to industry standards</span>
              </div>
              <div class="flex items-start space-x-3">
                <div
                  class="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"
                ></div>
                <span>Responsible usage and compliance with policies</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Agreement Checkbox -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <Checkbox
            v-model="termsAgreed"
            label="I have read and agree to the Terms & Conditions"
            size="lg"
          />
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
        >
          <Button
            @click="goBackToHome"
            variant="secondary"
            full-width
            size="lg"
            class="sm:flex-1"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
          <Button
            @click="acceptTermsAndContinue"
            :disabled="!canProceedToNext"
            variant="primary"
            full-width
            size="lg"
            class="sm:flex-1"
          >
            Continue
            <svg
              class="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
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
</script>
