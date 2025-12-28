<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">3D Product Viewer</h1>
      <p class="text-slate-300">View and interact with 3D models</p>
    </div>

    <Card class="p-0 overflow-hidden">
      <div ref="viewerContainer" class="w-full h-[600px] bg-slate-900"></div>
      
      <div class="p-6 border-t border-slate-800">
        <div class="flex items-center gap-4">
          <Input
            v-model="modelUrl"
            label="Model URL"
            placeholder="https://example.com/model.glb"
            class="flex-1"
          />
          <Button @click="loadNewModel" :loading="loading">
            Load Model
          </Button>
          <Button v-if="isARSupported" variant="ghost" @click="startAR">
            AR Mode
          </Button>
        </div>
        <p v-if="error" class="text-red-400 text-sm mt-2">{{ error }}</p>
      </div>
    </Card>

    <Card class="mt-6">
      <template #header>
        <h2 class="text-lg font-semibold text-white">Controls</h2>
      </template>
      <div class="space-y-2 text-sm text-slate-400">
        <p><strong class="text-white">Left Click + Drag:</strong> Rotate model</p>
        <p><strong class="text-white">Right Click + Drag:</strong> Pan camera</p>
        <p><strong class="text-white">Scroll:</strong> Zoom in/out</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { loadModel, animate, dispose, loading, error } = use3DModel()
const { isARSupported, startARSession } = useAR()
const { success } = useNotification()

const viewerContainer = ref<HTMLElement>()
const modelUrl = ref('https://cdn.jsdelivr.net/npm/@pmndrs/assets@1/models/gltf/box.gltf')

const loadNewModel = async () => {
  if (!viewerContainer.value || !modelUrl.value) return
  
  dispose()
  try {
    await loadModel(modelUrl.value, viewerContainer.value)
    animate()
    success('Model loaded', 'Your 3D model has been loaded successfully')
  } catch (e: any) {
    console.error('Failed to load model:', e)
  }
}

const startAR = async () => {
  try {
    await startARSession(modelUrl.value)
  } catch (e: any) {
    console.error('Failed to start AR:', e)
  }
}

onMounted(() => {
  if (viewerContainer.value && modelUrl.value) {
    loadNewModel()
  }
})

onUnmounted(() => {
  dispose()
})
</script>
