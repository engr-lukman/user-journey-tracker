<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <div class="flex-1 p-4 sm:p-6">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-6">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Personal Information
          </h1>
        </div>

      <form
        @submit.prevent="submitUserForm"
        class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4"
      >
        <div>
          <label
            for="userFullName"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Full Name</label
          >
          <input
            id="userFullName"
            type="text"
            v-model="userForm.fullName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            for="userEmail"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email Address</label
          >
          <input
            id="userEmail"
            type="email"
            v-model="userForm.email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your email address"
          />
        </div>

        <div
          class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4"
        >
          <button
            type="button"
            @click="goBackToTerms"
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
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker.js";
import { JOURNEY_STEPS } from "@/constants/journeySteps.js";
import { ROUTES } from "@/constants/routes.js";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";

const router = useRouter();
const { recordJourneyStep, saveUserInformation } = useJourneyTracker();

const userForm = reactive({
  fullName: "",
  email: "",
});

onMounted(() => {
  recordJourneyStep(JOURNEY_STEPS.USER_FORM_PAGE_VIEWED);
});

const goBackToTerms = () => {
  recordJourneyStep(JOURNEY_STEPS.USER_FORM_BACK_BUTTON_CLICKED);
  router.push(ROUTES.TERMS.path);
};

const submitUserForm = () => {
  saveUserInformation({ personalInformation: { ...userForm } });
  recordJourneyStep(JOURNEY_STEPS.USER_FORM_SUBMITTED);
  router.push(ROUTES.WALLET.path);
};
</script>
