'use client'

import React from 'react'

interface ClaIconProps {
  size?: number
  className?: string
}

export function ClaIcon({ size = 24, className = '' }: ClaIconProps) {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Clabot logo"
    >
      <defs>
        <linearGradient id={`cg1-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id={`cg2-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect x="2" y="2" width="36" height="36" rx="10" fill={`url(#cg1-${id})`} />

      {/* Abstract spark / neural paths — premium AI mark */}
      {/* Central vertical stroke */}
      <path
        d="M20 10 L20 30"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.95"
      />
      {/* Left branch */}
      <path
        d="M20 16 L12 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* Right branch */}
      <path
        d="M20 16 L28 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* Left lower branch */}
      <path
        d="M20 24 L12 28"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* Right lower branch */}
      <path
        d="M20 24 L28 28"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Node dots */}
      <circle cx="20" cy="10" r="2.4" fill="white" />
      <circle cx="20" cy="20" r="2.8" fill="white" />
      <circle cx="20" cy="30" r="2.4" fill="white" />
      <circle cx="12" cy="12" r="1.8" fill="white" opacity="0.85" />
      <circle cx="28" cy="12" r="1.8" fill="white" opacity="0.85" />
      <circle cx="12" cy="28" r="1.8" fill="white" opacity="0.85" />
      <circle cx="28" cy="28" r="1.8" fill="white" opacity="0.85" />
    </svg>
  )
}
