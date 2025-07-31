<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />
    <div class="flex-1 p-2 sm:p-3">
      <div class="w-full max-w-4xl mx-auto">
        <!-- Title -->
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
            Analytical Reports
          </h1>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          <Button @click="goToBack" variant="primary">Home</Button>
        </div>

        <!-- Tabs -->
        <div class="mb-4">
          <div class="flex border-b border-gray-200">
            <button @click="activeTab = 'system'" :class="tabClass('system')">
              System Data
            </button>
            <button @click="activeTab = 'stats'" :class="tabClass('stats')">
              Stats
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="mb-4">
          <!-- Stats Tab -->
          <div
            v-if="activeTab === 'stats'"
            class="mb-4 bg-white p-4 rounded-xl shadow border border-gray-200 text-sm"
          >
            <h2 class="text-lg font-semibold text-gray-800 mb-2">
              Statistics Overview
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
                  {{ truncateId(userId) }} — {{ sessions.length }} sessions
                </li>
              </ul>
            </div>

            <!-- User Journey Table -->
            <div class="mt-10">
              <h2 class="text-md font-semibold text-gray-800 mb-2">
                User Journeys per Step
              </h2>
              <div class="overflow-auto rounded border border-gray-200">
                <table class="min-w-full text-xs text-left text-gray-700">
                  <thead class="bg-gray-100 border-b text-gray-800">
                    <tr>
                      <th class="px-4 py-2">Event Name</th>
                      <th class="px-4 py-2">Unique Users</th>
                      <th class="px-4 py-2">Sessions by User</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(
                        userSessions, stepName
                      ) in stats.userJourneysByStep"
                      :key="stepName"
                      class="border-t hover:bg-gray-50"
                    >
                      <td class="px-4 py-2 font-medium">{{ stepName }}</td>
                      <td class="px-4 py-2">
                        {{ Object.keys(userSessions).length }}
                      </td>
                      <td class="px-4 py-2">
                        <button
                          class="text-blue-600 underline text-xs cursor-pointer"
                          @click="openSessionModal(stepName)"
                        >
                          {{ totalSessions(userSessions) }} sessions
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Device & Journey -->
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

    <!-- Modal -->
    <div
      v-if="modal.visible"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-4 rounded-lg w-full max-w-md shadow-xl">
        <h3 class="font-semibold text-gray-800 mb-2">
          Sessions for: <span class="text-blue-600">{{ modal.stepName }}</span>
        </h3>
        <ul class="text-sm max-h-[300px] overflow-y-auto">
          <li
            v-for="(sessions, userId) in modal.data"
            :key="userId"
            class="mb-2 border-b pb-1"
          >
            <strong
              >{{ truncateId(userId) }} - {{ sessions.length }} sessions</strong
            >
            <ul class="ml-4 text-xs text-gray-600">
              <li v-for="sid in sessions" :key="sid">{{ truncateId(sid) }}</li>
            </ul>
          </li>
        </ul>
        <button
          class="mt-4 text-xs text-blue-600 underline cursor-pointer"
          @click="modal.visible = false"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

import { API_URL, useTracker } from "@/composables/useTracker";
import { EVENTS } from "@/constants/events";
import { ROUTES } from "@/constants/routes";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

const router = useRouter();
const { deviceSystemData, journeyStepsData, exportJourneyData } = useTracker();

const activeTab = ref("device");
const tabClass = (tab) =>
  [
    "px-4 py-2 text-sm font-medium transition-colors",
    activeTab.value === tab
      ? "border-b-2 border-blue-500 text-blue-600"
      : "text-gray-500 hover:text-gray-700",
  ].join(" ");

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
const goToBack = () => router.push(ROUTES.WELCOME_PAGE.path);
const truncateId = (id) => `${id.slice(0, 4)}...${id.slice(-4)}`;

const stats = reactive({
  userCount: 0,
  sessionCount: 0,
  sessionsByUser: {},
  userJourneysByStep: {},
});

const modal = reactive({ visible: false, data: {}, stepName: "" });
const openSessionModal = (stepName) => {
  modal.stepName = stepName;
  modal.data = stats.userJourneysByStep[stepName] || {};
  modal.visible = true;
};

const fetchStats = async () => {
  const [usersRes, sessionsRes, journeysRes] = await Promise.all([
    fetch(`${API_URL}/users`),
    fetch(`${API_URL}/sessions`),
    fetch(`${API_URL}/journeys`),
  ]);
  const [users, sessions, journeys] = await Promise.all([
    usersRes.json(),
    sessionsRes.json(),
    journeysRes.json(),
  ]);

  stats.userCount = new Set(users.map((u) => u.userId)).size;
  stats.sessionCount = new Set(sessions.map((s) => s.sessionId)).size;

  sessions.forEach(({ userId, sessionId }) => {
    if (!stats.sessionsByUser[userId]) stats.sessionsByUser[userId] = new Set();
    stats.sessionsByUser[userId].add(sessionId);
  });
  for (const uid in stats.sessionsByUser)
    stats.sessionsByUser[uid] = [...stats.sessionsByUser[uid]];

  const grouped = {};
  journeys.forEach(({ stepName, userId, sessionId }) => {
    if (!stepName || !userId || !sessionId) return;
    if (!grouped[stepName]) grouped[stepName] = {};
    if (!grouped[stepName][userId]) grouped[stepName][userId] = new Set();
    grouped[stepName][userId].add(sessionId);
  });
  for (const step in grouped)
    for (const user in grouped[step])
      grouped[step][user] = [...grouped[step][user]];
  stats.userJourneysByStep = grouped;
};

const totalSessions = (userSessions) => {
  return Object.values(userSessions).reduce(
    (acc, sessions) => acc + sessions.length,
    0
  );
};

onMounted(fetchStats);
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
