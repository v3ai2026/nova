<template>
  <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
    <!-- 3D 视图容器 -->
    <div class="relative h-96 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <div 
        ref="containerRef" 
        class="w-full h-full"
      ></div>

      <!-- 加载状态 -->
      <div 
        v-if="loading" 
        class="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      >
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p class="text-white font-medium">加载 3D 模型中...</p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div 
        v-if="error" 
        class="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20"
      >
        <div class="text-center p-6">
          <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600 dark:text-red-400 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="absolute top-4 right-4 flex gap-2">
        <button
          @click="resetCamera"
          class="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-700 transition shadow-lg"
          title="重置视角"
        >
          <RotateCcw class="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
        <button
          @click="toggleAutoRotate"
          class="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-700 transition shadow-lg"
          :title="autoRotate ? '停止旋转' : '自动旋转'"
        >
          <RotateCw :class="autoRotate ? 'animate-spin' : ''" class="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
      </div>
    </div>

    <!-- 产品信息和操作 -->
    <div class="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {{ productName }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ productDescription }}
          </p>
        </div>
        
        <div class="flex items-center gap-2">
          <Badge v-if="productPrice" variant="primary">
            ¥{{ productPrice }}
          </Badge>
        </div>
      </div>

      <!-- AR 按钮 -->
      <div class="flex gap-3">
        <Button
          v-if="isARSupported"
          @click="handleARView"
          variant="primary"
          :iconLeft="Smartphone"
          class="flex-1"
        >
          在 AR 中查看
        </Button>
        <Button
          v-else
          variant="secondary"
          disabled
          class="flex-1"
        >
          <span class="flex items-center gap-2">
            <XCircle class="w-4 h-4" />
            设备不支持 AR
          </span>
        </Button>

        <Button
          @click="handleShare"
          variant="outline"
          :iconLeft="Share2"
        >
          分享
        </Button>
      </div>

      <!-- 提示信息 -->
      <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p class="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
          <Info class="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>拖动查看不同角度，滚轮缩放，双指旋转。AR 功能需要在支持 WebXR 的设备上使用。</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RotateCcw, RotateCw, Smartphone, Share2, AlertCircle, XCircle, Info } from 'lucide-vue-next'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface Props {
  modelUrl: string
  productName?: string
  productDescription?: string
  productPrice?: number
}

const props = withDefaults(defineProps<Props>(), {
  productName: '3D 产品模型',
  productDescription: '拖动查看产品细节',
  productPrice: undefined
})

const containerRef = ref<HTMLElement | null>(null)
const { loading, error, scene, camera, renderer, loadModel, animate, dispose } = use3DModel()
const { isARSupported, startARSession } = useAR()
const autoRotate = ref(true)
let controls: OrbitControls | null = null

onMounted(async () => {
  if (!containerRef.value) return

  const success = await loadModel(props.modelUrl, containerRef.value)
  
  if (success && camera.value && renderer.value) {
    // 添加轨道控制
    controls = new OrbitControls(camera.value, renderer.value.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = autoRotate.value
    controls.autoRotateSpeed = 2

    // 启动动画循环
    const animateLoop = () => {
      requestAnimationFrame(animateLoop)
      if (controls) {
        controls.update()
      }
      if (scene.value && camera.value && renderer.value) {
        renderer.value.render(scene.value, camera.value)
      }
    }
    animateLoop()
  }

  // 处理窗口大小变化
  const handleResize = () => {
    if (!containerRef.value || !camera.value || !renderer.value) return
    
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight
    
    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(width, height)
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    dispose()
    if (controls) {
      controls.dispose()
    }
  })
})

const resetCamera = () => {
  if (camera.value && controls) {
    camera.value.position.set(0, 0, 5)
    controls.reset()
  }
}

const toggleAutoRotate = () => {
  autoRotate.value = !autoRotate.value
  if (controls) {
    controls.autoRotate = autoRotate.value
  }
}

const handleARView = async () => {
  await startARSession(props.modelUrl)
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: props.productName,
      text: props.productDescription,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}
</script>
