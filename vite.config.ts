import { vitePlugin as remix } from '@remix-run/dev'
import { vercelPreset } from '@vercel/remix/vite'
import path from 'path'
import { defineConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    envOnlyMacros(),
    tsconfigPaths(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      presets: [vercelPreset()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@tweet': path.resolve(__dirname, 'node_modules/react-tweet/dist'),
    },
  },
  // https://github.com/vitejs/vite/issues/15012#issuecomment-1948550039
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return
        }

        defaultHandler(warning)
      },
    },
    ssr: true,
  },
  ssr: {
    noExternal: ['react-tweet'],
  },
})
