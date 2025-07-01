<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            Debug: Fingerprinting Data
          </h1>
          <div class="flex gap-2">
            <button
              @click="refreshData"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Refresh Data
            </button>
            <button
              @click="exportData"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Export JSON
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-600">Collecting fingerprint data...</p>
        </div>

        <div v-else class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold text-blue-900 mb-1">User ID</h3>
              <p class="text-sm text-blue-700 font-mono break-all">
                {{ currentUserId }}
              </p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold text-green-900 mb-1">Session ID</h3>
              <p class="text-sm text-green-700 font-mono break-all">
                {{ currentSessionId }}
              </p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold text-purple-900 mb-1">Browser</h3>
              <p class="text-sm text-purple-700">
                {{ systemData?.browserInformation?.browserName }}
                {{ systemData?.browserInformation?.browserVersion }}
              </p>
            </div>
            <div class="bg-orange-50 p-4 rounded-lg">
              <h3 class="font-semibold text-orange-900 mb-1">OS</h3>
              <p class="text-sm text-orange-700">
                {{ systemData?.systemInformation?.operatingSystem }}
              </p>
            </div>
          </div>

          <!-- Expandable Sections -->
          <div class="space-y-4">
            <DebugSection
              v-for="(section, key) in fingerprintSections"
              :key="key"
              :title="section.title"
              :data="section.data"
              :icon="section.icon"
            />
          </div>

          <!-- Journey Steps -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
              <span class="mr-2">📊</span>
              Journey Steps ({{ journeySteps.length }})
            </h3>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <div
                v-for="step in journeySteps"
                :key="step.recordedAt"
                class="text-sm bg-white p-2 rounded border"
              >
                <div class="font-mono text-xs text-gray-500">
                  {{ step.recordedAt }}
                </div>
                <div class="font-medium">{{ step.stepName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useJourneyTracker } from "@/composables/useJourneyTracker.js";

// Component for expandable debug sections
const DebugSection = {
  props: ["title", "data", "icon"],
  setup(props) {
    const isExpanded = ref(false);

    return {
      isExpanded,
      toggle: () => (isExpanded.value = !isExpanded.value),
      formatData: (data) => JSON.stringify(data, null, 2),
    };
  },
  template: `
    <div class="border border-gray-200 rounded-lg">
      <button 
        @click="toggle"
        class="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div class="flex items-center">
          <span class="mr-2">{{ icon }}</span>
          <span class="font-semibold">{{ title }}</span>
        </div>
        <svg 
          :class="{'rotate-180': isExpanded}" 
          class="w-5 h-5 transform transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div v-if="isExpanded" class="border-t border-gray-200 p-4 bg-gray-50">
        <pre class="text-xs overflow-auto bg-white p-3 rounded border max-h-80">{{ formatData(data) }}</pre>
      </div>
    </div>
  `,
};

const {
  currentUserId,
  currentSessionId,
  deviceSystemData,
  journeyStepsData,
  initializeJourneyTracker,
  recordJourneyStep,
  exportJourneyData,
} = useJourneyTracker();

const loading = ref(true);
const systemData = ref({});

const journeySteps = computed(() => journeyStepsData.value);

const fingerprintSections = computed(() => {
  if (!systemData.value) return [];

  return [
    {
      title: "System Information",
      icon: "🧠",
      data: systemData.value.systemInformation || {},
    },
    {
      title: "Browser Information",
      icon: "🌐",
      data: systemData.value.browserInformation || {},
    },
    {
      title: "Display & Input",
      icon: "📱",
      data: systemData.value.displayAndInput || {},
    },
    {
      title: "Locale & Language",
      icon: "🌍",
      data: systemData.value.localeAndLanguage || {},
    },
    {
      title: "Security & Privacy",
      icon: "🔐",
      data: systemData.value.securityAndPrivacy || {},
    },
    {
      title: "Rendering & Behavior",
      icon: "🧪",
      data: systemData.value.renderingAndBehavior || {},
    },
    {
      title: "Session Metadata",
      icon: "📋",
      data: systemData.value.sessionMetadata || {},
    },
    {
      title: "Network Connection",
      icon: "📡",
      data: systemData.value.networkConnection || {},
    },
    {
      title: "Battery Status",
      icon: "🔋",
      data: systemData.value.batteryStatus || {},
    },
  ].filter((section) => Object.keys(section.data).length > 0);
});

const refreshData = async () => {
  loading.value = true;
  await initializeJourneyTracker();
  systemData.value = { ...deviceSystemData };
  recordJourneyStep("debug_page_data_refreshed");
  loading.value = false;
};

const exportData = () => {
  exportJourneyData();
  recordJourneyStep("debug_page_data_exported");
};

onMounted(async () => {
  await refreshData();
  recordJourneyStep("debug_page_viewed");
});
</script>
