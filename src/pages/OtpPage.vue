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
          <TextField
            v-model="otpCode"
            type="text"
            label="Verification Code"
            placeholder="000000"
            maxlength="6"
            variant="otp"
            required
          />

          <Button
            type="submit"
            variant="primary"
            full-width
            :disabled="otpCode.length !== 6"
          >
            Verify OTP
          </Button>

          <Button
            type="button"
            variant="text"
            full-width
            @click="resendOtp"
            class="py-2 text-sm"
          >
            Resend Code
          </Button>
        </form>

        <div class="mt-6 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="text"
            full-width
            @click="goBack"
            class="py-2 text-sm"
          >
            ← Back to Wallet
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
