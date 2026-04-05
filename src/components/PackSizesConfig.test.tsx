import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PackSizesConfig from './PackSizesConfig'

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: 0 } } })}>
      {children}
    </QueryClientProvider>
  )
}

test('loads and displays current pack sizes', async () => {
  render(<PackSizesConfig />, { wrapper })

  await waitFor(() => {
    expect(screen.getByDisplayValue('250')).toBeInTheDocument()
  })
  expect(screen.getByDisplayValue('500')).toBeInTheDocument()
  expect(screen.getByDisplayValue('5000')).toBeInTheDocument()
})

test('allows adding a new pack size input', async () => {
  const user = userEvent.setup()
  render(<PackSizesConfig />, { wrapper })

  await waitFor(() => screen.getByDisplayValue('250'))

  const addButton = screen.getByRole('button', { name: /add pack size/i })
  await user.click(addButton)

  const inputs = screen.getAllByRole('spinbutton')
  expect(inputs).toHaveLength(6) // 5 defaults + 1 new empty
})

test('allows removing a pack size', async () => {
  const user = userEvent.setup()
  render(<PackSizesConfig />, { wrapper })

  await waitFor(() => screen.getByDisplayValue('250'))

  const removeButtons = screen.getAllByRole('button', { name: /remove pack size/i })
  expect(removeButtons).toHaveLength(5)
  await user.click(removeButtons[0])

  const inputs = screen.getAllByRole('spinbutton')
  expect(inputs).toHaveLength(4)
})

test('shows validation error for non-positive value', async () => {
  const user = userEvent.setup()
  render(<PackSizesConfig />, { wrapper })

  await waitFor(() => screen.getByDisplayValue('250'))

  const firstInput = screen.getByDisplayValue('250')
  await user.clear(firstInput)
  await user.type(firstInput, '-5')

  await user.click(screen.getByRole('button', { name: /save configuration/i }))

  expect(await screen.findByRole('alert')).toHaveTextContent(/positive integers/i)
})

test('shows validation error for duplicate values', async () => {
  const user = userEvent.setup()
  render(<PackSizesConfig />, { wrapper })

  await waitFor(() => screen.getByDisplayValue('250'))

  const firstInput = screen.getByDisplayValue('250')
  await user.clear(firstInput)
  await user.type(firstInput, '500')

  await user.click(screen.getByRole('button', { name: /save configuration/i }))

  expect(await screen.findByRole('alert')).toHaveTextContent(/unique/i)
})
