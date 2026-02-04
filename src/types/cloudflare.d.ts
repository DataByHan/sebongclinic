declare global {
  interface CloudflareEnv {
    DB: D1Database
    IMAGES: R2Bucket
    ADMIN_PASSWORD: string
  }
}

export type Notice = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  format: 'html' | 'markdown'
  content_md?: string | null
}

export {}
