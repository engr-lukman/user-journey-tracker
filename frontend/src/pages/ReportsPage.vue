<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col"
  >
    <AppHeader />

    <div class="flex-1 p-2 sm:p-3">
      <div class="w-full max-w-4xl mx-auto">
        <!-- Header -->
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

        <!-- Navigation -->
        <div class="flex justify-end mb-4">
          <Button
            @click="() => router.push(ROUTES?.WELCOME_PAGE?.path)"
            variant="primary"
            >Home</Button
          >
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-200 mb-4">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="tabClass(tab)"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="mb-4">
          <!-- Stats Tab -->
          <div
            v-if="activeTab === 'Stats'"
            class="bg-white p-4 rounded-xl shadow border text-sm"
          >
            <h2 class="text-lg font-semibold mb-2">Statistics Overview</h2>
            <div class="space-y-1 text-gray-700">
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

            <!-- Per Step Data -->
            <div class="mt-10">
              <h2 class="text-md font-semibold mb-2">User Journeys per Step</h2>
              <div class="overflow-auto border rounded">
                <table class="min-w-full text-xs text-left text-gray-700">
                  <thead class="bg-gray-100 border-b">
                    <tr>
                      <th class="px-4 py-2">Event Name</th>
                      <th class="px-4 py-2">Unique Users</th>
                      <th class="px-4 py-2">Sessions</th>
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
                          class="text-blue-600 underline text-xs"
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

          <!-- System Tab -->
          <div
            v-else
            class="bg-gray-800 rounded-xl p-2 overflow-auto max-h-[55vh] text-sm font-mono shadow-lg"
          >
            <pre class="text-green-400">{{ stats?.systemData }}</pre>
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
        <h3 class="font-semibold mb-2">
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
          class="mt-4 text-xs text-blue-600 underline"
          @click="modal.visible = false"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL, useTracker } from "@/composables/useTracker";
import { ROUTES } from "@/constants/routes";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import Button from "@/components/ui/Button.vue";

// Router
const router = useRouter();

// Tabs
const tabs = ["System", "Stats"];
const activeTab = ref("System");
const tabClass = (tab) =>
  [
    "px-4 py-2 text-sm font-medium transition-colors",
    activeTab.value === tab
      ? "border-b-2 border-blue-500 text-blue-600"
      : "text-gray-500 hover:text-gray-700",
  ].join(" ");

// Data & formatting
const { userId } = useTracker();

const truncateId = (id) => `${id.slice(0, 4)}...${id.slice(-4)}`;

// Modal
const modal = reactive({ visible: false, data: {}, stepName: "" });
const openSessionModal = (stepName) => {
  modal.stepName = stepName;
  modal.data = stats.userJourneysByStep[stepName] || {};
  modal.visible = true;
};

// Stats
const stats = reactive({
  userCount: 0,
  sessionCount: 0,
  sessionsByUser: {},
  userJourneysByStep: {},
  systemData: "",
});

const fetchStats = async () => {
  const [respUser, respEvent] = await Promise.all([
    fetch(`${API_URL}/users?userId=${userId.value}`),
    fetch(`${API_URL}/events`),
  ]);
  const events = await respEvent.json();
  const users = await respUser.json();

  const userSet = new Set();
  const sessionSet = new Set();
  const sessionsByUser = {};
  const journeysByStep = {};

  stats.systemData = JSON.stringify(users[0], null, 2);

  events.forEach(({ userId, sessionId, eventTitle, TITLE, eventName }) => {
    if (!userId || !sessionId) return;

    const step = eventTitle || TITLE || eventName || "Unknown Step";

    userSet.add(userId);
    sessionSet.add(sessionId);

    sessionsByUser[userId] ??= new Set();
    sessionsByUser[userId].add(sessionId);

    journeysByStep[step] ??= {};
    journeysByStep[step][userId] ??= new Set();
    journeysByStep[step][userId].add(sessionId);
  });

  stats.userCount = userSet.size;
  stats.sessionCount = sessionSet.size;

  stats.sessionsByUser = Object.fromEntries(
    Object.entries(sessionsByUser).map(([uid, s]) => [uid, [...s]])
  );

  stats.userJourneysByStep = Object.fromEntries(
    Object.entries(journeysByStep).map(([step, users]) => [
      step,
      Object.fromEntries(Object.entries(users).map(([u, s]) => [u, [...s]])),
    ])
  );
};

const totalSessions = (userSessions) =>
  Object.values(userSessions).reduce((acc, s) => acc + s.length, 0);

onMounted(fetchStats);
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
