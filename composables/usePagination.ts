import { PAGINATION } from '~/utils/constants'

export const usePagination = (totalItems: Ref<number>, initialPerPage: number = PAGINATION.DEFAULT_PER_PAGE) => {
  const currentPage = ref(PAGINATION.DEFAULT_PAGE)
  const perPage = ref(initialPerPage)

  const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value))
  const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
  const endIndex = computed(() => Math.min(startIndex.value + perPage.value, totalItems.value))

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPreviousPage = computed(() => currentPage.value > 1)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  const setPerPage = (newPerPage: number) => {
    perPage.value = Math.min(newPerPage, PAGINATION.MAX_PER_PAGE)
    currentPage.value = 1
  }

  const reset = () => {
    currentPage.value = PAGINATION.DEFAULT_PAGE
  }

  return {
    currentPage,
    perPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    setPerPage,
    reset
  }
}
