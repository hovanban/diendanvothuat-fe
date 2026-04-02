import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://diendanvothuat.vn'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/clb',
          '/clb/*',
          '/question/*',
          '/tags/*',
          '/profile/*',
          '/community',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/ask-question',
          '/edit-answer/*',
          '/question/edit/*',
          '/profile/edit',
          '/sign-in',
          '/sign-up',
          '/onboarding',
          '/collection',
          '/_next/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/clb',
          '/clb/*',
          '/question/*',
          '/tags/*',
          '/profile/*',
          '/community',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/ask-question',
          '/edit-answer/*',
          '/question/edit/*',
          '/profile/edit',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-clubs.xml`,
      `${baseUrl}/sitemap-tags.xml`,
      `${baseUrl}/sitemap-questions.xml`,
    ],
  }
}
