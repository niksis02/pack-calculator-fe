import { useState } from 'react'
import { usePackConfig } from '../hooks/usePackConfig'

function PackSizesForm({
  initialPacks,
  setPacks,
  isSettingPacks,
  setPacksError,
  isSetPacksSuccess,
}: {
  initialPacks: number[]
  setPacks: ReturnType<typeof usePackConfig>['setPacks']
  isSettingPacks: boolean
  setPacksError: ReturnType<typeof usePackConfig>['setPacksError']
  isSetPacksSuccess: boolean
}) {
  const [inputs, setInputs] = useState<string[]>(() => initialPacks.map(String))
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleChange = (index: number, value: string) => {
    setInputs((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
    setValidationError(null)
  }

  const handleAdd = () => {
    setInputs((prev) => [...prev, ''])
    setValidationError(null)
  }

  const handleRemove = (index: number) => {
    if (inputs.length <= 1) return
    setInputs((prev) => prev.filter((_, i) => i !== index))
    setValidationError(null)
  }

  const handleSave = () => {
    // Parse and validate
    const parsed = inputs.map((v) => parseInt(v, 10))
    if (parsed.some((n) => isNaN(n) || n <= 0)) {
      setValidationError('All pack sizes must be positive integers.')
      return
    }
    const unique = new Set(parsed)
    if (unique.size !== parsed.length) {
      setValidationError('Pack sizes must be unique.')
      return
    }
    setValidationError(null)
    setPacks({ packs: parsed })
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Pack Sizes</h2>
      <div className="space-y-2">
        {inputs.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 250"
              aria-label={`Pack size ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              disabled={inputs.length <= 1}
              className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Remove pack size"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        + Add pack size
      </button>

      {validationError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {validationError}
        </p>
      )}

      {setPacksError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {setPacksError instanceof Error ? setPacksError.message : 'Failed to save configuration.'}
        </p>
      )}

      {isSetPacksSuccess && !setPacksError && (
        <p className="mt-2 text-sm text-green-600">Configuration saved.</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSettingPacks}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isSettingPacks ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Saving…
          </>
        ) : (
          'Save Configuration'
        )}
      </button>
    </section>
  )
}

export default function PackSizesConfig() {
  const { packs, isLoading, isError, setPacks, isSettingPacks, setPacksError, isSetPacksSuccess } =
    usePackConfig()

  if (isLoading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
        <p className="text-red-600 text-sm">Failed to load pack configuration. Please refresh.</p>
      </section>
    )
  }

  return (
    <PackSizesForm
      key={packs.join(',')}
      initialPacks={packs}
      setPacks={setPacks}
      isSettingPacks={isSettingPacks}
      setPacksError={setPacksError}
      isSetPacksSuccess={isSetPacksSuccess}
    />
  )
}
