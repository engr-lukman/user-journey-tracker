<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 p-2 sm:p-3">
      <div class="w-full max-w-4xl mx-auto">
        <div class="text-center mb-4">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg"
          >
            <svg
              class="w-5 h-5 text-white"
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
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Device Information
          </h1>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          <Button @click="exportJourneyData" variant="primary"> Export </Button>
          <Button @click="goToHome" variant="secondary"> Home </Button>
        </div>

        <!-- Tab Navigation -->
        <div class="mb-4">
          <div class="flex border-b border-gray-200">
            <button @click="activeTab = 'device'" :class="tabClass('device')">
              Device Data
            </button>
            <button @click="activeTab = 'journey'" :class="tabClass('journey')">
              Journey Data
            </button>
            <button @click="activeTab = 'stats'" :class="tabClass('stats')">
              Stats
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="mb-4">
          <div
            v-if="activeTab === 'stats'"
            class="mb-4 bg-white p-4 rounded-xl shadow border border-gray-200 text-sm"
          >
            <h2 class="text-lg font-semibold text-gray-800 mb-2">
              User & Session Stats
            </h2>
            <div class="text-gray-700 space-y-1">
              <p><strong>Total Unique Users:</strong> {{ stats.userCount }}</p>
              <p>
                <strong>Total Unique Sessions:</strong> {{ stats.sessionCount }}
              </p>
              <p><strong>Sessions Grouped by User:</strong></p>
              <ul class="list-disc list-inside text-xs text-gray-600">
                <li
                  v-for="(sessions, userId) in stats.sessionsByUser"
                  :key="userId"
                >
                  {{ userId }} — {{ sessions.length }} sessions
                </li>
              </ul>
            </div>

            <!-- Journey Reports by Step -->
            <div class="mt-6">
              <h2 class="text-md font-semibold text-gray-800 mb-2">
                Unique Journeys per Step
              </h2>
              <!-- Journey Reports by Step (Table Version) -->
              <div class="mt-6">
                <h2 class="text-md font-semibold text-gray-800 mb-2">
                  Unique Journeys per Step
                </h2>
                <div class="overflow-auto rounded border border-gray-200">
                  <table class="min-w-full text-xs text-left text-gray-700">
                    <thead class="bg-gray-100 border-b text-gray-800">
                      <tr>
                        <th class="px-4 py-2">Event Name</th>
                        <th class="px-4 py-2">Unique Journeys</th>
                        <th class="px-4 py-2">Session/User IDs</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(
                          sessions, step
                        ) in stats.journeyStepsGroupedByStepName"
                        :key="step"
                        class="border-t hover:bg-gray-50"
                      >
                        <td class="px-4 py-2 font-medium">{{ step }}</td>
                        <td class="px-4 py-2">{{ sessions.length }}</td>
                        <td class="px-4 py-2">
                          <div class="flex flex-wrap gap-1">
                            <span
                              v-for="id in sessions"
                              :key="id"
                              class="bg-gray-200 rounded px-2 py-0.5 text-[11px] text-gray-700"
                              :title="id"
                            >
                              {{ id.slice(0, 4) }}...{{ id.slice(-4) }}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Device & Journey Views -->
          <div
            v-else
            class="bg-gray-800 rounded-xl p-2 overflow-auto max-h-[55vh] text-sm font-mono shadow-lg"
          >
            <pre class="text-green-400">{{ currentTabData }}</pre>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

import { API_URL, useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
const { deviceSystemData, journeyStepsData, exportJourneyData } =
  useJourneyTracker();

// --- Tab Navigation ---
const activeTab = ref("device");
const tabClass = (tab) =>
  [
    "px-4 py-2 text-sm font-medium transition-colors",
    activeTab.value === tab
      ? "border-b-2 border-blue-500 text-blue-600"
      : "text-gray-500 hover:text-gray-700",
  ].join(" ");

// --- Tab Content ---
const formattedDeviceData = computed(() =>
  deviceSystemData && Object.keys(deviceSystemData).length
    ? JSON.stringify(deviceSystemData, null, 2)
    : "{}"
);

const formattedJourneyData = computed(() => {
  const steps = journeyStepsData.value;
  const summary = {
    firstStep: steps[0]?.recordedAt || null,
    lastStep: steps.at(-1)?.recordedAt || null,
    duration: steps.length
      ? new Date().getTime() - new Date(steps[0].recordedAt).getTime()
      : 0,
  };

  return JSON.stringify({ totalSteps: steps.length, steps, summary }, null, 2);
});

const currentTabData = computed(() =>
  activeTab.value === "device"
    ? formattedDeviceData.value
    : formattedJourneyData.value
);

// --- Navigation ---
const goToHome = () => {
  router.push(JOURNEY.WELCOME_PAGE.path);
};

// --- Stats Tab ---
const stats = reactive({
  userCount: 0,
  sessionCount: 0,
  sessionsByUser: {},
  journeyStepsGroupedByStepName: [],
});

const fetchStats = async () => {
  const usersRes = await fetch(`${API_URL}/users`);
  const sessionsRes = await fetch(`${API_URL}/sessions`);

  const users = await usersRes.json();
  const sessions = await sessionsRes.json();

  const uniqueUserIds = [...new Set(users.map((u) => u.userId))];
  const uniqueSessionIds = [...new Set(sessions.map((s) => s.sessionId))];

  stats.userCount = uniqueUserIds.length;
  stats.sessionCount = uniqueSessionIds.length;

  const grouped = {};
  sessions.forEach(({ userId, sessionId }) => {
    if (!grouped[userId]) grouped[userId] = new Set();
    grouped[userId].add(sessionId);
  });

  for (const [userId, set] of Object.entries(grouped)) {
    stats.sessionsByUser[userId] = [...set];
  }

  // steps
  const journeyRes = await fetch(`${API_URL}/journeys`);
  const journeyData = await journeyRes.json();
  const stepGrouped = {};

  journeyData.forEach(({ stepName, sessionId }) => {
    if (!stepName || !sessionId) return;

    if (!stepGrouped[stepName]) {
      stepGrouped[stepName] = new Set();
    }

    stepGrouped[stepName].add(sessionId);
  });

  // Convert Set to Array
  const result = {};
  for (const [stepName, sessions] of Object.entries(stepGrouped)) {
    result[stepName] = [...sessions];
  }

  stats.journeyStepsGroupedByStepName = result;
};

onMounted(fetchStats);
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
