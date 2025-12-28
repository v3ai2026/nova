export interface Model3D {
  id: string
  name: string
  url: string
  format: 'gltf' | 'glb' | 'obj' | 'fbx'
  thumbnail?: string
  scale?: number
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
}

export const use3DModel = () => {
  const models = ref<Model3D[]>([])
  const currentModel = ref<Model3D | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const viewerReady = ref(false)

  const loadModel = async (modelUrl: string, format: Model3D['format'] = 'gltf') => {
    loading.value = true
    error.value = null
    
    try {
      // In a real implementation, this would use a 3D library like Three.js
      currentModel.value = {
        id: crypto.randomUUID(),
        name: modelUrl.split('/').pop() || 'model',
        url: modelUrl,
        format,
        scale: 1,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      }
      return currentModel.value
    } catch (e: any) {
      error.value = e.message || 'Failed to load 3D model'
      console.error('Error loading 3D model:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateModelTransform = (transform: Partial<Pick<Model3D, 'scale' | 'position' | 'rotation'>>) => {
    if (!currentModel.value) return

    if (transform.scale !== undefined) {
      currentModel.value.scale = transform.scale
    }
    if (transform.position) {
      currentModel.value.position = { ...currentModel.value.position!, ...transform.position }
    }
    if (transform.rotation) {
      currentModel.value.rotation = { ...currentModel.value.rotation!, ...transform.rotation }
    }
  }

  const resetModel = () => {
    if (!currentModel.value) return

    currentModel.value.scale = 1
    currentModel.value.position = { x: 0, y: 0, z: 0 }
    currentModel.value.rotation = { x: 0, y: 0, z: 0 }
  }

  const clearModel = () => {
    currentModel.value = null
    viewerReady.value = false
  }

  const captureSnapshot = (): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        // In a real implementation, this would capture the 3D canvas
        // For now, return a placeholder
        resolve(null)
      } catch (e) {
        console.error('Error capturing snapshot:', e)
        resolve(null)
      }
    })
  }

  return {
    models,
    currentModel,
    loading,
    error,
    viewerReady,
    loadModel,
    updateModelTransform,
    resetModel,
    clearModel,
    captureSnapshot
  }
}
