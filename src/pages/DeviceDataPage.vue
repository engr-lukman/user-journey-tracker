<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 p-4 sm:p-6">
      <div class="w-full max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-8">
          <div
            class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
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
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Device Information
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            This page shows detailed information about your device, browser, and
            system configuration. All data is collected client-side and never
            sent to any server.
          </p>
        </div>

        <!-- Main Content -->
        <div class="mb-8">
          <div class="flex gap-4 mb-6 flex-wrap justify-center">
            <Button
              @click="activeTab = 'browser'"
              :variant="activeTab === 'browser' ? 'primary' : 'secondary'"
            >
              Browser
            </Button>
            <Button
              @click="activeTab = 'device'"
              :variant="activeTab === 'device' ? 'primary' : 'secondary'"
            >
              Device
            </Button>
            <Button
              @click="activeTab = 'hardware'"
              :variant="activeTab === 'hardware' ? 'primary' : 'secondary'"
            >
              Hardware
            </Button>
            <Button
              @click="activeTab = 'display'"
              :variant="activeTab === 'display' ? 'primary' : 'secondary'"
            >
              Display
            </Button>
            <Button
              @click="activeTab = 'network'"
              :variant="activeTab === 'network' ? 'primary' : 'secondary'"
            >
              Network
            </Button>
            <Button
              @click="activeTab = 'storage'"
              :variant="activeTab === 'storage' ? 'primary' : 'secondary'"
            >
              Storage
            </Button>
            <Button
              @click="activeTab = 'fingerprint'"
              :variant="activeTab === 'fingerprint' ? 'primary' : 'secondary'"
            >
              Fingerprint
            </Button>
          </div>

          <!-- JSON Viewer -->
          <div
            class="bg-gray-800 rounded-xl p-4 overflow-auto max-h-[60vh] text-sm font-mono shadow-lg"
          >
            <pre class="text-green-400">{{ formattedJson }}</pre>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button @click="exportJourneyData" variant="primary">
            Export All Data
          </Button>
          <Button @click="goToHome" variant="secondary"> Back to Home </Button>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
const activeTab = ref("browser");

const { deviceSystemData, exportJourneyData, recordJourneyStep } =
  useJourneyTracker();

// Record this page view
onMounted(async () => {
  await recordJourneyStep("device_data_page_viewed", {
    timestamp: new Date().toISOString(),
  });
});

// Function to format the JSON data based on the active tab
const formattedJson = computed(() => {
  if (!deviceSystemData) return "{}";

  let data = {};

  switch (activeTab.value) {
    case "browser":
      data = deviceSystemData.browserInfo || {};
      break;
    case "device":
      data = deviceSystemData.deviceInfo || {};
      break;
    case "hardware":
      data = deviceSystemData.hardwareInfo || {};
      break;
    case "display":
      data = deviceSystemData.displayInfo || {};
      break;
    case "network":
      data = deviceSystemData.networkInfo || {};
      break;
    case "storage":
      data = deviceSystemData.storageInfo || {};
      break;
    case "fingerprint":
      data = deviceSystemData.fingerprintInfo || {};
      break;
    default:
      data = deviceSystemData.browserInfo || {};
  }

  return JSON.stringify(data, null, 2);
});

// Navigation
const goToHome = () => {
  router.push(JOURNEY.WELCOME_PAGE.path);
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
