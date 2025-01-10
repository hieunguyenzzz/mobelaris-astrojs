/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_MEDUSA_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 