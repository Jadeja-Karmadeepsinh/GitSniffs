"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    // this will create a instance of QueryClient class so that we can use queryclient in queryclientprovider
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

/*

React Query (TanStack Query) needs client-side React functionality to manage:
- Server-state caching.
- Loading and error states.
- Background refetching.
- Query subscriptions.
- Cache invalidation.
It uses React Context internally to make the QueryClient available to components.

That's why QueryClientProvider needs to run as a Client Component.

*/
