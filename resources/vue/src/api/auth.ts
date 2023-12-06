import { api, axios } from "@/plugins/axios"

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface ResetPasswordData {
  token: string
  email: string
  password: string
  password_confirmation: string
}

async function authenticate (accessToken: string) {
  try {
    const response = await api.get('user', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during authentication.')
    }
  }
}

async function login(data: LoginData) {
  try {
    const response = await axios.post('login', data)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during login.')
    }
  }
}

async function register(data: RegisterData) {
  try {
    const response = await axios.post('register', data)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during registration.')
    }
  }
}

async function logout() {
  try {
    const response = await api.post('logout', null)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during logout.')
    }
  }
}

async function forgotPassword(email: string) {
  try {
    const response = await axios.post('forgot-password', {
      email
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during request.')
    }
  }
}

async function resetPassword(data: ResetPasswordData) {
  try {
    const response = await axios.post('reset-password', data)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('An unexpected error occurred during resetting password.')
    }
  }
}

export {
  authenticate,
  login,
  register,
  logout,
  forgotPassword,
  resetPassword
}
