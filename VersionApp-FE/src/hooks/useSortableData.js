import { ref, computed } from 'vue'

export function useSortableData(data, initialSortDirection = 'desc') {
  const sortDirection = ref(initialSortDirection)

  const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  }

  const sortByDate = (dateField = 'createdAt') => {
    return computed(() => {
      return [...data.value].sort((a, b) => {
        if (!a[dateField]) return sortDirection.value === 'asc' ? 1 : -1
        if (!b[dateField]) return sortDirection.value === 'asc' ? -1 : 1

        const dateA = a[dateField] instanceof Date ? a[dateField].getTime() : new Date(a[dateField]).getTime()
        const dateB = b[dateField] instanceof Date ? b[dateField].getTime() : new Date(b[dateField]).getTime()

        return sortDirection.value === 'asc'
          ? dateA - dateB  // Ascending
          : dateB - dateA  // Descending
      })
    })
  }

  return {
    sortDirection,
    toggleSortDirection,
    sortByDate
  }
}