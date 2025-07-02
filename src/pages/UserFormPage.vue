<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 p-4 sm:p-6">
      <div class="w-full max-w-md mx-auto">
        <!-- Header -->
        <div class="text-center mb-6 sm:mb-8">
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
            class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
          >
            Personal Information
          </h1>
          <p class="text-sm sm:text-base text-gray-600 px-4">
            Tell us a bit about yourself to personalize your experience
          </p>
        </div>

        <!-- Form Card -->
        <form
          @submit.prevent="submitUserForm"
          class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 border border-gray-100"
        >
          <div class="space-y-6">
            <div class="relative">
              <TextField
                id="userFullName"
                v-model="userForm.fullName"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                size="lg"
              />
            </div>

            <div class="relative">
              <TextField
                id="userEmail"
                v-model="userForm.email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                size="lg"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6"
          >
            <Button
              type="button"
              variant="secondary"
              full-width
              size="lg"
              @click="goBackToTerms"
              class="sm:flex-1"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              full-width
              size="lg"
              class="sm:flex-1"
            >
              Continue
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
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
