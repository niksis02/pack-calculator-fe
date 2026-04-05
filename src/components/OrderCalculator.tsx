import { useState } from 'react'
import { useCalculate } from '../hooks/useCalculate'
import ResultTable from './ResultTable'

export default function OrderCalculator() {
  const [order, setOrder] = useState<string>('')
  const { calculate, result, isCalculating, error } = useCalculate()

  const handleCalculate = () => {
    const qty = parseInt(order, 10)
    if (!qty || qty < 1) return
    calculate({ items: qty })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate()
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Calculator</h2>

      <div className="flex gap-3">
        <input
          type="number"
          min={1}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter order quantity"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Order quantity"
        />
        <button
          type="button"
          onClick={handleCalculate}
          disabled={isCalculating || !order || parseInt(order, 10) < 1}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          {isCalculating ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Calculating…
            </>
          ) : (
            'Calculate'
          )}
        </button>
      </div>

      <ResultTable
        result={result}
        isLoading={isCalculating}
        error={error instanceof Error ? error : null}
      />
    </section>
  )
}
