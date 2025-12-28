<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">3D Product Viewer</h3>
        <div class="flex items-center gap-2">
          <Tooltip text="Reset Camera">
            <Button variant="ghost" size="sm" :iconLeft="RotateCcw" @click="handleResetCamera" />
          </Tooltip>
          <Tooltip text="Toggle Auto-Rotate">
            <Button variant="ghost" size="sm" :iconLeft="RotateCw" @click="handleToggleRotate" />
          </Tooltip>
          <Tooltip text="Start AR">
            <Button
              variant="ghost"
              size="sm"
              :iconLeft="Smartphone"
              :disabled="!arSupported"
              @click="handleStartAR"
            />
          </Tooltip>
        </div>
      </div>
    </template>

    <!-- 3D Viewer Container -->
    <div class="relative">
      <div
        v-if="!state.loaded && !state.loading"
        class="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center"
      >
        <div class="text-center">
          <Box class="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p class="text-slate-600 dark:text-slate-400">Load a 3D model to view</p>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="state.loading"
        class="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center"
      >
        <div class="text-center">
          <LoadingSpinner />
          <p class="text-slate-600 dark:text-slate-400 mt-4">
            Loading model... {{ state.progress }}%
          </p>
          <div class="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div
              class="h-full bg-blue-500 transition-all duration-300"
              :style="{ width: `${state.progress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-if="state.error"
        class="aspect-video bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center justify-center border border-red-200 dark:border-red-800"
      >
        <div class="text-center">
          <AlertCircle class="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p class="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load model</p>
          <p class="text-sm text-red-500 dark:text-red-300">{{ state.error }}</p>
        </div>
      </div>

      <!-- 3D Canvas (placeholder for actual 3D rendering) -->
      <div
        v-if="state.loaded"
        ref="canvasContainer"
        class="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg"
      >
        <div class="w-full h-full flex items-center justify-center text-white">
          <div class="text-center">
            <Box class="w-16 h-16 mx-auto mb-4" />
            <p class="text-lg font-medium">3D Model Loaded</p>
            <p class="text-sm text-slate-400 mt-2">
              In production, this would render using Three.js or Babylon.js
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div v-if="state.loaded" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-slate-600 dark:text-slate-400">
        Use mouse to rotate, scroll to zoom
      </div>
      <Button variant="ghost" size="sm" @click="emit('close')">
        Close Viewer
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Box, RotateCcw, RotateCw, Smartphone, AlertCircle } from 'lucide-vue-next'

interface Props {
  modelUrl?: string
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { state, loadModel, resetCamera, toggleAutoRotate } = use3DModel()
const { state: arState, startAR } = useAR()

const canvasContainer = ref<HTMLElement>()
const arSupported = computed(() => arState.value.supported)

const handleResetCamera = () => {
  resetCamera()
}

const handleToggleRotate = () => {
  toggleAutoRotate()
}

const handleStartAR = async () => {
  const success = await startAR()
  if (success) {
    const { success: notify } = useNotification()
    notify('AR Mode', 'AR mode activated')
  }
}

// Load model when URL changes
watch(() => props.modelUrl, (url) => {
  if (url) {
    loadModel(url)
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  const { dispose } = use3DModel()
  dispose()
})
</script>
