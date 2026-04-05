import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OrderCalculator from './OrderCalculator'

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: 0 } } })}>
      {children}
    </QueryClientProvider>
  )
}

test('renders input and calculate button', () => {
  render(<OrderCalculator />, { wrapper })
  expect(screen.getByRole('spinbutton', { name: /order quantity/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument()
})

test('calculate button is disabled when input is empty', () => {
  render(<OrderCalculator />, { wrapper })
  expect(screen.getByRole('button', { name: /calculate/i })).toBeDisabled()
})

test('shows result table after calculation', async () => {
  const user = userEvent.setup()
  render(<OrderCalculator />, { wrapper })

  const input = screen.getByRole('spinbutton', { name: /order quantity/i })
  await user.type(input, '251')
  await user.click(screen.getByRole('button', { name: /calculate/i }))

  await waitFor(() => {
    expect(screen.getByText(/total items shipped/i)).toBeInTheDocument()
  })
  expect(screen.getAllByText('500').length).toBeGreaterThan(0)
})

test('supports Enter key to trigger calculation', async () => {
  const user = userEvent.setup()
  render(<OrderCalculator />, { wrapper })

  const input = screen.getByRole('spinbutton', { name: /order quantity/i })
  await user.type(input, '100{Enter}')

  await waitFor(() => {
    expect(screen.getByText(/total items shipped/i)).toBeInTheDocument()
  })
})
