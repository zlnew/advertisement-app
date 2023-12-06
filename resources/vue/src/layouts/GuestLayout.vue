<script setup lang="ts">
import { onMounted } from 'vue'
import { NSpace } from 'naive-ui'
import AppLogo from '@/components/AppLogo.vue'

onMounted(() => {
  const accessToken = localStorage.getItem('access_token')

  if (accessToken) {
    window.location.href = '/dashboard'
  }
})
</script>

<template>
  <div style="padding: 1rem;">
    <n-space
      vertical
      size="large"
      justify="center"
      align="center"
      :style="{
        'min-height': '100vh'
      }"
    >
      <app-logo />
      <router-view />
    </n-space>
  </div>
</template>
