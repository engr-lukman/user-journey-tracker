<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <div class="flex-1 p-4 sm:p-6">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-6">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Wallet Setup
          </h1>
        </div>

        <div class="bg-pink-100 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <div
              class="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center mr-3"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Digital Wallet</h3>
              <p class="text-sm text-gray-600">Link your mobile number</p>
            </div>
          </div>
        </div>

        <form
          @submit.prevent="submitMobileWalletInfo"
          class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4"
        >
          <div>
            <label
              for="mobileNumber"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Mobile Number</label
            >
            <input
              id="mobileNumber"
              type="tel"
              v-model="mobileNumber"
              maxlength="11"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter mobile number (11 digits)"
            />
          </div>

          <div
            class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4"
          >
            <button
              type="button"
              @click="goBackToUserInfo"
              class="w-full sm:flex-1 bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
            >
              Back
            </button>
            <button
              type="submit"
              class="w-full sm:flex-1 bg-pink-600 text-white font-medium py-3 px-4 rounded-md hover:bg-pink-700 transition-colors text-sm sm:text-base"
            >
              Continue
            </button>
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

const router = useRouter();
const { recordJourneyStep, saveUserInformation } = useJourneyTracker();

const mobileNumber = ref("");

onMounted(() => {
  recordJourneyStep(JOURNEY.WALLET.steps.PAGE_VIEWED);
});

const goBackToUserInfo = () => {
  recordJourneyStep(JOURNEY.WALLET.steps.BACK_CLICKED);
  router.push(JOURNEY.USER_INFO.path);
};

const submitMobileWalletInfo = () => {
  saveUserInformation({
    walletInformation: {
      mobileNumber: mobileNumber.value,
    },
  });
  recordJourneyStep(JOURNEY.WALLET.steps.INFO_SUBMITTED);
  router.push(JOURNEY.OTP.path);
};
</script>
