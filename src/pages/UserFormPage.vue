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
            <Button
              type="button"
              variant="secondary"
              full-width
              @click="goBackToTerms"
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
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
const { recordJourneyStep, saveUserInformation } = useJourneyTracker();

const userForm = reactive({
  fullName: "",
  email: "",
});

onMounted(() => {
  recordJourneyStep(JOURNEY.PERSONAL_INFORMATION.steps.PAGE_VIEWED);
});

const goBackToTerms = () => {
  recordJourneyStep(JOURNEY.PERSONAL_INFORMATION.steps.BACK_CLICKED);
  router.push(JOURNEY.TERMS_CONDITIONS.path);
};

const submitUserForm = () => {
  saveUserInformation({ personalInformation: { ...userForm } });
  recordJourneyStep(JOURNEY.PERSONAL_INFORMATION.steps.FORM_SUBMITTED);
  router.push(JOURNEY.WALLET_SETUP.path);
};
</script>
