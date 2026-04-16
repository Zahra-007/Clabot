'use client'

import * as React from 'react'

// App is always light-mode (forcedTheme="light") so next-themes is not needed.
// Using a plain passthrough avoids the React script-tag injection warning.
export function ThemeProvider({ children }: { children: React.ReactNode; [key: string]: unknown }) {
  return <>{children}</>
}
