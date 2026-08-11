<template>
  <input
    type="number"
    class="number-input"
    :value="modelValue"
    :min="min"
    :max="max"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
  min?: number;
  max?: number;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

function onInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value) || 0;
  emit('update:modelValue', val);
}
</script>

<style scoped>
.number-input {
  width: 55px;
  text-align: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e2e8f0;
  padding: 3px;
  font-size: 13px;
  font-family: inherit;
}
.number-input:focus {
  outline: none;
  border-color: #667eea;
}
</style>
