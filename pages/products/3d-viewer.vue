<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        3D 产品查看器
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        体验沉浸式 3D 产品展示和 AR 功能
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 3D 查看器 -->
      <Product3DViewer
        :modelUrl="currentProduct.modelUrl"
        :productName="currentProduct.name"
        :productDescription="currentProduct.description"
        :productPrice="currentProduct.price"
      />

      <!-- 产品列表 -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">
          选择产品
        </h2>
        
        <div class="space-y-3">
          <Card
            v-for="product in products"
            :key="product.id"
            class="cursor-pointer hover:shadow-lg transition"
            :class="{ 'ring-2 ring-blue-500': currentProduct.id === product.id }"
            @click="currentProduct = product"
          >
            <div class="p-4 flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-slate-900 dark:text-white">
                  {{ product.name }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  {{ product.description }}
                </p>
                <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                  ¥{{ product.price }}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const products = ref([
  {
    id: '1',
    name: 'AirPods Pro',
    description: '主动降噪无线耳机',
    price: 1999,
    // Demo URL - 实际使用时应替换为真实产品模型
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: '钛金属边框智能手机',
    price: 7999,
    // Demo URL - 实际使用时应替换为真实产品模型
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb'
  },
  {
    id: '3',
    name: 'MacBook Pro',
    description: 'M3 Max 芯片专业笔记本',
    price: 19999,
    // Demo URL - 实际使用时应替换为真实产品模型
    modelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf'
  }
])

const currentProduct = ref(products.value[0])
</script>
