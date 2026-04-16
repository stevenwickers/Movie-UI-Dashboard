/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_TARGET: string
  readonly VITE_CSHARP_API_URL: string
  readonly VITE_NODE_API_URL: string
  readonly VITE_APP_PORT: string
  readonly VITE_APP_URL: string
  readonly VITE_API_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
