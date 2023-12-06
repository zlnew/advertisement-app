<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { logout } from '@/api/auth'
import {
  NDropdown,
  NButton,
  type DropdownOption
} from 'naive-ui'

interface User {
  id: number
  name: string
  email: string
}

const options: DropdownOption[] = [{
  label: 'Logout',
  key: 'logout'
}]

const userData = ref<User>()

const logoutHandler = () => {
  const accessToken = localStorage.getItem('access_token')

  logout(accessToken && JSON.parse(accessToken))
    .then(() => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.reload()
    })
}

function handleSelect (key: string) {
  if (key === 'logout') {
    logoutHandler()
  }
}

onMounted(() => {
  const user = localStorage.getItem('user')
  
  if (user) {
    userData.value = JSON.parse(user)
  }
})
</script>

<template>
  <n-dropdown
    trigger="click"
    :options="options"
    @select="handleSelect"
  >
    <n-button>
      Hi, {{ userData?.name }}
    </n-button>
  </n-dropdown>
</template>