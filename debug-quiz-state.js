// debug-quiz-state.js
console.log('🔍 DEBUGGING QUIZ STATE')

// Check if MarkCompleteButton exists
const buttons = document.querySelectorAll('button')
const markCompleteBtn = Array.from(buttons).find(btn => 
  btn.textContent.includes('Mark Complete') || 
  btn.textContent.includes('Complete')
)

console.log('MarkCompleteButton found:', !!markCompleteBtn)
if (markCompleteBtn) {
  console.log('Button HTML:', markCompleteBtn.outerHTML)
  console.log('Button classes:', markCompleteBtn.className)
  
  // Check event listeners
  console.log('Button parent:', markCompleteBtn.parentElement?.className)
}

// Check for any React errors
const originalConsoleError = console.error
console.error = function(...args) {
  originalConsoleError.apply(console, args)
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('418') || args[0].includes('423') || args[0].includes('hydration')) {
      console.log('🚨 REACT HYDRATION ERROR DETECTED:', args)
    }
  }
}

// Check for quiz modal in DOM
const modal = document.querySelector('[class*="modal"], [class*="Modal"], [class*="quiz"]')
console.log('Quiz modal in DOM:', !!modal)

// Check for any hidden divs
const hiddenElements = document.querySelectorAll('div[style*="display: none"], div[class*="hidden"]')
console.log('Hidden elements count:', hiddenElements.length)

// Check CSS
const styles = document.querySelectorAll('style, link[rel="stylesheet"]')
console.log('CSS stylesheets:', styles.length)
