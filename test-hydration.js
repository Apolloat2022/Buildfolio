// test-hydration.js
console.log('Testing hydration fix...')

// Check if components load without errors
setTimeout(() => {
  console.log('Page loaded, checking for errors...')
  
  // Check for hydration errors
  const errors = performance.getEntriesByType('resource')
    .filter(r => r.name.includes('.js') && r.initiatorType === 'script')
  
  console.log('Scripts loaded:', errors.length)
  
  // Monitor for new errors
  window.addEventListener('error', (e) => {
    console.log('Error caught:', e.message)
  })
}, 1000)
