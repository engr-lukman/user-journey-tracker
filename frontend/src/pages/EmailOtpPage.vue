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
            class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center"
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1
            class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3"
          >
            Enter OTP Code
          </h1>
          <p class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
            We've sent a 6-digit code to your email
          </p>
        </div>

        <form
          @submit.prevent="onSubmitHandler"
          class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 border border-gray-100"
        >
          <div class="relative">
            <TextField
              v-model="EmailOTP"
              type="text"
              label="Email OTP"
              placeholder="Enter 6-digit OTP"
              maxlength="6"
              variant="otp"
            />
            <div class="mt-1 sm:mt-2 md:mt-3 text-center">
              <p class="text-xs sm:text-sm md:text-base text-gray-500">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            full-width
            :disabled="!isEnabled"
          >
            <span class="text-sm sm:text-base md:text-lg">Verify Code</span>
          </Button>

          <div class="text-center">
            <Button
              variant="text"
              @click="onResendOtp"
              class="text-xs sm:text-sm md:text-base"
            >
              Didn't receive the code? Resend
            </Button>
          </div>
        </form>

        <div class="mt-1 sm:mt-2 text-center">
          <Button
            variant="text"
            @click="goToBack"
            class="text-xs sm:text-sm md:text-base text-gray-500 hover:text-gray-700"
          >
            Back to Account Info
          </Button>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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

const EmailOTP = ref("");
const isEnabled = computed(() => EmailOTP.value.length === 6);

const goToBack = () => {
  router.push(ROUTES?.ACCOUNT_INFO?.path);
};

const onResendOtp = () => {
  console.log("Resend OTP clicked");
};

const onSubmitHandler = () => {
  saveEventRecord(EVENTS?.EMAIL_OTP_VERIFIED?.NAME, {
    ...EVENTS?.EMAIL_OTP_VERIFIED,
    emailOtp: EmailOTP.value,
  });

  router.push(ROUTES?.PASSWORD?.path);
};
</script>
