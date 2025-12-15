// test-double-click-fix.js
console.log('Testing double highlight fix...')

// Test event bubbling
document.addEventListener('click', (e) => {
  console.log('Click event at:', e.target.tagName, e.target.className)
})

// Test button clicks
const testButtonClick = () => {
  const button = document.querySelector('button[class*="border-gray"]')
  if (button) {
    console.log('Found quiz option button')
    
    // Simulate click
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
    
    // Check how many event listeners fire
    button.addEventListener('click', (e) => {
      console.log('Button click handler fired')
      e.stopPropagation()
    }, { once: true })
    
    button.dispatchEvent(clickEvent)
  }
}

console.log('Run testButtonClick() to test event handling')
