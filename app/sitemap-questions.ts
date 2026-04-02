import { MetadataRoute } from 'next'

export const revalidate = 1800 // 30 phút

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://diendanvothuat.vn'
  const apiUrl = process.env.API_URL || 'http://localhost:4000/api'

  try {
    const res = await fetch(`${apiUrl}/questions?pageSize=5000&filter=&page=1`, {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const questions: any[] = data?.questions || []

    return questions.map((q) => ({
      url: `${baseUrl}/question/${q.slug}`,
      lastModified: q.updatedAt ? new Date(q.updatedAt) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))
  } catch {
    return []
  }
}
