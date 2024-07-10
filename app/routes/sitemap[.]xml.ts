import { generateSitemap } from '@nasa-gcn/remix-seo'
import type { LoaderFunctionArgs } from '@remix-run/node'
// @ts-expect-error Virtual modules are not recognized by TypeScript
// eslint-disable-next-line import/no-unresolved
import { routes } from 'virtual:remix/server-build'

export function loader({ request }: LoaderFunctionArgs) {
  return generateSitemap(request, routes, {
    siteUrl: 'https://owlstilttheirheads.com',
    headers: {
      'Cache-Control': `public, max-age=${60 * 5}`,
    },
  })
}
