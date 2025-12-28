// Three.js composable for 3D model loading and rendering
// Note: This requires 'three' package to be installed

export const use3DModel = () => {
  const model = ref<any>(null)
  const scene = ref<any>(null)
  const camera = ref<any>(null)
  const renderer = ref<any>(null)
  const controls = ref<any>(null)
  const loading = useState('3dModelLoading', () => false)
  const error = useState<string | null>('3dModelError', () => null)

  const loadModel = async (modelUrl: string, container: HTMLElement) => {
    loading.value = true
    error.value = null

    try {
      // Dynamic import of Three.js to avoid SSR issues
      if (process.client) {
        const THREE = await import('three')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

        // Setup scene
        scene.value = new THREE.Scene()
        scene.value.background = new THREE.Color(0x1a1a1a)

        // Setup camera
        camera.value = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
        )
        camera.value.position.z = 5

        // Setup renderer
        renderer.value = new THREE.WebGLRenderer({ antialias: true })
        renderer.value.setSize(container.clientWidth, container.clientHeight)
        renderer.value.setPixelRatio(window.devicePixelRatio)
        container.appendChild(renderer.value.domElement)

        // Setup controls
        controls.value = new OrbitControls(camera.value, renderer.value.domElement)
        controls.value.enableDamping = true
        controls.value.dampingFactor = 0.05

        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.value.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 5, 5)
        scene.value.add(directionalLight)

        // Load model
        const loader = new GLTFLoader()
        const gltf = await new Promise((resolve, reject) => {
          loader.load(
            modelUrl,
            (gltf) => resolve(gltf),
            undefined,
            (error) => reject(error)
          )
        })

        model.value = gltf.scene
        scene.value.add(model.value)

        // Center model
        const box = new THREE.Box3().setFromObject(model.value)
        const center = box.getCenter(new THREE.Vector3())
        model.value.position.sub(center)

        return model.value
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to load 3D model'
      throw e
    } finally {
      loading.value = false
    }
  }

  const animate = () => {
    if (!renderer.value || !scene.value || !camera.value) return

    requestAnimationFrame(animate)
    
    if (controls.value) {
      controls.value.update()
    }
    
    renderer.value.render(scene.value, camera.value)
  }

  const dispose = () => {
    if (renderer.value) {
      renderer.value.dispose()
      renderer.value.domElement.remove()
    }
    if (controls.value) {
      controls.value.dispose()
    }
    model.value = null
    scene.value = null
    camera.value = null
    renderer.value = null
    controls.value = null
  }

  return {
    model: readonly(model),
    loading: readonly(loading),
    error: readonly(error),
    loadModel,
    animate,
    dispose
  }
}
