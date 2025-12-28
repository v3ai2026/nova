import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export const use3DModel = () => {
  const scene = ref<THREE.Scene | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const model = ref<THREE.Group | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadModel = async (url: string, container: HTMLElement) => {
    loading.value = true
    error.value = null

    try {
      // 初始化场景
      scene.value = new THREE.Scene()
      scene.value.background = new THREE.Color(0xf5f5f5)

      // 初始化相机
      const aspect = container.clientWidth / container.clientHeight
      camera.value = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000)
      camera.value.position.set(0, 0, 5)

      // 初始化渲染器
      renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.value.setSize(container.clientWidth, container.clientHeight)
      renderer.value.setPixelRatio(window.devicePixelRatio)
      renderer.value.shadowMap.enabled = true
      container.appendChild(renderer.value.domElement)

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.value.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 5, 5)
      directionalLight.castShadow = true
      scene.value.add(directionalLight)

      const spotLight = new THREE.SpotLight(0xffffff, 0.5)
      spotLight.position.set(-5, 5, 5)
      scene.value.add(spotLight)

      // 加载模型
      const loader = new GLTFLoader()
      
      // 可选：添加 Draco 压缩支持
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
      loader.setDRACOLoader(dracoLoader)

      const gltf = await loader.loadAsync(url)
      model.value = gltf.scene

      // 居中模型
      const box = new THREE.Box3().setFromObject(model.value)
      const center = box.getCenter(new THREE.Vector3())
      model.value.position.sub(center)

      // 调整模型大小
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim
      model.value.scale.setScalar(scale)

      scene.value.add(model.value)

      loading.value = false
      return true
    } catch (e: any) {
      error.value = e.message || '模型加载失败'
      loading.value = false
      return false
    }
  }

  const animate = () => {
    if (!scene.value || !camera.value || !renderer.value) return

    requestAnimationFrame(animate)

    // 自动旋转模型
    if (model.value) {
      model.value.rotation.y += 0.005
    }

    renderer.value.render(scene.value, camera.value)
  }

  const dispose = () => {
    if (renderer.value) {
      renderer.value.dispose()
      renderer.value.domElement.remove()
    }
    if (scene.value) {
      scene.value.clear()
    }
    model.value = null
    scene.value = null
    camera.value = null
    renderer.value = null
  }

  return {
    scene,
    camera,
    renderer,
    model,
    loading,
    error,
    loadModel,
    animate,
    dispose
  }
}
