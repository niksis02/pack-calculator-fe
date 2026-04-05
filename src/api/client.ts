import axios from 'axios'
import type { PackConfig, CalculateRequest, CalculateResponse } from '../types'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api/v1'

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

export const api = {
  getPacks: (): Promise<PackConfig> => http.get<PackConfig>('/config/packs').then((r) => r.data),

  setPacks: (config: PackConfig): Promise<PackConfig> =>
    http.post<PackConfig>('/config/packs', config).then((r) => r.data),

  calculate: (req: CalculateRequest): Promise<CalculateResponse> =>
    http.post<CalculateResponse>('/calculate', req).then((r) => r.data),
}
