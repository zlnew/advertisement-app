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
} from 'naive-ui'
import { forgotPassword } from '@/api/auth'

const message = useMessage()

const formRef = ref<FormInst | null>(null)
const formModel = ref({
  email: '',
})
const formRules = {
  email: {
    required: true
  }
}
const formProcessing = ref(false)
const formValidationErrors = ref<Record<string, string[]>>()
const successMessage = ref()

const forgotPasswordHandler = (e: MouseEvent) => {
  e.preventDefault()

  formRef.value?.validate((errors) => {
    if (!errors) {
      formProcessing.value = true

      forgotPassword(formModel.value.email)
        .then(() => {
          successMessage.value = 'Please check your email to get password reset link!'
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
  <n-card title="Forgot Password?" style="width: 350px;">
    <n-alert
      v-if="successMessage"
      title="Link sent successfully"
      type="success"
      closable
      style="margin-bottom: 1rem;"
    >
      {{ successMessage }}
    </n-alert>

    <n-alert
      v-else-if="formValidationErrors"
      title="Request Error"
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

      <p>Please insert your email address, we will send you a link to reset your password.</p>

      <n-form-item>
        <n-button
          block attr-type="submit"
          type="primary"
          :loading="formProcessing"
          @click="forgotPasswordHandler"
        >
          Request Reset Link
        </n-button>
      </n-form-item>
    </n-form>
  </n-card>

  <n-space justify="center" style="margin-top: 1rem;">
    <router-link to="/auth/login">
      <n-button quaternary>
        Back to login page
      </n-button>
    </router-link>
  </n-space>
</template>
