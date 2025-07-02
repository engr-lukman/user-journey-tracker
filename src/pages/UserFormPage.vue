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
          <TextField
            id="userFullName"
            v-model="userForm.fullName"
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
          />

          <TextField
            id="userEmail"
            v-model="userForm.email"
            type="email"
            label="Email Address"
            placeholder="Enter your email address"
          />

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
import TextField from "@/components/ui/TextField.vue";

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
