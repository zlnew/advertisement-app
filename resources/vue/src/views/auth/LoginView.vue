<script setup lang="ts">
import { ref } from 'vue'
import {
  NSpace,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NAlert,
  useMessage,
  type FormInst,
  type FormRules,
} from 'naive-ui'
import { authenticate, login } from '@/api/auth'

const message = useMessage()

const formRef = ref<FormInst | null>(null)
const formModel = ref({
  email: '',
  password: ''
})
const formRules: FormRules = {
  email: {
    required: true
  },
  password: {
    required: true,
    min: 8
  }
}
const formValidationErrors = ref<Record<string, string[]>>()
const formProcessing = ref(false)

const loginHandler = (e: MouseEvent) => {
  e.preventDefault()

  formRef.value?.validate((errors) => {
    if (!errors) {
      formProcessing.value = true

      login(formModel.value)
        .then((data) => {
          const accessToken = data.access_token

          authenticate(accessToken)
            .then((data) => {
              localStorage.setItem('access_token', JSON.stringify(accessToken))
              localStorage.setItem('user', JSON.stringify(data))
              window.location.reload()
            })
        })
        .catch((error) => {
          if (error.response.status === 422) {
            formValidationErrors.value = error.response.data.errors
          } else {
            message.error(error.message)
          }
        })
        .finally(() => {
          formProcessing.value = false
        })
    }
  })
}
</script>

<template>
  <n-card title="Sign In to your account" style="width: 350px;">
    <n-alert
      v-if="formValidationErrors"
      title="Login Error"
      type="error"
      closable
      style="margin-bottom: 1rem;"
    >
      <ul>
        <li v-for="(error, key) in formValidationErrors" :key="key">
          <span style="font-weight: bold; text-transform: capitalize;">
            {{ key }}
          </span>:
          {{ error[0] }}
        </li>
      </ul>
    </n-alert>

    <n-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
    >
      <n-form-item label="Email" path="email">
        <n-input
          v-model:value="formModel.email"
          placeholder="Email Address"
        />
      </n-form-item>

      <n-form-item label="Password" path="password">
        <n-input
          type="password"
          v-model:value="formModel.password"
          placeholder="Password"
        />
      </n-form-item>

      <n-space justify="space-between">
        <router-link to="/auth/password/forgot">
          <n-button>
            Forgot Password?
          </n-button>
        </router-link>

        <n-button
          attr-type="submit"
          type="primary"
          :loading="formProcessing"
          @click="loginHandler"
        >
          Login
        </n-button>
      </n-space>
    </n-form>
  </n-card>

  <n-space justify="center" style="margin-top: 1rem;">
    <router-link to="/auth/register">
      <n-button quaternary>
        Don't have account? Register
      </n-button>
    </router-link>
  </n-space>
</template>
