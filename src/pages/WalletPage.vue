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
            class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
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
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Wallet Setup
          </h1>
          <p class="text-sm text-gray-600">
            Connect your mobile wallet for secure transactions
          </p>
        </div>

        <!-- Info Card -->
        <div
          class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100"
        >
          <div class="flex items-center">
            <div
              class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-base sm:text-lg">
                Digital Wallet
              </h3>
              <p class="text-xs sm:text-sm text-gray-600">
                Link your mobile number for secure payments
              </p>
            </div>
          </div>
        </div>

        <!-- Form Card -->
        <form
          @submit.prevent="submitMobileWalletInfo"
          class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 border border-gray-100"
        >
          <div class="relative">
            <TextField
              id="walletNumber"
              v-model="walletNumber"
              type="tel"
              label="Wallet Number"
              placeholder="Enter wallet number (11 digits)"
              maxlength="11"
            />
            <div class="mt-2 flex items-center text-xs text-gray-500">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              Your number will be verified via SMS
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6"
          >
            <Button
              type="button"
              variant="secondary"
              full-width
              @click="goBackToUserInfo"
              class="sm:flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              full-width
              class="sm:flex-1"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";
import TextField from "@/components/ui/TextField.vue";

const router = useRouter();
const { recordJourneyStep, saveUserInformation } = useJourneyTracker();

const walletNumber = ref("");

onMounted(() => {
  recordJourneyStep(JOURNEY.WALLET_SETUP.steps.PAGE_VIEWED);
});

const goBackToUserInfo = () => {
  recordJourneyStep(JOURNEY.WALLET_SETUP.steps.BACK_CLICKED);
  router.push(JOURNEY.PERSONAL_INFORMATION.path);
};

const submitMobileWalletInfo = () => {
  saveUserInformation({
    walletInformation: {
      walletNumber: walletNumber.value,
    },
  });
  recordJourneyStep(JOURNEY.WALLET_SETUP.steps.MOBILE_NUMBER_SUBMITTED);
  router.push(JOURNEY.OTP_VERIFICATION.path);
};
</script>
