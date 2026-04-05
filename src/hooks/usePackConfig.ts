import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { PackConfig } from '../types'

const PACK_CONFIG_KEY = ['pack-config'] as const

export function usePackConfig() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: PACK_CONFIG_KEY,
    queryFn: api.getPacks,
    staleTime: 1000 * 60 * 5,
  })

  const mutation = useMutation({
    mutationFn: (config: PackConfig) => api.setPacks(config),
    onSuccess: (data) => {
      queryClient.setQueryData(PACK_CONFIG_KEY, data)
    },
  })

  return {
    packs: query.data?.packs ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    setPacks: mutation.mutate,
    isSettingPacks: mutation.isPending,
    setPacksError: mutation.error,
    isSetPacksSuccess: mutation.isSuccess,
  }
}
