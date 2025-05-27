/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: boolean;
}

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_URL: string;
  readonly VITE_AUTHOR_WEBSITE: string;
  readonly VITE_APP_KEY: string;
  readonly VITE_PWA_NAME: string;
  readonly VITE_PWA_SHORT_NAME: string;
  readonly VITE_PWA_DESCRIPTION: string;
  readonly VITE_PWA_THEME_COLOR: string;
  readonly VITE_PWA_BACKGROUND_COLOR: string;
  readonly VITE_CLOUDFLARE_ACCOUNT_ID: string;
  readonly VITE_CLOUDFLARE_API_TOKEN: string;
  readonly VITE_CLOUDFLARE_D1_DATABASE_ID: string;
  readonly VITE_CLOUDFLARE_D1_DATABASE_NAME: string;
  readonly VITE_CLOUDFLARE_ACCESS_KEY_ID: string;
  readonly VITE_CLOUDFLARE_SECRET_ACCESS_KEY: string;
  readonly VITE_CLOUDFLARE_BUCKET_NAME: string;
  readonly VITE_CLOUDFLARE_PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
