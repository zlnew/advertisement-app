import { api, axios } from '@/plugins/axios'

interface Ad {
  id: number
  user_id: number
  type: 'Landing Page' | 'Sponsored Content' | 'Contextual'
  title: string
  description: string
}

async function getAds (search: string) {
  try {
    const response = await api.get('ads', {
      params: { search }
    })
    return response.data.data as Ad[]
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during fetching ads.')
    }
  }
}

async function getAd (id: number) {
  try {
    const response = await api.get(`ads/${id}`)
    return response.data.data as Ad
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during fetching ad.')
    }
  }
}

async function storeAd (formData: any) {
  try {
    const response = await api.post('ads', formData)
    return response.data.data as Ad
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during storing ad.')
    }
  }
}

async function updateAd ({
  id,
  formData,
}: {
  id: number
  formData: any
}) {
  try {
    const response = await api.patch(`ads/${id}`, formData)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during updating ad.')
    }
  }
}

async function destroyAd (id: number) {
  try {
    const response = await axios.delete(`ads/${id}`)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during deleting ad.')
    }
  }
}

export {
  getAds,
  getAd,
  storeAd,
  updateAd,
  destroyAd
}
