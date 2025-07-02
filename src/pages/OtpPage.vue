<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-sm">
        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-white"
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
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Enter Verification Code
          </h1>
          <p class="text-gray-600 text-base">
            We've sent a 6-digit code to your mobile number
          </p>
        </div>

        <!-- OTP Form Card -->
        <form
          @submit.prevent="verifyOtp"
          class="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
        >
          <div class="relative">
            <TextField
              v-model="otpCode"
              type="text"
              label="Verification Code"
              placeholder="000000"
              maxlength="6"
              variant="otp"
              required
            />
            <div class="mt-3 text-center">
              <p class="text-xs text-gray-500">
                Enter the 6-digit code sent to your phone
              </p>
            </div>
          </div>

          <!-- Verify Button -->
          <Button
            type="submit"
            variant="primary"
            full-width
            :disabled="otpCode.length !== 6"
          >
            Verify Code
          </Button>

          <!-- Resend Button -->
          <div class="text-center">
            <Button
              type="button"
              variant="text"
              @click="resendOtp"
              class="text-sm"
            >
              Didn't receive the code? Resend
            </Button>
          </div>
        </form>

        <!-- Back Option -->
        <div class="mt-2 text-center">
          <Button
            type="button"
            variant="text"
            @click="goBack"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Wallet Setup
          </Button>
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
import Button from "@/components/ui/Button.vue";
import TextField from "@/components/ui/TextField.vue";

const router = useRouter();
const { recordJourneyStep } = useJourneyTracker();

const otpCode = ref("");

onMounted(() => {
  recordJourneyStep(JOURNEY.OTP_VERIFICATION.steps.PAGE_VIEWED);
});

const verifyOtp = () => {
  if (otpCode.value.length === 6) {
    recordJourneyStep(JOURNEY.OTP_VERIFICATION.steps.CODE_ENTERED, {
      otpLength: otpCode.value.length,
    });
    router.push(JOURNEY.JOURNEY_COMPLETE.path);
  }
};

const resendOtp = () => {
  recordJourneyStep(JOURNEY.OTP_VERIFICATION.steps.RESEND_REQUESTED);
  // In a real app, this would trigger a new OTP
};

const goBack = () => {
  recordJourneyStep(JOURNEY.OTP_VERIFICATION.steps.BACK_CLICKED);
  router.push(JOURNEY.WALLET_SETUP.path);
};
</script>
