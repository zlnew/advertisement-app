<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
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
} from 'naive-ui'
import { resetPassword } from '@/api/auth'

const route = useRoute()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const formModel = ref({
  password: '',
  password_confirmation: ''
})
const formRules = {
  password: {
    required: true
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

const resetPasswordHandler = (e: MouseEvent) => {
  e.preventDefault()

  formRef.value?.validate((errors) => {
    if (!errors) {
      const formData = {
        ...formModel.value,
        email: route.query.email as string,
        token: route.params.token as string
      }

      formProcessing.value = true

      resetPassword(formData)
        .then(() => {
          message.success('Password has been reset successfully')
          setTimeout(() => {
            window.location.href = '/auth/login'
          }, 2000)
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

function validatePasswordSame (_rule: FormItemRule, value: string): boolean {
  return value === formModel.value.password
}
</script>

<template>
  <n-card title="Reset password" style="width: 350px">
    <n-alert
      v-if="formValidationErrors"
      title="Reset Password Error"
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
      <n-form-item label="New Password" path="password">
        <n-input
          type="password"
          v-model:value="formModel.password"
          placeholder="New Password"
        />
      </n-form-item>

      <n-form-item label="Confirm New Password" path="password_confirmation">
        <n-input
          type="password"
          v-model:value="formModel.password_confirmation"
          placeholder="Confirm New Password"
        />
      </n-form-item>

      <n-space justify="end">
        <n-button
          attr-type="submit"
          type="primary"
          :loading="formProcessing"
          @click="resetPasswordHandler"
        >
          Reset Password
        </n-button>
      </n-space>
    </n-form>
  </n-card>

  <n-space justify="center" style="margin-top: 1rem;">
    <RouterLink to="/auth/login">
      <n-button quaternary>
        Back to login page
      </n-button>
    </RouterLink>
  </n-space>
</template>
