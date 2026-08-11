<template>
  <span
    class="editable"
    contenteditable="true"
    @blur="onBlur"
    v-text="displayValue"
  ></span>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  format?: (v: string) => string;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const displayValue = computed(() => {
  const v = props.modelValue ?? '';
  return props.format ? props.format(v) : v;
});

function onBlur(e: FocusEvent) {
  const val = (e.target as HTMLElement).textContent?.trim() ?? '';
  if (val !== props.modelValue) {
    emit('update:modelValue', val);
  } else {
    // 强制重渲染以同步格式化后的文本
    (e.target as HTMLElement).textContent = displayValue.value;
  }
}
</script>

<style scoped>
.editable {
  background: rgba(102, 126, 234, 0.1);
  border: 1px dashed rgba(102, 126, 234, 0.4);
  border-radius: 6px;
  padding: 2px 8px;
  color: #a8d8ea;
  cursor: text;
  transition: all 0.2s;
  min-width: 40px;
  display: inline-block;
  text-align: center;
}
.editable:hover {
  background: rgba(102, 126, 234, 0.2);
  border-style: solid;
}
.editable:focus {
  outline: none;
  background: rgba(102, 126, 234, 0.25);
  border-color: #667eea;
  color: #fff;
}
</style>
