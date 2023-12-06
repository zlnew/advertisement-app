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
  type FormItemRule,
  type FormRules,
} from 'naive-ui'
import { register, authenticate } from '@/api/auth'

const message = useMessage()

const formRef = ref<FormInst | null>(null)
const formModel = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const formRules: FormRules = {
  name: {
    required: true,
  },
  email: {
    required: true
  },
  password: {
    required: true,
    min: 8
  },
  password_confirmation: [
    {
      required: true
    },
    {
      validator: validatePasswordSame,
      message: 'Password is not same as re-entered password!',
    }
  ]
}
const formValidationErrors = ref<Record<string, string[]>>()
const formProcessing = ref(false)

function validatePasswordSame (_rule: FormItemRule, value: string): boolean {
  return value === formModel.value.password
}

const registerHandler = (e: MouseEvent) => {
  e.preventDefault()

  formRef.value?.validate((errors) => {
    if (!errors) {
      formProcessing.value = true

      register(formModel.value)
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
  <n-card title="Create an account" style="width: 350px">
    <n-alert
      v-if="formValidationErrors"
      title="Registration Error"
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
      <n-form-item label="Name" path="name">
        <n-input
          v-model:value="formModel.name"
          placeholder="Name"
        />
      </n-form-item>

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

      <n-form-item label="Confirm Password" path="password_confirmation">
        <n-input
          type="password"
          v-model:value="formModel.password_confirmation"
          placeholder="Confirm Password"
        />
      </n-form-item>

      <n-space justify="end">
        <n-button
          attr-type="submit"
          type="primary"
          :loading="formProcessing"
          @click="registerHandler"
        >
          Register
        </n-button>
      </n-space>
    </n-form>
  </n-card>

  <n-space justify="center" style="margin-top: 1rem;">
    <RouterLink to="/auth/login">
      <n-button quaternary>
        Already have an account? Login
      </n-button>
    </RouterLink>
  </n-space>
</template>
