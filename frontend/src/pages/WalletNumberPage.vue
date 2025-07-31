<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div
      class="flex-1 flex items-start justify-center p-2 sm:p-3 md:p-4 pt-4 sm:pt-6 md:pt-8"
    >
      <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div class="text-center mb-3 sm:mb-4 md:mb-6">
          <div
            class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center"
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
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1
            class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3"
          >
            Wallet Setup
          </h1>
          <p class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
            Connect your mobile wallet for secure transactions
          </p>
        </div>

        <div
          class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 border border-blue-100"
        >
          <div class="flex items-center">
            <div
              class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0"
            >
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white"
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
              <h3
                class="font-semibold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl"
              >
                Digital Wallet
              </h3>
              <p
                class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600"
              >
                Link your mobile number for secure payments
              </p>
            </div>
          </div>
        </div>

        <form
          @submit.prevent="onSubmitHandler"
          class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 border border-gray-100"
        >
          <div class="relative">
            <TextField
              id="walletNumber"
              v-model="walletNumber"
              label="Wallet Number"
              placeholder="Enter wallet number (11 digits)"
              maxlength="11"
            />
            <div
              class="mt-1 sm:mt-2 flex items-center text-xs sm:text-sm md:text-base text-gray-500"
            >
              <svg
                class="w-2 h-2 sm:w-3 sm:h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              Your number will be verified via SMS
            </div>
          </div>

          <div
            class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 md:space-x-4 pt-3 sm:pt-4 md:pt-6"
          >
            <Button
              variant="secondary"
              full-width
              @click="goToBack"
              class="sm:flex-1"
            >
              <span class="text-sm sm:text-base md:text-lg">Back</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              full-width
              class="sm:flex-1"
              :disabled="!isEnabled"
            >
              <span class="text-sm sm:text-base md:text-lg">Continue</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { useTracker } from "@/composables/useTracker";
import { EVENTS } from "@/constants/events";
import { ROUTES } from "@/constants/routes";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";
import TextField from "@/components/ui/TextField.vue";

const router = useRouter();
const { saveEventRecord } = useTracker();

const walletNumber = ref("");
const isEnabled = computed(() => walletNumber?.value?.length === 11);

const goToBack = () => {
  router.push(ROUTES?.WELCOME_PAGE?.path);
};

const onSubmitHandler = () => {
  saveEventRecord(EVENTS?.WALLET_NUMBER_SUBMITTED?.eventName, {
    ...EVENTS?.WALLET_NUMBER_SUBMITTED,
    walletNumber: walletNumber.value,
  });

  router.push(ROUTES?.WALLET_OTP?.path);
};
</script>
