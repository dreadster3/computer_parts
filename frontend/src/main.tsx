import React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import Home from "@/views/home";
import { ThemeProvider } from "@/providers/theme";
import Layout from "@/layouts/default";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback={<p>Loading...</p>}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Layout>
            <Home />
          </Layout>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Suspense>
  </React.StrictMode>,
);
