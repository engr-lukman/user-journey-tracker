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
            <Checkbox
              v-model="termsAgreed"
              label="I agree to the Terms & Conditions"
            />
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
        >
          <Button
            @click="goBackToHome"
            variant="secondary"
            :full-width="true"
            class="sm:flex-1"
          >
            Back
          </Button>
          <Button
            @click="acceptTermsAndContinue"
            :disabled="!canProceedToNext"
            variant="primary"
            :full-width="true"
            class="sm:flex-1"
          >
            Continue
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
