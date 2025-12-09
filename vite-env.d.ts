/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_PASSWORD_HASH: string;
  readonly VITE_AUTH_PASSWORD_SIMPLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
