import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PackSizesConfig from './components/PackSizesConfig'
import OrderCalculator from './components/OrderCalculator'
import About from './components/About'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                  <PackSizesConfig />
                  <OrderCalculator />
                </main>
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
