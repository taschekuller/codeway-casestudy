<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuth } from './hooks/useAuth'

const { getIdToken } = useAuth()

// Function to initialize and refresh Firebase token
async function refreshToken() {
  try {
    const token = await getIdToken(true)
    if (token) {
      console.log('Firebase token refreshed on app initialization')
      localStorage.setItem('token', token)
    }
  } catch (error) {
    console.error('Failed to refresh token on app initialization:', error)
  }
}

onMounted(() => {
  // Refresh token on app mount if user is logged in
  refreshToken()
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
