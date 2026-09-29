// src/components/LoadingSpinner.jsx
import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="page-loader-container" role="status" aria-live="polite">
      <div className="spinner-ring" />
      <span className="sr-only">Loading content...</span>
    </div>
  )
}