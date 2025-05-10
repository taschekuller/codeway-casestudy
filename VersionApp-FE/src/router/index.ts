import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signin from '../views/Signin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin,
      meta: { requiresAuth: false }
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') // Check if user has a token

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to signin if trying to access protected route without auth
    next({ name: 'signin' })
  } else if (to.name === 'signin' && isAuthenticated) {
    // Redirect to home if trying to access signin while authenticated
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
