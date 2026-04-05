import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/v1/config/packs', () =>
    HttpResponse.json({ packs: [250, 500, 1000, 2000, 5000] }),
  ),

  http.post('/api/v1/config/packs', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(body)
  }),

  http.post('/api/v1/calculate', async ({ request }) => {
    const { items } = (await request.json()) as { items: number }
    if (items <= 250) {
      return HttpResponse.json({ total_items: 250, packs: [{ size: 250, count: 1 }] })
    }
    if (items <= 500) {
      return HttpResponse.json({ total_items: 500, packs: [{ size: 500, count: 1 }] })
    }
    return HttpResponse.json({
      total_items: 750,
      packs: [
        { size: 500, count: 1 },
        { size: 250, count: 1 },
      ],
    })
  }),
]
