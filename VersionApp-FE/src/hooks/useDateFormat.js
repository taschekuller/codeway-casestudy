/**
 * Custom hook for formatting dates, including special handling for Firestore timestamps
 */
export function useDateFormat() {
  /**
   * @param {Date|Object|string} date - Date to format (Date object, Firestore timestamp, or string)
   * @param {string} locale - Locale to use for formatting (default: 'en-GB')
   * @param {Object} options
   * @returns {string}
   */
  const formatDate = (date, locale = 'en-GB', options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) => {
    if (!date) return 'N/A'

    try {
      if (date && typeof date === 'object') {
        // Format with _seconds and _nanoseconds
        if (date._seconds && date._nanoseconds) {
          return new Date(date._seconds * 1000).toLocaleDateString(locale, options)
        }

        // Format with seconds and nanoseconds
        if (date.seconds && date.nanoseconds) {
          return new Date(date.seconds * 1000).toLocaleDateString(locale, options)
        }

        // If it's already a Date object
        if (date instanceof Date) {
          return date.toLocaleDateString(locale, options)
        }
      }

      // Try to parse as regular date string
      const parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) {
        return 'N/A'
      }

      return parsedDate.toLocaleDateString(locale, options)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'N/A'
    }
  }

  return {
    formatDate
  }
}