'use client'

import React from 'react'

interface ClaIconProps {
  size?: number
  className?: string
}

export function ClaIcon({ size = 24, className = '' }: ClaIconProps) {
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
      <rect width="40" height="40" rx="11" fill="#6A6EF3" />
      <path
        d="M9 20 C9 15 14 12 18 15 C21 17 19 23 22 23 C26 23 31 20 31 20 C31 25 26 28 22 25 C19 23 21 17 18 17 C14 17 9 25 9 20Z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}