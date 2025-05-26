import React from 'react'

function ExpensiveTree() {
  const now = performance.now()
  while (performance.now() - now < 100) {
    // Emulate some expensive calculations which takes 300ms
  }
  return <div />
}

// Export a memoized version to prevent unnecessary re-renders
export default React.memo(ExpensiveTree)
