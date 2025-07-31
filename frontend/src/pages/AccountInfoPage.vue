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
            class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1
            class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3"
          >
            Account Information
          </h1>
          <p
            class="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 px-1 sm:px-2"
          >
            Tell us a bit about your account info
          </p>
        </div>

        <form
          @submit.prevent="onSubmitHandler"
          class="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 border border-gray-100"
        >
          <div class="space-y-3 sm:space-y-4 md:space-y-6">
            <div class="relative">
              <TextField
                id="businessName"
                v-model="payload.businessName"
                type="text"
                label="Business Name"
                placeholder="Enter your business name"
              />
            </div>

            <div class="relative">
              <TextField
                id="email"
                v-model="payload.email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
              />
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
import { reactive, computed } from "vue";
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

const payload = reactive({
  businessName: "",
  email: "",
});

const isEnabled = computed(
  () => payload.businessName && payload.email && payload.email.includes("@")
);

const goToBack = () => {
  router.push(ROUTES?.WALLET_OTP?.path);
};

const onSubmitHandler = () => {
  saveEventRecord(EVENTS?.ACCOUNT_INFO_SUBMITTED?.eventName, {
    ...EVENTS?.ACCOUNT_INFO_SUBMITTED,
    ...payload,
  });

  router.push(ROUTES?.EMAIL_OTP?.path);
};
</script>
