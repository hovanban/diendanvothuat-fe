import { MetadataRoute } from 'next'

export const revalidate = 3600 // 1 giờ

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://diendanvothuat.vn'
  const apiUrl = process.env.API_URL || 'http://localhost:4000/api'

  try {
    const res = await fetch(`${apiUrl}/tags?pageSize=1000&page=1`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const tags: any[] = data?.tags || data || []

    return tags.map((t) => ({
      url: `${baseUrl}/tags/${t.slug}`,
      lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    return []
  }
}
