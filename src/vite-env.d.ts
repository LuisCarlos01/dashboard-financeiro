/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_EMAIL: string;
  readonly VITE_AUTH_PASSWORD_HASH: string;
  readonly VITE_AUTH_USER_NAME: string;
  // Adicione outras variáveis de ambiente aqui conforme necessário
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

