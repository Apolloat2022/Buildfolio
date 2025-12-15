// Run in browser console to diagnose
console.log('Diagnosing hydration issues...')

// Check for any script errors
window.addEventListener('error', (e) => {
  console.log('Error:', e.message, 'in', e.filename, 'line', e.lineno)
})

// Check if React is loaded
console.log('React loaded:', typeof React !== 'undefined')
console.log('React version:', React?.version)

// Check for hydration warnings
const originalError = console.error
console.error = function(...args) {
  originalError.apply(console, args)
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('418') || args[0].includes('423') || args[0].includes('hydration')) {
      console.log('🚨 HYDRATION ERROR DETECTED:', args)
    }
  }
}

// Check for QuizModal in DOM
setTimeout(() => {
  const modals = document.querySelectorAll('[class*="modal"], [class*="Modal"]')
  console.log('Modals in DOM:', modals.length)
}, 1000)
