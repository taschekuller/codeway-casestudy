<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1e1e2f] to-[#1e1e24] p-4 md:p-8 text-white">
    <div class="flex justify-between items-center mb-8">
      <img src="/assets/codeway/codewayLogo.png" alt="Logo" class="w-12 h-8" />
      <div>
        <button class="text-white flex items-center gap-2" @click="handleSignOut">
          <UserIcon class="w-6 h-6" />
          <ChevronDown class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <div v-else>
      <!-- Mobile Sort Button -->
      <div class="md:hidden mb-4">
        <Button @click="toggleSortDirection" class="bg-[#2a2a3c] text-white flex items-center gap-2">
          <span>Sort by Date: {{ sortDirection === 'asc' ? 'Oldest First' : 'Newest First' }}</span>
          <ArrowUp v-if="sortDirection === 'asc'" class="h-4 w-4" />
          <ArrowDown v-if="sortDirection === 'desc'" class="h-4 w-4" />
        </Button>
      </div>

      <!-- Table Headers -->
      <div class="hidden md:grid md:grid-cols-5 text-left mb-4" :style="{ color: colors.dashboardTitle, fontSize: '1.5rem' }">
        <div>Parameter Key</div>
        <div>Value</div>
        <div>Description</div>
        <div class="flex items-center gap-2 cursor-pointer" @click="toggleSortDirection">
          Create Date
          <div class="flex items-center">
            <ArrowUp v-if="sortDirection === 'asc'" class="h-4 w-4" />
            <ArrowDown v-if="sortDirection === 'desc'" class="h-4 w-4" />
          </div>
        </div>
        <div>Actions</div>
      </div>

      <div class="space-y-4">
        <div v-for="config in sortedConfigs" :key="config.id" class="md:grid md:grid-cols-5   bg-[#2a2a3c] md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0 mb-4 md:mb-0 items-start md:items-center py-2">
          <div class="mb-2 md:mb-0">
            <div class="font-bold md:hidden">Parameter Key</div>
            {{ config.paramKey }}
          </div>
          <div class="mb-2 md:mb-0">
            <div class="font-bold md:hidden">Value</div>
            {{ config.value }}
          </div>
          <div class="mb-2 md:mb-0">
            <div class="font-bold md:hidden">Description</div>
            {{ config.description || 'N/A' }}
          </div>
          <div class="mb-2 md:mb-0">
            <div class="font-bold md:hidden">Create Date</div>
            {{ formatDate(config.createdAt) }}
          </div>
          <div class="flex space-x-2 mt-2 md:mt-0">
            <Button size="sm" @click="editConfig(config)" class="bg-gradient-to-r from-[#2e69f5] to-[#2284f7] hover:from-[#1e59e5] hover:to-[#1274e7] text-white font-bold transition-all duration-200 cursor-pointer">Edit</Button>
            <Button size="sm" @click="deleteConfig(config.id)" class="bg-gradient-to-r from-[#f13941] to-[#f94f73] hover:from-[#e12931] hover:to-[#e93f63] text-white font-bold transition-all duration-200 cursor-pointer">Delete</Button>
          </div>
        </div>
      </div>

      <!-- Add New Config Button -->
      <div class="mt-8">
        <Button @click="showCreateForm = true" class="bg-gradient-to-r from-[#00b6e2] to-[#00e8c8] hover:from-[#0194b8] hover:to-[#00b69e] text-white font-bold transition-all duration-200 cursor-pointer">
          Add New Parameter
        </Button>
      </div>

      <!-- Create/Edit Form -->
      <div v-if="showCreateForm || showEditForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-[#1e1e2f] p-6 rounded-lg w-full max-w-2xl">
          <h2 class="text-2xl mb-4">{{ showEditForm ? 'Edit Parameter' : 'Create New Parameter' }}</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block mb-1">Parameter Key</label>
              <Input v-model="formData.paramKey" placeholder="min_version" class="border-gray-600" />
            </div>
            <div>
              <label class="block mb-1">Value</label>
              <Input v-model="formData.value" placeholder="1.4.5" class="border-gray-600" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block mb-1">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full bg-[#2a2a3c] border border-gray-600 rounded p-2"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <Button @click="cancelForm" class="bg-gray-600">Cancel</Button>
            <Button @click="saveConfig" class="bg-gradient-to-r from-[#00b6e2] to-[#00e8c8]">
              {{ showEditForm ? 'Update' : 'Create' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserIcon, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'
import { colors } from '@/constants/theme'
import { useAuth } from '@/hooks/useAuth'
import { appConfigService } from '@/services/appConfig'
import { useDateFormat } from '@/hooks/useDateFormat'
import { useTokenManagement } from '@/hooks/useTokenManagement'
import { useSortableData } from '@/hooks/useSortableData'

const router = useRouter()
const { signOut } = useAuth()
const { formatDate } = useDateFormat()
const { refreshUserToken, ensureValidToken } = useTokenManagement()

const loading = ref(true)
const appConfigs = ref([])
const showCreateForm = ref(false)
const showEditForm = ref(false)

// Use the sortable data hook
const { sortDirection, toggleSortDirection, sortByDate } = useSortableData(appConfigs)
const sortedConfigs = sortByDate('createdAt')

const formData = ref({
  paramKey: '',
  value: '',
  description: ''
})

const editingConfigId = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    await ensureValidToken()
    await fetchConfigurations()
  } catch (error) {
    console.error('Failed to initialize dashboard:', error)
  } finally {
    loading.value = false
  }
})

async function fetchConfigurations() {
  try {
    const data = await appConfigService.getAllConfigs()

    appConfigs.value = data.map(config => {
      const processedConfig = {
        ...config,
        paramKey: config.paramKey || (config.appVersion ? 'min_version' : 'unknown_param'),
        value: config.value || config.minRequiredVersion || config.appVersion || 'N/A',
        description: config.description || 'Migrated from previous format'
      }

      // Process Firestore timestamp if needed (ensure proper Date object for display)
      if (config.createdAt && config.createdAt._seconds && config.createdAt._nanoseconds) {
        processedConfig.createdAt = new Date(config.createdAt._seconds * 1000)
      }

      return processedConfig
    })
  } catch (error) {
    console.error('Failed to fetch configurations:', error)

    if (error.response?.status === 401) {
      // Token expired, try to refresh and retry
      const refreshed = await refreshUserToken()
      if (refreshed) {
        try {
          // Retry with fresh token
          const data = await appConfigService.getAllConfigs()
          appConfigs.value = data.map(config => ({
            ...config,
            paramKey: config.paramKey || (config.appVersion ? 'min_version' : 'unknown_param'),
            value: config.value || config.minRequiredVersion || config.appVersion || 'N/A',
            description: config.description || 'Migrated from previous format'
          }))
        } catch (retryError) {
          console.error('Failed to fetch configurations after token refresh:', retryError)
        }
      }
    }
  }
}

function resetForm() {
  formData.value = {
    paramKey: '',
    value: '',
    description: ''
  }
}

function cancelForm() {
  showCreateForm.value = false
  showEditForm.value = false
  resetForm()
}

function editConfig(config) {
  formData.value = {
    paramKey: config.paramKey || (config.appVersion ? 'min_version' : 'unknown_param'),
    value: config.value || config.minRequiredVersion || config.appVersion || '',
    description: config.description || 'Migrated from previous format'
  }
  editingConfigId.value = config.id
  showEditForm.value = true
}

async function saveConfig() {
  try {
    loading.value = true;

    const configToSave = {
      paramKey: formData.value.paramKey.trim(),
      value: formData.value.value.trim(),
      description: formData.value.description.trim()
    };

    console.log('Saving configuration:', configToSave);

    if (showEditForm.value) {
      const updatedConfig = await appConfigService.updateConfig(editingConfigId.value, configToSave);

      const index = appConfigs.value.findIndex(c => c.id === editingConfigId.value);
      if (index !== -1) {
        appConfigs.value[index] = updatedConfig;
      }

      console.log('Config updated successfully');
    } else {
      const newConfig = await appConfigService.createConfig(configToSave);
      appConfigs.value.push(newConfig);

      console.log('New config created successfully:', newConfig.id);
    }

    cancelForm();
  } catch (error) {
    console.error('Failed to save configuration:', error);

    if (error.response) {
      if (error.response.status === 400) {
        let errorMessage = 'Validation error';

        if (error.response.data && error.response.data.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage += ':\n' + error.response.data.message.join('\n');
          } else {
            errorMessage += ': ' + error.response.data.message;
          }
        }

        alert(errorMessage);
      } else if (error.response.status === 401) {
        alert('Session expired. Please sign in again.');
        handleSignOut();
      } else if (error.response.status === 500) {
        alert('Server error. Please check the console for details and try again later.');
        console.error('Server error response:', error.response.data);
      } else {
        alert(`Error: ${error.response.status} - ${error.response.data?.message || 'An unknown error occurred'}`);
      }
    } else {
      alert('Failed to save configuration. Please try again.');
    }
  } finally {
    loading.value = false;
  }
}

async function deleteConfig(id) {
  if (!confirm('Are you sure you want to delete this parameter?')) return

  try {
    loading.value = true
    await appConfigService.deleteConfig(id)
    appConfigs.value = appConfigs.value.filter(config => config.id !== id)
  } catch (error) {
    console.error('Failed to delete configuration:', error)
  } finally {
    loading.value = false
  }
}

async function handleSignOut() {
  try {
    await signOut()
    router.push('/signin')
  } catch (error) {
    console.error('Sign out failed:', error)
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .grid-cols-5 {
    grid-template-columns: 1fr;
  }
}
</style>