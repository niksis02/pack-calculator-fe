import type { CalculateResponse } from '../types'

interface ResultTableProps {
  result: CalculateResponse | undefined
  isLoading: boolean
  error: Error | null
}

export default function ResultTable({ result, isLoading, error }: ResultTableProps) {
  if (!result && !isLoading && !error) return null

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-gray-700 mb-3">Result</h3>

      {isLoading && (
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-100 rounded" />
          <div className="h-8 bg-gray-100 rounded" />
        </div>
      )}

      {error && !isLoading && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm"
          role="alert"
        >
          {error.message ?? 'Calculation failed. Please try again.'}
        </div>
      )}

      {result && !isLoading && (
        <>
          <div className="mb-3 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
            Total items shipped:&nbsp;
            <span className="text-lg font-bold">{result.total_items.toLocaleString()}</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    Pack Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {[...result.packs]
                  .sort((a, b) => b.size - a.size)
                  .map((pack) => (
                    <tr key={pack.size} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {pack.size.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-gray-600">{pack.count}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 font-semibold text-gray-700">Total packs</td>
                  <td className="px-6 py-3 font-semibold text-gray-700">
                    {result.packs.reduce((sum, p) => sum + p.count, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
