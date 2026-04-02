import { MetadataRoute } from 'next'

export const revalidate = 3600 // 1 giờ

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://diendanvothuat.vn'
  const apiUrl = process.env.API_URL || 'http://localhost:4000/api'

  try {
    const res = await fetch(`${apiUrl}/clubs?pageSize=2000&page=1`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const clubs: any[] = data?.clubs || []

    return clubs.map((c) => ({
      url: `${baseUrl}/clb/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    return []
  }
}
