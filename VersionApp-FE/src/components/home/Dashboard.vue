<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1e1e2f] to-[#1e1e24] p-8 text-white">
    <div class="flex justify-between items-center mb-8">
      <img src="../../../public/assets/codeway/codewayLogo.png" alt="Logo" class="w-12 h-8" />
      <div>
        <button class="text-white flex items-center gap-2">
          <UserIcon class="w-6 h-6" />
          <ChevronDown class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Table Headers -->
    <div class="grid grid-cols-5 text-left mb-4 " :style="{ color: colors.dashboardTitle, fontSize: '1.5rem' }">
      <div>Parameter Key</div>
      <div>Value</div>
      <div>Description</div>
      <div class="flex items-center">Create Date <ArrowDownIcon class="w-4 h-4 ml-1" /></div>
      <div></div>
    </div>

    <div v-for="(param, index) in parameters" :key="index" class="grid grid-cols-5 items-center py-2 border-b border-gray-700">
      <div>{{ param.key }}</div>
      <div>{{ param.value }}</div>
      <div>{{ param.description }}</div>
      <div>{{ param.createdAt }}</div>
      <div class="flex space-x-2">
        <Button size="sm" @click="editParameter(index)" class="bg-gradient-to-r from-[#2e69f5] to-[#2284f7] hover:from-[#1e59e5] hover:to-[#1274e7] text-white font-bold transition-all duration-200 cursor-pointer">Edit</Button>
        <Button size="sm" @click="deleteParameter(index)" class="bg-gradient-to-r from-[#f13941] to-[#f94f73] hover:from-[#e12931] hover:to-[#e93f63] text-white font-bold transition-all duration-200 cursor-pointer">Delete</Button>
      </div>
    </div>

    <!-- Add New Parameter Row -->
    <div class="grid grid-cols-5 items-center py-4 mt-6 gap-2">
      <Input v-model="newParam.key" placeholder="New Parameter" class="border-gray-600 w-3/4" />
      <Input v-model="newParam.value" placeholder="Value" class="border-gray-600 w-3/4" />
      <Input v-model="newParam.description" placeholder="New Description" class="border-gray-600 col-span-2 w-11/12" />
      <div class="flex justify-start">
        <Button size="sm" class="bg-gradient-to-r from-[#00b6e2] to-[#00e8c8] hover:from-[#0194b8] hover:to-[#00b69e] text-white font-bold transition-all duration-200 cursor-pointer w-20" @click="addParameter">ADD</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowDownIcon, UserIcon, ChevronDown } from 'lucide-vue-next'
import { colors } from '@/constants/theme'

const parameters = ref([
  { key: 'min_version', value: '1.4.4', description: 'Minimum required version of the app', createdAt: '10/05/2021 01:58' },
  { key: 'latest_version', value: '1.4.7', description: 'Latest version of the app', createdAt: '10/05/2021 01:58' },
  { key: 'pricing_tier', value: 't6', description: 'Pricing tier of the user', createdAt: '07/07/2021 11:13' },
  { key: 'scroll', value: '5', description: 'Index of Scroll Paywall for free users.', createdAt: '25/08/2021 10:22' },
  { key: 'scroll_limit', value: '13', description: 'Index of Scroll Limit Paywall for free users.', createdAt: '25/08/2021 10:23' },
])

const newParam = ref({ key: '', value: '', description: '' })

function addParameter() {
  if (newParam.value.key && newParam.value.value && newParam.value.description) {
    parameters.value.push({
      ...newParam.value,
      createdAt: new Date().toLocaleString('en-GB'),
    })
    newParam.value = { key: '', value: '', description: '' }
  }
}

function editParameter(index) {
  // TODO: Implement edit logic (open modal maybe?)
  console.log('Edit', parameters.value[index])
}

function deleteParameter(index) {
  parameters.value.splice(index, 1)
}
</script>

<style scoped>
</style>