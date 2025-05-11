<template>
  <div class="min-h-screen bg-gradient-to-b from-[#1e1e2f] to-[#1e1e24] p-8 text-white">
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
      <!-- Table Headers -->
      <div class="grid grid-cols-6 text-left mb-4" :style="{ color: colors.dashboardTitle, fontSize: '1.5rem' }">
        <div>App Version</div>
        <div>Min Required</div>
        <div>Force Update</div>
        <div>Maintenance</div>
        <div>Create Date</div>
        <div></div>
      </div>

      <div v-for="config in appConfigs" :key="config.id" class="grid grid-cols-6 items-center py-2">
        <div>{{ config.appVersion }}</div>
        <div>{{ config.minRequiredVersion }}</div>
        <div>{{ config.forceUpdate ? 'Yes' : 'No' }}</div>
        <div>{{ config.maintenanceMode ? 'Yes' : 'No' }}</div>
        <div>{{ formatDate(config.createdAt) }}</div>
        <div class="flex space-x-2">
          <Button size="sm" @click="editConfig(config)" class="bg-gradient-to-r from-[#2e69f5] to-[#2284f7] hover:from-[#1e59e5] hover:to-[#1274e7] text-white font-bold transition-all duration-200 cursor-pointer">Edit</Button>
          <Button size="sm" @click="deleteConfig(config.id)" class="bg-gradient-to-r from-[#f13941] to-[#f94f73] hover:from-[#e12931] hover:to-[#e93f63] text-white font-bold transition-all duration-200 cursor-pointer">Delete</Button>
        </div>
      </div>

      <!-- Add New Config Button -->
      <div class="mt-8">
        <Button @click="showCreateForm = true" class="bg-gradient-to-r from-[#00b6e2] to-[#00e8c8] hover:from-[#0194b8] hover:to-[#00b69e] text-white font-bold transition-all duration-200 cursor-pointer">
          Add New Configuration
        </Button>
      </div>

      <!-- Create/Edit Form -->
      <div v-if="showCreateForm || showEditForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-[#1e1e2f] p-6 rounded-lg w-full max-w-2xl">
          <h2 class="text-2xl mb-4">{{ showEditForm ? 'Edit Configuration' : 'Create New Configuration' }}</h2>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block mb-1">App Version</label>
              <Input v-model="formData.appVersion" placeholder="1.0.0" class="border-gray-600" />
            </div>
            <div>
              <label class="block mb-1">Min Required Version</label>
              <Input v-model="formData.minRequiredVersion" placeholder="1.0.0" class="border-gray-600" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="flex items-center">
              <label class="mr-2">Force Update:</label>
              <input type="checkbox" v-model="formData.forceUpdate" />
            </div>
            <div class="flex items-center">
              <label class="mr-2">Maintenance Mode:</label>
              <input type="checkbox" v-model="formData.maintenanceMode" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block mb-1">Features (JSON)</label>
            <textarea
              v-model="featuresJson"
              rows="4"
              class="w-full bg-[#2a2a3c] border border-gray-600 rounded p-2"
              @blur="validateFeatures"
            ></textarea>
            <p v-if="featuresError" class="text-red-500 text-sm mt-1">{{ featuresError }}</p>
          </div>

          <div class="mb-4">
            <label class="block mb-1">Remote Config (JSON)</label>
            <textarea
              v-model="remoteConfigJson"
              rows="4"
              class="w-full bg-[#2a2a3c] border border-gray-600 rounded p-2"
              @blur="validateRemoteConfig"
            ></textarea>
            <p v-if="remoteConfigError" class="text-red-500 text-sm mt-1">{{ remoteConfigError }}</p>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowDownIcon, UserIcon, ChevronDown } from 'lucide-vue-next'
import { colors } from '@/constants/theme'
import { useAuth } from '@/hooks/useAuth'
import { appConfigService } from '@/services/appConfig'

const router = useRouter()
const { signOut } = useAuth()

const loading = ref(true)
const appConfigs = ref([])
const showCreateForm = ref(false)
const showEditForm = ref(false)
const featuresJson = ref('{}')
const remoteConfigJson = ref('{}')
const featuresError = ref('')
const remoteConfigError = ref('')

const formData = ref({
  appVersion: '',
  minRequiredVersion: '',
  forceUpdate: false,
  maintenanceMode: false,
  features: {},
  remoteConfig: {}
})

const editingConfigId = ref(null)

const formHasErrors = computed(() => {
  return featuresError.value || remoteConfigError.value
})

onMounted(async () => {
  try {
    loading.value = true

    // Try to ensure we have a valid token first
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token in localStorage, checking if we can get a fresh one...')
      await refreshUserToken()
    } else {
      console.log('Found token in localStorage, length:', token.length)
    }

    // Now try to fetch configurations
    await fetchConfigurations()
  } catch (error) {
    console.error('Failed to initialize dashboard:', error)
  } finally {
    loading.value = false
  }
})

// Function to refresh user token
async function refreshUserToken() {
  try {
    const { getIdToken } = useAuth()
    const newToken = await getIdToken(true)
    if (newToken) {
      localStorage.setItem('token', newToken)
      console.log('Token refreshed and saved to localStorage')
      return true
    } else {
      console.warn('Could not get a fresh token')
      return false
    }
  } catch (error) {
    console.error('Error refreshing token:', error)
    return false
  }
}

// Function to fetch configurations
async function fetchConfigurations() {
  try {
    console.log('Fetching configurations...')
    const data = await appConfigService.getAllConfigs()
    console.log('Configurations fetched successfully:', data.length)
    appConfigs.value = data
  } catch (error) {
    console.error('Failed to fetch configurations:', error)

    // Try to refresh token on error
    if (error.response?.status === 401) {
      console.log('Unauthorized error, trying to refresh token...')
      const refreshed = await refreshUserToken()
      if (refreshed) {
        console.log('Token refreshed, trying to fetch configurations again...')
        try {
          const data = await appConfigService.getAllConfigs()
          appConfigs.value = data
          console.log('Configurations fetched after token refresh')
        } catch (retryError) {
          console.error('Still failed after token refresh:', retryError)
        }
      }
    }
  }
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function resetForm() {
  formData.value = {
    appVersion: '',
    minRequiredVersion: '',
    forceUpdate: false,
    maintenanceMode: false,
    features: {},
    remoteConfig: {}
  }
  featuresJson.value = '{}'
  remoteConfigJson.value = '{}'
  featuresError.value = ''
  remoteConfigError.value = ''
}

function validateFeatures() {
  try {
    // Parse JSON string to object
    const parsed = JSON.parse(featuresJson.value);

    // Check if it's an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      featuresError.value = 'Features must be a JSON object';
      return;
    }

    // Ensure all values are boolean
    let valid = true;
    Object.entries(parsed).forEach(([key, value]) => {
      if (typeof value !== 'boolean') {
        valid = false;
      }
    });

    if (!valid) {
      featuresError.value = 'All feature values must be boolean (true/false)';
      return;
    }

    // If all checks pass, update formData
    featuresError.value = '';
    formData.value.features = parsed;
  } catch (error) {
    featuresError.value = 'Invalid JSON format';
  }
}

function validateRemoteConfig() {
  try {
    // Parse JSON string to object
    const parsed = JSON.parse(remoteConfigJson.value);

    // Check if it's an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      remoteConfigError.value = 'Remote config must be a JSON object';
      return;
    }

    // Update formData if valid
    remoteConfigError.value = '';
    formData.value.remoteConfig = parsed;
  } catch (error) {
    remoteConfigError.value = 'Invalid JSON format';
  }
}

function cancelForm() {
  showCreateForm.value = false
  showEditForm.value = false
  resetForm()
}

function editConfig(config) {
  formData.value = {
    appVersion: config.appVersion,
    minRequiredVersion: config.minRequiredVersion,
    forceUpdate: config.forceUpdate,
    maintenanceMode: config.maintenanceMode,
    features: config.features,
    remoteConfig: config.remoteConfig
  }
  featuresJson.value = JSON.stringify(config.features, null, 2)
  remoteConfigJson.value = JSON.stringify(config.remoteConfig, null, 2)
  editingConfigId.value = config.id
  showEditForm.value = true
}

async function saveConfig() {
  validateFeatures();
  validateRemoteConfig();

  if (formHasErrors.value) return;

  try {
    loading.value = true;

    // Store features and remoteConfig separately, since we won't send them to the backend
    const savedFeatures = formData.value.features;
    const savedRemoteConfig = formData.value.remoteConfig;

    // Send only the basic fields to the backend
    const configToSave = {
      appVersion: formData.value.appVersion.trim(),
      minRequiredVersion: formData.value.minRequiredVersion.trim(),
      forceUpdate: Boolean(formData.value.forceUpdate),
      maintenanceMode: Boolean(formData.value.maintenanceMode),
      // Use empty objects as the backend requires these fields but rejects dynamic properties
      features: {},
      remoteConfig: {}
    };

    console.log('Saving configuration:', configToSave);

    if (showEditForm.value) {
      // Update existing config
      const updatedConfig = await appConfigService.updateConfig(editingConfigId.value, configToSave);

      // Merge the server response with our locally stored features and remoteConfig
      updatedConfig.features = savedFeatures;
      updatedConfig.remoteConfig = savedRemoteConfig;

      const index = appConfigs.value.findIndex(c => c.id === editingConfigId.value);
      if (index !== -1) {
        appConfigs.value[index] = updatedConfig;
      }

      console.log('Config updated successfully');
    } else {
      // Create new config
      const newConfig = await appConfigService.createConfig(configToSave);

      // Merge the server response with our locally stored features and remoteConfig
      newConfig.features = savedFeatures;
      newConfig.remoteConfig = savedRemoteConfig;

      appConfigs.value.push(newConfig);

      console.log('New config created successfully:', newConfig.id);
    }

    cancelForm();
  } catch (error) {
    console.error('Failed to save configuration:', error);

    // Show more details on validation errors
    if (error.response) {
      if (error.response.status === 400) {
        let errorMessage = 'Validation error';

        if (error.response.data && error.response.data.message) {
          if (Array.isArray(error.response.data.message)) {
            // Format detailed validation errors
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
  if (!confirm('Are you sure you want to delete this configuration?')) return

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
</style>