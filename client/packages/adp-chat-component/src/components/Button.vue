<script setup lang="ts">
interface ButtonProps {
  type?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}

const {
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false
} = defineProps<ButtonProps>();

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!disabled && !loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button 
    :class="['adp-button', `adp-button--${type}`, `adp-button--${size}`]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="adp-button__loading">⏳</span>
    <span class="adp-button__content">
      <slot>按钮</slot>
    </span>
  </button>
</template>

<style scoped>
.adp-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.2s ease;
  user-select: none;
  outline: none;
}

.adp-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.adp-button--small {
  padding: 6px 12px;
  font-size: 12px;
  height: 28px;
}

.adp-button--medium {
  padding: 8px 16px;
  font-size: 14px;
  height: 32px;
}

.adp-button--large {
  padding: 12px 20px;
  font-size: 16px;
  height: 40px;
}

.adp-button--primary {
  background-color: #007bff;
  color: white;
}

.adp-button--primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.adp-button--secondary {
  background-color: #6c757d;
  color: white;
}

.adp-button--secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.adp-button--danger {
  background-color: #dc3545;
  color: white;
}

.adp-button--danger:hover:not(:disabled) {
  background-color: #c82333;
}

.adp-button__loading {
  margin-right: 6px;
  animation: spin 1s linear infinite;
}

.adp-button__content {
  display: flex;
  align-items: center;
  gap: 4px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>