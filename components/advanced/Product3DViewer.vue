<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
            <Box class="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">3D Product Viewer</h3>
        </div>
        <div class="flex items-center gap-2">
          <Tooltip text="Reset view">
            <Button variant="ghost" size="sm" :iconLeft="RotateCcw" @click="resetView" />
          </Tooltip>
          <Tooltip text="Take snapshot">
            <Button variant="ghost" size="sm" :iconLeft="Camera" @click="takeSnapshot" />
          </Tooltip>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- 3D Viewer Container -->
      <div 
        ref="viewerContainer"
        class="relative w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden"
        :style="{ height: `${viewerHeight}px` }"
      >
        <div v-if="!currentModel" class="absolute inset-0 flex items-center justify-center">
          <div class="text-center space-y-3">
            <Box class="w-16 h-16 text-slate-400 mx-auto" />
            <div>
              <p class="text-slate-600 dark:text-slate-400 font-medium">No 3D model loaded</p>
              <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Load a GLTF, GLB, OBJ, or FBX file to view
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="loading" class="absolute inset-0 flex items-center justify-center bg-slate-900/50">
          <div class="text-center space-y-3">
            <LoadingSpinner />
            <p class="text-white text-sm">Loading 3D model...</p>
          </div>
        </div>

        <canvas 
          v-show="viewerReady"
          ref="canvas" 
          class="w-full h-full"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @wheel="handleWheel"
        />

        <!-- Controls Overlay -->
        <div v-if="currentModel" class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div class="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs">
            <div class="flex items-center gap-4">
              <span>Drag to rotate</span>
              <span>Scroll to zoom</span>
            </div>
          </div>
          
          <div class="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs">
            Scale: {{ (currentModel.scale || 1).toFixed(2) }}x
          </div>
        </div>
      </div>

      <!-- Model Controls -->
      <div v-if="currentModel" class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Scale</label>
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1"
            :value="currentModel.scale || 1"
            @input="updateScale"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Rotation Y</label>
          <input 
            type="range" 
            min="0" 
            max="360" 
            step="1"
            :value="currentModel.rotation?.y || 0"
            @input="updateRotationY"
            class="w-full"
          />
        </div>
      </div>

      <!-- Model Info -->
      <div v-if="currentModel" class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <span class="text-slate-600 dark:text-slate-400">Name:</span>
            <span class="ml-2 text-slate-900 dark:text-white font-medium">{{ currentModel.name }}</span>
          </div>
          <div>
            <span class="text-slate-600 dark:text-slate-400">Format:</span>
            <Badge variant="info" class="ml-2">{{ currentModel.format.toUpperCase() }}</Badge>
          </div>
        </div>
      </div>

      <!-- Load Model Input -->
      <div class="flex gap-2">
        <Input
          v-model="modelUrl"
          placeholder="Enter 3D model URL (.gltf, .glb, .obj, .fbx)"
          :iconLeft="Link"
        />
        <Button @click="loadModelFromUrl" :loading="loading">
          Load
        </Button>
      </div>

      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Box, RotateCcw, Camera, Link } from 'lucide-vue-next'

const props = defineProps<{
  modelUrl?: string
  height?: number
}>()

const { 
  currentModel, 
  loading, 
  error, 
  viewerReady,
  loadModel, 
  updateModelTransform,
  resetModel,
  clearModel,
  captureSnapshot
} = use3DModel()

const { success, error: showError } = useNotification()

const viewerContainer = ref<HTMLDivElement>()
const canvas = ref<HTMLCanvasElement>()
const modelUrl = ref('')
const viewerHeight = computed(() => props.height || 500)

const isDragging = ref(false)
const lastMousePos = ref({ x: 0, y: 0 })

const loadModelFromUrl = async () => {
  if (!modelUrl.value) {
    showError('Error', 'Please enter a model URL')
    return
  }

  const format = modelUrl.value.split('.').pop()?.toLowerCase() as any
  const result = await loadModel(modelUrl.value, format)
  
  if (result) {
    success('Loaded', '3D model loaded successfully')
    viewerReady.value = true
  } else if (error.value) {
    showError('Load Failed', error.value)
  }
}

const updateScale = (e: Event) => {
  const scale = parseFloat((e.target as HTMLInputElement).value)
  updateModelTransform({ scale })
}

const updateRotationY = (e: Event) => {
  const y = parseFloat((e.target as HTMLInputElement).value)
  updateModelTransform({ rotation: { ...currentModel.value?.rotation!, y } })
}

const resetView = () => {
  resetModel()
  success('Reset', 'View has been reset to default')
}

const takeSnapshot = async () => {
  const snapshot = await captureSnapshot()
  if (snapshot) {
    success('Captured', 'Snapshot saved')
  } else {
    showError('Failed', 'Could not capture snapshot')
  }
}

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  lastMousePos.value = { x: e.clientX, y: e.clientY }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !currentModel.value) return
  
  const deltaX = e.clientX - lastMousePos.value.x
  const deltaY = e.clientY - lastMousePos.value.y
  
  const rotation = currentModel.value.rotation || { x: 0, y: 0, z: 0 }
  updateModelTransform({
    rotation: {
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5,
      z: rotation.z
    }
  })
  
  lastMousePos.value = { x: e.clientX, y: e.clientY }
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (!currentModel.value) return
  
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const newScale = Math.max(0.1, Math.min(3, (currentModel.value.scale || 1) + delta))
  updateModelTransform({ scale: newScale })
}

onMounted(() => {
  if (props.modelUrl) {
    modelUrl.value = props.modelUrl
    loadModelFromUrl()
  }
})

onUnmounted(() => {
  clearModel()
})
</script>
