import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    {
      path: '/dashboard',
      redirect: '/dashboard/advertisements',
    },
    {
      path: '/auth',
      component: () => import('@/layouts/GuestLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          meta: {
            title: 'Sign in to your account - ADs App',
          },
          component: () => import('@/views/auth/LoginView.vue')
        },
        {
          path: 'register',
          name: 'register',
          meta: {
            title: 'Create an account - ADs App',
          },
          component: () => import('@/views/auth/RegisterView.vue')
        },
        {
          path: 'password/forgot',
          name: 'forgotPassword',
          meta: {
            title: 'Forgot password? - ADs App',
          },
          component: () => import('@/views/auth/ForgotPasswordView.vue')
        },
        {
          path: 'password/reset/:token',
          name: 'resetPassword',
          meta: {
            title: 'Reset Password - ADs App',
          },
          component: () => import('@/views/auth/ResetPasswordView.vue')
        }
      ]
    },
    {
      path: '/dashboard',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'advertisements',
          name: 'advertisements',
          meta: {
            title: 'List of Ads - ADs App Dashboard',
          },
          component: () => import('@/views/AdvertisementsView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string

  if (title) {
    document.title = title
  }

  next()
})

export default router
