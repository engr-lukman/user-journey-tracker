<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <div class="text-center mb-6">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Enter OTP
          </h1>
          <p class="text-gray-600 text-sm">
            We've sent a verification code to your phone
          </p>
        </div>

        <form @submit.prevent="verifyOtp" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              v-model="otpCode"
              type="text"
              maxlength="6"
              placeholder="000000"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-center text-lg tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="otpCode.length !== 6"
            class="w-full bg-pink-600 text-white font-medium py-2 px-4 rounded-md hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            Verify OTP
          </button>

          <button
            type="button"
            @click="resendOtp"
            class="w-full text-pink-600 hover:text-pink-700 font-medium py-2 text-sm"
          >
            Resend Code
          </button>
        </form>

        <div class="mt-6 pt-4 border-t border-gray-200">
          <button
            @click="goBack"
            class="w-full text-gray-600 hover:text-gray-700 font-medium py-2 text-sm"
          >
            ← Back to Wallet
          </button>
        </div>
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
const { recordJourneyStep } = useJourneyTracker();

const otpCode = ref("");

onMounted(() => {
  recordJourneyStep(JOURNEY.OTP.steps.PAGE_VIEWED);
});

const verifyOtp = () => {
  if (otpCode.value.length === 6) {
    recordJourneyStep(JOURNEY.OTP.steps.VERIFICATION_ATTEMPTED, {
      otpLength: otpCode.value.length,
    });
    router.push(JOURNEY.VERIFICATION.path);
  }
};

const resendOtp = () => {
  recordJourneyStep(JOURNEY.OTP.steps.RESEND_REQUESTED);
  // In a real app, this would trigger a new OTP
  alert("OTP resent successfully!");
};

const goBack = () => {
  recordJourneyStep(JOURNEY.OTP.steps.BACK_CLICKED);
  router.push(JOURNEY.WALLET.path);
};
</script>
