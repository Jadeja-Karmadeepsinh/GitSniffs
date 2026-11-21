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