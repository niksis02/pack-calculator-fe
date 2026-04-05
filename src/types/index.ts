export interface PackConfig {
  packs: number[]
}

export interface PackResult {
  size: number
  count: number
}

export interface CalculateRequest {
  items: number
}

export interface CalculateResponse {
  total_items: number
  packs: PackResult[]
}

export interface ApiError {
  error: string
}
