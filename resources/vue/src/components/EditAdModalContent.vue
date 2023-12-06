<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  NSpace,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NAlert,
  useDialog,
  useMessage,
  type FormInst,
} from 'naive-ui'
import { type Ad } from '@/views/AdvertisementsView.vue'
import { updateAd } from '@/api/ad'

const emit = defineEmits([
  'update:data'
])

const props = defineProps<{
  data: Ad
}>()

const adTypes = [
  { label: 'Landing Page', value: 'Landing Page' },
  { label: 'Sponsored Content', value: 'Sponsored Content' },
  { label: 'Contextual', value: 'Contextual' }
]

const dialog = useDialog()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const formModel = ref({
  type: '',
  title: '',
  description: ''
})
const formRules = {
  type: {
    required: true
  },
  title: {
    required: true
  },
  description: {
    required: true
  }
}
const formValidationErrors = ref<Record<string, string[]>>()
const formProcessing = ref(false)

const updateHandler = (e: MouseEvent) => {
  e.preventDefault()

  formRef.value?.validate((errors) => {
    if (!errors) {
      formProcessing.value = true

      updateAd({
        id: props.data.id,
        formData: formModel.value
      })
        .then((data) => {
          emit('update:data', data)
          dialog.destroyAll()
          message.success('Ad updated successfully')
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

onMounted(() => {  
  if (props.data) {
    formModel.value = props.data
  }
})
</script>

<template>
  <div style="margin-top: 2rem;">
    <n-alert
      v-if="formValidationErrors"
      title="Form Error"
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
      <n-form-item label="Type" path="type">
        <n-select
          v-model:value="formModel.type"
          :options="adTypes"
        />
      </n-form-item>
  
      <n-form-item label="Title" path="title">
        <n-input
          v-model:value="formModel.title"
          placeholder="Ad Title"
        />
      </n-form-item>
  
      <n-form-item label="Description" path="description">
        <n-input
          type="textarea"
          v-model:value="formModel.description"
          placeholder="Ad Description"
        />
      </n-form-item>
  
      <n-space justify="end">
        <n-button
          attr-type="submit"
          type="info"
          :loading="formProcessing"
          @click="updateHandler"
        >
          Update
        </n-button>
      </n-space>
    </n-form>
  </div>
</template>
