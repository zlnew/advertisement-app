<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import {
  NSpace,
  NButton,
  NDataTable,
  NCard,
  NInput,
  NBreadcrumb,
  NBreadcrumbItem,
  useDialog,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import CreateAdModalContent from '@/components/CreateAdModalContent.vue'
import EditAdModalContent from '@/components/EditAdModalContent.vue'
import { getAds, destroyAd } from '@/api/ad'

export type Ad = {
  id: number
  type: string
  title: string
  description: string
}

const dialog = useDialog()
const message = useMessage()

const actions = [
  { key: 'edit', label: 'Edit', type: 'info' },
  { key: 'delete', label: 'Delete', type: 'error' }
]

const createColumns = (): DataTableColumns<Ad> => {
  return [
    {
      title: 'ID',
      key: 'id',
      sorter: 'default'
    },
    {
      title: 'Type',
      key: 'type',
      sorter (rowA, rowB) {
        return rowA.type.length - rowB.type.length
      }
    },
    {
      title: 'Title',
      key: 'title',
      sorter (rowA, rowB) {
        return rowA.title.length - rowB.title.length
      }
    },
    {
      title: 'Description',
      key: 'description'
    },
    {
      title: 'Action',
      key: 'actions',
      render (row) {
        const buttons = actions.map((item) => {
          return h(
            NButton,
            {
              style: { marginRight: '6px' },
              strong: true,
              tertiary: true,
              type: item.type as any,
              size: 'small',
              onClick: () => {
                item.key === 'edit'
                  ? openEditModal(row)
                  : openDeleteModal(row.id)
              }
            },
            { default: () => item.label }
          )
        })

        return buttons
      }
    }
  ]
}

const tableLoading = ref(false)
const columns = ref<any>()
const rows = ref<Ad[]>()
const search = ref('')

function fetchAds () {
  tableLoading.value = true

  getAds(search.value)
    .then((data) => {
      rows.value = data
    })
    .catch((error) => {
      message.error(error.message)
    })
    .finally(() => {
      tableLoading.value = false
    })
}

function openCreateModal () {
  dialog.create({
    title: 'Create New Ad',
    content: () => h(CreateAdModalContent, {
      'onCreate:data': (newData) => rows.value?.push(newData)
    })
  })
}

function openEditModal (data: Ad) {
  dialog.info({
    title: 'Edit Ad',
    content: () => h(EditAdModalContent, {
      data
    })
  })
}

function openDeleteModal (id: number) {
  dialog.error({
    title: 'Delete Ad',
    content: 'Are you sure want to delete this ad?',
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: () => {
      destroyAd(id)
        .then(() => {
          rows.value = rows.value?.filter((ad) => ad.id !== id)
          message.success('Ad deleted successfully')
        })
        .catch((error) => {
          message.error(error.message)
        })
    }
  })
}

onMounted(() => {
  columns.value = createColumns()
  fetchAds()
})
</script>

<template>
  <n-breadcrumb style="margin-bottom: 1rem;">
    <n-breadcrumb-item>Dashboard</n-breadcrumb-item>
    <n-breadcrumb-item>Advertisements</n-breadcrumb-item>
  </n-breadcrumb>

  <n-card title="List of Ads">
    <n-space
      justify="space-between"
      align="center"
      style="margin-bottom: 1rem;"
    >
      <n-button type="primary" @click="openCreateModal">
        Add New
      </n-button>
      <n-input
        v-model:value="search"
        placeholder="Search ads ..."
        @keydown.enter="fetchAds"
      />
    </n-space>

    <n-data-table
      :columns="columns"
      :data="rows"
      :bordered="false"
      :pagination="{
        pageSize: 5
      }"
      :loading="tableLoading"
      :scroll-x="1000"
    />
  </n-card>
</template>
