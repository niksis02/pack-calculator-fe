import { render, screen } from '@testing-library/react'
import ResultTable from './ResultTable'
import type { CalculateResponse } from '../types'

const mockResult: CalculateResponse = {
  total_items: 750,
  packs: [
    { size: 500, count: 1 },
    { size: 250, count: 1 },
  ],
}

test('renders nothing when no result, not loading, no error', () => {
  const { container } = render(<ResultTable result={undefined} isLoading={false} error={null} />)
  expect(container.firstChild).toBeNull()
})

test('renders loading skeleton', () => {
  render(<ResultTable result={undefined} isLoading={true} error={null} />)
  expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
})

test('renders error message', () => {
  render(<ResultTable result={undefined} isLoading={false} error={new Error('Network error')} />)
  expect(screen.getByRole('alert')).toHaveTextContent('Network error')
})

test('renders result table with packs sorted by size descending', () => {
  render(<ResultTable result={mockResult} isLoading={false} error={null} />)

  expect(screen.getByText(/total items shipped/i)).toBeInTheDocument()
  expect(screen.getByText('750')).toBeInTheDocument()

  const rows = screen.getAllByRole('row')
  // header + 2 data + footer = 4 rows
  expect(rows).toHaveLength(4)
  // First data row should be size 500 (largest first)
  expect(rows[1]).toHaveTextContent('500')
  expect(rows[2]).toHaveTextContent('250')
})

test('renders total pack count in footer', () => {
  render(<ResultTable result={mockResult} isLoading={false} error={null} />)
  expect(screen.getByText('Total packs')).toBeInTheDocument()
  // 1 pack of 500 + 1 pack of 250 = 2 total packs
  const footer = screen.getByText('Total packs').closest('tr')
  expect(footer).toHaveTextContent('2')
})
