import { SEOHandle } from '@nasa-gcn/remix-seo'

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
}
export function loader() {
  return new Response('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
