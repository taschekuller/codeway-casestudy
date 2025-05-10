<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#1e1e2e] to-[#1e1e26]">
    <img src="../../../public/assets/codeway/codewayLogo.png" alt="Logo" class="w-64" />

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
      />
      <Input
        v-model="password"
        type="password"
        placeholder="Password"
        class="text-white placeholder:text-gray-400 focus:outline-none"
        :style="{ border: `1px solid ${colors.secondary}` }"
        @focus="e => e.target.style.border = `0.5px solid ${colors.borderFocus}`"
        @blur="e => e.target.style.border = `0.5px solid ${colors.secondary}`"
      />

      <Button @click="handleSignIn" class="w-full bg-gradient-to-l from-blue-500 to-blue-700 mt-2">
        Sign in
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

const email = ref('')
const password = ref('')

function handleSignIn() {
  console.log('Email:', email.value)
  console.log('Password:', password.value)
  // TODO: Implement Firebase auth here
}
</script>
