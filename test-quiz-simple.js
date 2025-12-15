// test-quiz-simple.js
console.log('Testing simple quiz fix...')

// Test 1: Check if MarkCompleteButton renders
const button = document.querySelector('button:contains("Mark Complete")')
console.log('MarkCompleteButton:', button ? '✅ Found' : '❌ Not found')

// Test 2: Check if API endpoint works
fetch('/api/quiz/questions?stepId=test')
  .then(res => console.log('API status:', res.status))
  .catch(err => console.log('API error:', err))

// Test 3: Check for errors
window.addEventListener('error', e => {
  console.error('Error:', e.message, e.filename, e.lineno)
})
