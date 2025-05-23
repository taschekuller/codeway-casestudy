<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#1e1e2e] to-[#1e1e26]">
    <img src="/assets/codeway/codewayLogo.png" alt="Logo" class="w-64" />

    <h1 class="text-2xl  mt-12" :style="{ color: colors.primary }">Please sign in</h1>

    <div class="w-full max-w-sm mt-8">
      <Input
        v-model="email"
        type="email"
        placeholder="E-mail address"
        class="text-white placeholder:text-gray-400 focus:outline-none"
        :style="{ border: `1px solid ${colors.secondary}` }"
        @focus="e => e.target.style.border = `0.5px solid ${colors.borderFocus}`"
        @blur="e => e.target.style.border = `0.5px solid ${colors.secondary}`"
        :disabled="isLoading"
      />
      <Input
        v-model="password"
        type="password"
        placeholder="Password"
        class="text-white placeholder:text-gray-400 focus:outline-none"
        :style="{ border: `1px solid ${colors.secondary}` }"
        @focus="e => e.target.style.border = `0.5px solid ${colors.borderFocus}`"
        @blur="e => e.target.style.border = `0.5px solid ${colors.secondary}`"
        :disabled="isLoading"
      />

      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>

      <Button
        @click="handleSignIn"
        class="w-full bg-gradient-to-l from-blue-500 to-blue-700 mt-2"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Signing in...' : 'Sign in' }}
      </Button>
    </div>

    <footer class="mt-12 text-gray-500 text-xs ">
      Codeway © 2021
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { colors } from '@/constants/theme'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useAuth } from '@/hooks/useAuth'

const router = useRouter()
const { getIdToken } = useAuth()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

async function handleSignIn() {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  try {
    isLoading.value = true
    error.value = ''

    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)

    // Get fresh token
    const token = await userCredential.user.getIdToken(true)
    console.log('Firebase auth successful, token retrieved')

    // Store the token in localStorage
    localStorage.setItem('token', token)

    // Auto-refresh token every 30 minutes (tokens expire after 1 hour)
    scheduleTokenRefresh()

    router.push('/')
  } catch (err) {
    console.error('Sign in error:', err)
    error.value = err.message || 'Failed to sign in. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function scheduleTokenRefresh() {
  // Refresh token every 30 minutes
  const REFRESH_INTERVAL = 30 * 60 * 1000 // 30 minutes

  // Clear any existing refresh interval
  if (window.tokenRefreshInterval) {
    clearInterval(window.tokenRefreshInterval)
  }

  // Set new refresh interval
  window.tokenRefreshInterval = setInterval(async () => {
    try {
      const newToken = await getIdToken(true)
      if (newToken) {
        localStorage.setItem('token', newToken)
        console.log('Token refreshed automatically')
      }
    } catch (err) {
      console.error('Failed to refresh token:', err)
    }
  }, REFRESH_INTERVAL)
}
</script>
