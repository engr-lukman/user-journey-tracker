<template>
  <label class="flex items-center space-x-3 cursor-pointer">
    <input
      :id="inputId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :required="required"
      :class="checkboxClasses"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span :class="labelClasses">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed, useId } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue"]);

const inputId = useId();

const checkboxClasses = computed(() => {
  const baseClasses = [
    "text-pink-600",
    "border-gray-300",
    "rounded",
    "focus:ring-pink-500",
    "focus:ring-2",
    "transition-colors",
  ];

  // Size classes
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  // State classes
  const stateClasses = props.disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return [...baseClasses, sizeClasses[props.size], stateClasses]
    .filter(Boolean)
    .join(" ");
});

const labelClasses = computed(() => {
  const baseClasses = ["select-none"];

  // Size classes
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // State classes
  const stateClasses = props.disabled
    ? "text-gray-400 cursor-not-allowed"
    : "text-gray-700 cursor-pointer";

  return [...baseClasses, sizeClasses[props.size], stateClasses]
    .filter(Boolean)
    .join(" ");
});
</script>
