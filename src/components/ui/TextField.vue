<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :required="required"
        :disabled="disabled"
        :value="modelValue"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @change="$emit('change', $event)"
      />
    </div>

    <p v-if="errorMessage" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <p v-if="helpText" class="mt-1 text-sm text-gray-500">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { computed, useId } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
    validator: (value) =>
      [
        "text",
        "email",
        "password",
        "tel",
        "number",
        "url",
        "search",
        "date",
        "time",
        "datetime-local",
      ].includes(value),
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  maxlength: {
    type: [String, Number],
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "centered", "otp"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  errorMessage: {
    type: String,
    default: "",
  },
  helpText: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "focus", "blur", "change"]);

const inputId = useId();

const inputClasses = computed(() => {
  const baseClasses = [
    "w-full",
    "border",
    "border-gray-300",
    "rounded-md",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-pink-500",
    "transition-colors",
  ];

  // Size classes
  const sizeClasses = {
    sm: "px-2 py-1.5 text-xs sm:text-sm",
    md: "px-3 py-2 text-sm sm:text-base",
    lg: "px-4 py-3 text-base sm:text-lg",
  };

  // Variant classes
  const variantClasses = {
    default: "focus:border-transparent",
    centered: "text-center focus:border-pink-500",
    otp: "text-center text-lg tracking-widest focus:border-pink-500",
  };

  // State classes
  const stateClasses = props.disabled
    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
    : "bg-white text-gray-900";

  // Error classes
  const errorClasses = props.errorMessage
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "";

  return [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    stateClasses,
    errorClasses,
  ]
    .filter(Boolean)
    .join(" ");
});
</script>
