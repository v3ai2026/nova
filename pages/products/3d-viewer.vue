<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">3D Product Viewer</h1>
          <p class="text-slate-300">View and interact with 3D models in your browser</p>
        </div>
        <div class="flex items-center gap-3">
          <Button 
            v-if="arSupported"
            variant="success" 
            :iconLeft="Smartphone"
            @click="launchAR"
          >
            View in AR
          </Button>
          <Button 
            variant="ghost" 
            :iconLeft="Upload"
            @click="showUploadModal = true"
          >
            Upload Model
          </Button>
        </div>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <div class="flex items-start gap-4">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Box class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 class="font-semibold text-slate-900 dark:text-white mb-1">3D Visualization</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              View and interact with 3D models in real-time
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-start gap-4">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Smartphone class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 class="font-semibold text-slate-900 dark:text-white mb-1">AR Experience</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              View products in augmented reality on mobile
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-start gap-4">
          <div class="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <Maximize class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 class="font-semibold text-slate-900 dark:text-white mb-1">Full Control</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Rotate, zoom, and customize your viewing experience
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Main 3D Viewer -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <Product3DViewer :modelUrl="selectedModelUrl" :height="600" />
      </div>

      <!-- Model Library -->
      <div>
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Sample Models</h3>
          </template>

          <div class="space-y-3">
            <div
              v-for="model in sampleModels"
              :key="model.id"
              @click="selectModel(model)"
              class="p-3 rounded-lg border-2 cursor-pointer transition-all"
              :class="
                selectedModelUrl === model.url
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
              "
            >
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <Box class="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-slate-900 dark:text-white truncate">
                    {{ model.name }}
                  </h4>
                  <p class="text-xs text-slate-600 dark:text-slate-400">
                    {{ model.format.toUpperCase() }} • {{ model.size }}
                  </p>
                </div>
                <Badge :variant="selectedModelUrl === model.url ? 'success' : 'default'">
                  {{ selectedModelUrl === model.url ? 'Active' : 'Load' }}
                </Badge>
              </div>
            </div>

            <div v-if="sampleModels.length === 0" class="text-center py-8">
              <Box class="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p class="text-sm text-slate-600 dark:text-slate-400">
                No sample models available
              </p>
            </div>
          </div>
        </Card>

        <!-- AR Info Card -->
        <Card class="mt-6" v-if="arSupported">
          <template #header>
            <div class="flex items-center gap-2">
              <Smartphone class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">AR Ready</h3>
            </div>
          </template>

          <div class="space-y-3">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Your device supports augmented reality! Click "View in AR" to see the model in your space.
            </p>
            <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <ul class="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Point your camera at a flat surface</li>
                <li>• Tap to place the object</li>
                <li>• Pinch to resize</li>
                <li>• Drag to move</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Upload Modal -->
    <Modal :isOpen="showUploadModal" @close="showUploadModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Upload 3D Model</h3>
      </template>

      <div class="space-y-4">
        <div class="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center">
          <Upload class="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Drag and drop your 3D model file here, or click to browse
          </p>
          <p class="text-xs text-slate-500">
            Supported formats: GLTF, GLB, OBJ, FBX
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="ghost" @click="showUploadModal = false">
            Cancel
          </Button>
          <Button>
            Upload
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Box, Smartphone, Upload, Maximize } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { checkARSupport } = useAR()
const { success } = useNotification()

const showUploadModal = ref(false)
const selectedModelUrl = ref('')
const arSupported = ref(false)

const sampleModels = ref([
  {
    id: '1',
    name: 'Sample Cube',
    url: '/models/cube.gltf',
    format: 'gltf',
    size: '2.5 MB'
  },
  {
    id: '2',
    name: 'Product Demo',
    url: '/models/product.glb',
    format: 'glb',
    size: '5.1 MB'
  },
  {
    id: '3',
    name: 'Character Model',
    url: '/models/character.fbx',
    format: 'fbx',
    size: '8.3 MB'
  }
])

const selectModel = (model: any) => {
  selectedModelUrl.value = model.url
  success('Model Loaded', `Loading ${model.name}...`)
}

const launchAR = () => {
  if (!selectedModelUrl.value) {
    return
  }
  // AR launch logic would go here
  success('AR Launched', 'Opening AR viewer...')
}

onMounted(async () => {
  arSupported.value = await checkARSupport()
  
  // Load first model by default
  if (sampleModels.value.length > 0) {
    selectedModelUrl.value = sampleModels.value[0].url
  }
})
</script>
