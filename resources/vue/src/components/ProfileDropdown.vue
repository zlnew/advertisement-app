<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { logout } from '@/api/auth'
import {
  NDropdown,
  NButton,
  useMessage,
  type DropdownOption,
} from 'naive-ui'

interface User {
  id: number
  name: string
  email: string
}

const message = useMessage()

const options: DropdownOption[] = [{
  label: 'Logout',
  key: 'logout'
}]

const userData = ref<User>()

const logoutHandler = () => {
  logout()
    .then(() => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.reload()
    })
    .catch((error) => {
      message.error(error.message)
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
