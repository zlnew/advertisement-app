<script setup lang="ts">
import { onMounted } from 'vue'
import { NSpace } from 'naive-ui'
import ProfileDropdown from '@/components/ProfileDropdown.vue'
import AppLogo from '@/components/AppLogo.vue'

onMounted(() => {
  const accessToken = localStorage.getItem('access_token')

  if (!accessToken) {
    window.location.href = '/'
  }
})
</script>

<template>
  <div style="background-color: white; border-bottom: 0.5px solid lightgray;">
    <n-space
      justify="space-between"
      align="center"
      class="container"
    >
      <app-logo />
      <profile-dropdown />
    </n-space>
  </div>

  <div style="margin-top: 1rem;" class="container">
    <router-view />
  </div>
</template>
