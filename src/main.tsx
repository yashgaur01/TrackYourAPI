import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/error/boundary';
import { RouteErrorBoundary } from '@/components/error/route-error-boundary';
import { HomePage } from '@/pages/home'
import DashboardPage from '@/pages/dashboard'
import UsageLogsPage from '@/pages/usage-logs'
import AlertsPage from '@/pages/alerts'
import ApiKeysPage from '@/pages/api-keys'
import LoginPage from '@/pages/login'
import DocsPage from '@/pages/docs'
import SettingsPage from '@/pages/settings'
import ProfilePage from '@/pages/profile'
import PricingPage from '@/pages/pricing'
import ApiReferencePage from '@/pages/api-reference'
import BlogPage from '@/pages/blog'
import PrivacyPage from '@/pages/privacy'
import TermsPage from '@/pages/terms'
import FeaturesPage from '@/pages/features'
import IntegrationsPage from '@/pages/integrations'
import { ProtectedRoute } from '@/components/auth/protected-route'
import '@/index.css'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

// Handle module load failures (e.g., after deployment with stale chunks)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/api-reference",
    element: <ApiReferencePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/features",
    element: <FeaturesPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/integrations",
    element: <IntegrationsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/usage-logs",
    element: (
      <ProtectedRoute>
        <UsageLogsPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/alerts",
    element: (
      <ProtectedRoute>
        <AlertsPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/api-keys",
    element: (
      <ProtectedRoute>
        <ApiKeysPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs",
    element: (
      <ProtectedRoute>
        <DocsPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  }
]);

// Signal to parent frame that app is ready
const notifyParentReady = () => {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'preview-ready', url: location.href }, '*')
  }
}

// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
)

// Notify after initial render completes (with fallbacks)
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(notifyParentReady)
} else {
  setTimeout(notifyParentReady, 0)
}
// Also notify on load as backup in case idle callback is delayed
window.addEventListener('load', notifyParentReady, { once: true })
