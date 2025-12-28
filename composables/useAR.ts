// WebXR AR composable
// Note: WebXR support varies by browser and device

export const useAR = () => {
  const isARSupported = ref(false)
  const arSession = ref<any>(null)
  const loading = useState('arLoading', () => false)
  const error = useState<string | null>('arError', () => null)

  const checkARSupport = async () => {
    if (process.client) {
      try {
        // Check if WebXR is available
        if ('xr' in navigator) {
          isARSupported.value = await (navigator as any).xr.isSessionSupported('immersive-ar')
        } else {
          isARSupported.value = false
        }
      } catch (e) {
        console.error('Error checking AR support:', e)
        isARSupported.value = false
      }
    }
    return isARSupported.value
  }

  const startARSession = async (modelUrl: string) => {
    if (!isARSupported.value) {
      error.value = 'AR is not supported on this device'
      throw new Error('AR not supported')
    }

    loading.value = true
    error.value = null

    try {
      if (process.client && 'xr' in navigator) {
        const xr = (navigator as any).xr
        
        // Request AR session
        const session = await xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test', 'dom-overlay'],
          domOverlay: { root: document.body }
        })

        arSession.value = session

        // Setup WebXR with Three.js
        const THREE = await import('three')
        const { ARButton } = await import('three/examples/jsm/webxr/ARButton.js')

        // Initialize AR scene
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.xr.enabled = true

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          70,
          window.innerWidth / window.innerHeight,
          0.01,
          20
        )

        // Load model for AR
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        const loader = new GLTFLoader()
        
        loader.load(modelUrl, (gltf) => {
          const model = gltf.scene
          model.scale.set(0.5, 0.5, 0.5)
          scene.add(model)
        })

        // Add lighting
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
        light.position.set(0.5, 1, 0.25)
        scene.add(light)

        // Animation loop
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera)
        })

        session.addEventListener('end', () => {
          arSession.value = null
          renderer.setAnimationLoop(null)
        })

        return session
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to start AR session'
      throw e
    } finally {
      loading.value = false
    }
  }

  const endARSession = async () => {
    if (arSession.value) {
      await arSession.value.end()
      arSession.value = null
    }
  }

  // Check support on mount (client-side only)
  onMounted(() => {
    if (process.client) {
      checkARSupport()
    }
  })

  return {
    isARSupported: readonly(isARSupported),
    arSession: readonly(arSession),
    loading: readonly(loading),
    error: readonly(error),
    checkARSupport,
    startARSession,
    endARSession
  }
}
