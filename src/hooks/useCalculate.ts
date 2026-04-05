import { useMutation } from '@tanstack/react-query'
import { api } from '../api/client'
import type { CalculateResponse } from '../types'

export function useCalculate() {
  const mutation = useMutation({
    mutationFn: api.calculate,
  })

  return {
    calculate: mutation.mutate,
    result: mutation.data as CalculateResponse | undefined,
    isCalculating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}
