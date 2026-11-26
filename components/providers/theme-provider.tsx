"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// by default the layout is a server component so we wrap themeprovider in a client component then use it
// the reason is that next-themes needs access to browser-side features, which are not available inside React Server Components.
// Server Components execute on the server and cannot directly use browser-only APIs or client-side React hooks
