<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">3D Product Viewer</h1>
      <p class="text-slate-300">View and interact with 3D product models</p>
    </div>

    <!-- Product Selection -->
    <div v-if="!selectedProduct" class="space-y-6">
      <Card>
        <template #header>
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Select a Product</h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            v-for="product in products"
            :key="product.id"
            @click="selectProduct(product)"
            class="group relative overflow-hidden rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
          >
            <div class="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
              <Box class="w-16 h-16 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div class="p-4 bg-white dark:bg-slate-800">
              <h3 class="font-semibold text-slate-900 dark:text-white mb-1">{{ product.name }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ product.description }}</p>
            </div>
          </button>
        </div>
      </Card>
    </div>

    <!-- Product 3D Viewer -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <Button variant="ghost" :iconLeft="ArrowLeft" @click="selectedProduct = null">
          Back to Products
        </Button>
        <div class="flex items-center gap-4">
          <Badge variant="info">3D Model</Badge>
          <Badge v-if="arSupported" variant="success">AR Ready</Badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 3D Viewer -->
        <div class="lg:col-span-2">
          <Product3DViewer
            :modelUrl="selectedProduct.modelUrl"
            @close="selectedProduct = null"
          />
        </div>

        <!-- Product Info -->
        <div>
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Product Details</h3>
            </template>

            <div class="space-y-4">
              <div>
                <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {{ selectedProduct.name }}
                </h4>
                <p class="text-slate-600 dark:text-slate-400">
                  {{ selectedProduct.description }}
                </p>
              </div>

              <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h5 class="font-medium text-slate-900 dark:text-white mb-3">Specifications</h5>
                <div class="space-y-2">
                  <div
                    v-for="(value, key) in selectedProduct.specs"
                    :key="key"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-slate-600 dark:text-slate-400">{{ key }}:</span>
                    <span class="font-medium text-slate-900 dark:text-white">{{ value }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h5 class="font-medium text-slate-900 dark:text-white mb-3">Actions</h5>
                <div class="space-y-2">
                  <Button variant="secondary" :iconLeft="Download" class="w-full">
                    Download Model
                  </Button>
                  <Button variant="secondary" :iconLeft="Share2" class="w-full">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Box, ArrowLeft, Download, Share2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

interface Product {
  id: string
  name: string
  description: string
  modelUrl: string
  specs: Record<string, string>
}

const { state: arState } = useAR()
const arSupported = computed(() => arState.value.supported)

const selectedProduct = ref<Product | null>(null)

const products: Product[] = [
  {
    id: '1',
    name: 'Modern Chair',
    description: 'Ergonomic office chair with adjustable features',
    modelUrl: '/models/chair.glb',
    specs: {
      'Material': 'Mesh & Metal',
      'Dimensions': '65 x 65 x 120 cm',
      'Weight': '15 kg',
      'Color': 'Black'
    }
  },
  {
    id: '2',
    name: 'Coffee Table',
    description: 'Minimalist coffee table with wooden top',
    modelUrl: '/models/table.glb',
    specs: {
      'Material': 'Oak Wood',
      'Dimensions': '120 x 60 x 45 cm',
      'Weight': '25 kg',
      'Color': 'Natural Wood'
    }
  },
  {
    id: '3',
    name: 'Desk Lamp',
    description: 'LED desk lamp with touch controls',
    modelUrl: '/models/lamp.glb',
    specs: {
      'Material': 'Aluminum',
      'Dimensions': '15 x 15 x 45 cm',
      'Weight': '1.5 kg',
      'Light': 'LED 10W'
    }
  },
  {
    id: '4',
    name: 'Bookshelf',
    description: 'Modular bookshelf system',
    modelUrl: '/models/bookshelf.glb',
    specs: {
      'Material': 'Pine Wood',
      'Dimensions': '80 x 30 x 180 cm',
      'Weight': '30 kg',
      'Shelves': '5 Levels'
    }
  },
  {
    id: '5',
    name: 'Monitor Stand',
    description: 'Adjustable monitor stand with storage',
    modelUrl: '/models/stand.glb',
    specs: {
      'Material': 'Metal & Wood',
      'Dimensions': '50 x 20 x 10 cm',
      'Weight': '3 kg',
      'Max Load': '15 kg'
    }
  },
  {
    id: '6',
    name: 'Keyboard Tray',
    description: 'Under-desk keyboard tray',
    modelUrl: '/models/tray.glb',
    specs: {
      'Material': 'Plastic & Metal',
      'Dimensions': '60 x 30 x 5 cm',
      'Weight': '2 kg',
      'Adjustable': 'Yes'
    }
  }
]

const selectProduct = (product: Product) => {
  selectedProduct.value = product
}
</script>
