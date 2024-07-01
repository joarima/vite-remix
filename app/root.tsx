import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'

import { GlobalPendingIndicator } from '@/components/global-pending-indicator'

import { LoaderFunctionArgs } from '@remix-run/node'
import React from 'react'
import Footer from './components/Layout/Footer'
import Header from './components/Layout/Header'
import {
  ThemeSwitcherSafeHTML,
  ThemeSwitcherScript,
} from './components/theme-switcher'
import { Toaster } from './components/ui/toaster'
import './globals.css'
import {
  getSupabaseEnv,
  getSupabaseWithSessionHeaders,
} from './lib/auth.supabase.server'
import { useSupabase } from './lib/auth.supabaseClient'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, headers } = await getSupabaseWithSessionHeaders({
    request,
  })

  return json(
    {
      env: getSupabaseEnv(),
      session,
    },
    { headers }
  )
}

function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeSwitcherSafeHTML lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href="./site.webmanifest"
          crossOrigin="use-credentials"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="content-language" content="ja" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="description" content="Owlstilttheirheads." />
        <meta property="og:title" content="Owlstilttheirheads." />
        <meta property="og:image" content="/images/owl.png" />
        <meta property="og:description" content="Owlstilttheirheads." />
        <title>Owlstilttheirheads.</title>
        <Meta />
        <Links />
        <ThemeSwitcherScript />
      </head>

      <body>
        <GlobalPendingIndicator />
        <div id="root">
          <React.StrictMode>
            <div className="my-14 hidden-scrollbar !font-sans !font-thin">
              <Header />
              {children}
              <Toaster />
              <Footer />
            </div>
          </React.StrictMode>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </ThemeSwitcherSafeHTML>
  )
}

export default function Root() {
  const { env, session } = useLoaderData<typeof loader>()

  const { supabase } = useSupabase({ env, session })
  return (
    <App>
      <Outlet context={{ supabase }} />
    </App>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  let status = 500
  let message = 'An unexpected error occurred.'
  if (isRouteErrorResponse(error)) {
    status = error.status
    switch (error.status) {
      case 404:
        message = 'Page Not Found'
        break
    }
  } else {
    console.error(error)
  }

  return (
    <App>
      <div className="container prose py-8">
        <h1>{status}</h1>
        <p>{message}</p>
      </div>
    </App>
  )
}
