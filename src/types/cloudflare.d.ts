declare global {
  interface CloudflareEnv {
    DB: D1Database
  }
}

export type Notice = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export {}
