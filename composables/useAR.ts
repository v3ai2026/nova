export const useAR = () => {
  const isARSupported = ref(false)
  const isARActive = ref(false)

  const checkARSupport = async () => {
    if ('xr' in navigator) {
      try {
        // @ts-ignore - WebXR 类型可能不完整
        const supported = await navigator.xr.isSessionSupported('immersive-ar')
        isARSupported.value = supported
      } catch (e) {
        isARSupported.value = false
      }
    } else {
      isARSupported.value = false
    }
  }

  const startARSession = async (modelUrl: string) => {
    if (!isARSupported.value) {
      alert('您的设备不支持 AR 功能')
      return
    }

    try {
      // @ts-ignore
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      })

      isARActive.value = true

      // 这里需要实现完整的 WebXR 会话管理
      // 由于篇幅限制，这里仅提供框架

      session.addEventListener('end', () => {
        isARActive.value = false
      })

      return session
    } catch (e) {
      console.error('启动 AR 会话失败:', e)
      alert('无法启动 AR 功能，请在支持的设备上尝试')
    }
  }

  onMounted(() => {
    checkARSupport()
  })

  return {
    isARSupported,
    isARActive,
    checkARSupport,
    startARSession
  }
}
