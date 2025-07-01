<template>
  <header class="bg-white shadow-sm border-b border-gray-200 mb-6">
    <div class="max-w-md mx-auto px-4 py-4 flex items-center space-x-3">
      <!-- Journey Tracker SVG Logo -->
      <div class="flex-shrink-0">
        <svg
          class="w-8 h-8 text-pink-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 8.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm7 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM12 18.5c-2.03 0-3.93-.61-5.5-1.65l.55-.83A7.8 7.8 0 0012 17.5c1.69 0 3.24-.54 4.95-1.48l.55.83A9.26 9.26 0 0112 18.5z"
          />
          <path d="M9 13h6v1H9v-1zm0 2h6v1H9v-1z" />
        </svg>
      </div>

      <!-- Title -->
      <div class="flex-1">
        <h1 class="text-lg font-bold text-gray-900">Journey Tracker</h1>
        <p class="text-xs text-gray-500">User Experience Analytics</p>
      </div>
    </div>
  </header>
</template>

<script setup>
// No props or logic needed for this simple header component
</script>
