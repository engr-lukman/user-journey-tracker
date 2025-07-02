<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary", "text"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const buttonClasses = computed(() => {
  const baseClasses = [
    "font-medium",
    "rounded-md",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "cursor-pointer",
  ];

  // Size classes with mobile-first responsive design
  const sizeClasses = {
    sm: "px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm",
    md: "px-4 py-3 text-sm sm:px-6 sm:py-3.5 sm:text-base",
    lg: "px-6 py-4 text-base sm:px-8 sm:py-4.5 sm:text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary: props.disabled
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500",
    secondary: props.disabled
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
    text: props.disabled
      ? "text-gray-400 cursor-not-allowed"
      : "text-pink-600 hover:text-pink-700 focus:ring-pink-500",
  };

  // Width classes
  const widthClasses = props.fullWidth ? "w-full" : "";

  // Disabled cursor override
  const disabledClasses = props.disabled
    ? "cursor-not-allowed"
    : "cursor-pointer";

  return [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    widthClasses,
    disabledClasses,
  ]
    .filter(Boolean)
    .join(" ");
});
</script>
