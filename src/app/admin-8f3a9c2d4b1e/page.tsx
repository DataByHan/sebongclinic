'use client'

import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'
import '@toast-ui/editor/dist/toastui-editor.css'
import type { Notice } from '@/types/cloudflare'
import { sanitizeNoticeHtml } from '@/lib/sanitize'

type ToastEditorInstance = import('@toast-ui/editor').default

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [notices, setNotices] = useState<Notice[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')

  const editorRef = useRef<ToastEditorInstance | null>(null)
  const editorRootRef = useRef<HTMLDivElement>(null)

  const passwordRef = useRef(password)

  useEffect(() => {
    passwordRef.current = password
  }, [password])

  useEffect(() => {
      let cancelled = false
      let instance: ToastEditorInstance | null = null

      const initEditor = async () => {
        if (!isAuthenticated || !editorRootRef.current) return
        const { default: ToastEditor } = await import('@toast-ui/editor')
        if (cancelled || !editorRootRef.current) return

        instance = new ToastEditor({
          el: editorRootRef.current,
          height: '500px',
          initialEditType: 'markdown',
          previewStyle: 'vertical',
          usageStatistics: false,
          placeholder: '',
          toolbarItems: [['heading', 'bold', 'italic', 'ul', 'ol', 'link', 'image']],
          hooks: {
            addImageBlobHook: (blob: Blob | File, callback: (url: string, text?: string) => void) => {
             const formData = new FormData()
             formData.append('file', blob)
             formData.append('password', passwordRef.current)

             fetch('/api/upload', {
               method: 'POST',
               body: formData,
             })
               .then(res => {
                 if (res.status === 401) {
                   alert('비밀번호가 올바르지 않습니다')
                   return null
                 }
                 if (!res.ok) {
                   alert('이미지 업로드에 실패했습니다')
                   return null
                 }
                 return res.json() as Promise<{ url: string }>
               })
               .then((data) => {
                 if (data?.url) {
                   callback(data.url)
                 }
               })
               .catch(() => {
                 alert('이미지 업로드 중 오류가 발생했습니다')
               })
            },
          },
        })

        editorRef.current = instance
      }

      void initEditor()

      return () => {
        cancelled = true

        if (instance) {
          instance.destroy()
        }
        editorRef.current = null
      }
    }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotices()
    }
  }, [isAuthenticated])

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices')
      const data = await res.json() as { notices: Notice[] }
      setNotices(data.notices || [])
    } catch (error) {
      console.error('Failed to fetch notices:', error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      alert('비밀번호를 입력해 주세요.')
      return
    }
    setIsAuthenticated(true)
  }

  const handleUnauthorized = () => {
    alert('비밀번호가 올바르지 않습니다. 다시 로그인해 주세요.')
    setIsAuthenticated(false)
  }

   const handleSubmit = async () => {
     const editorInstance = editorRef.current
     if (!editorInstance) return
     if (!title.trim()) {
       alert('제목을 입력해 주세요.')
       return
     }
     if (!password.trim()) {
       handleUnauthorized()
       return
     }

     const markdown = editorInstance.getMarkdown()
     const hasText = markdown.trim().length > 0
     const hasImage = markdown.includes('![')
     if (!hasText && !hasImage) {
       alert('내용을 입력해 주세요.')
       return
     }

     const html = await marked(markdown)
     const content = sanitizeNoticeHtml(html)
     const url = editingId ? `/api/notices/${editingId}` : '/api/notices'
     const method = editingId ? 'PUT' : 'POST'

     const editingNotice = editingId ? notices.find(n => n.id === editingId) : null
     const isEditingLegacyHtml = editingNotice && !editingNotice.content_md

     const payload = isEditingLegacyHtml
       ? { title, content, format: 'html', password }
       : { title, content, content_md: markdown, format: 'markdown', password }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setTitle('')
        editorInstance.setMarkdown('')
        setEditingId(null)
        fetchNotices()
      } else {
        if (res.status === 401) {
          handleUnauthorized()
          return
        }

        const data = await res.json().catch(() => ({})) as { error?: string }
        alert(data.error || '저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to save notice:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const handleEdit = (notice: Notice) => {
    setEditingId(notice.id)
    setTitle(notice.title)
    
    const editor = editorRef.current
    if (!editor) return

    const isMarkdownNotice = !!notice.content_md
    if (isMarkdownNotice) {
      editor.setMarkdown(notice.content_md!)
    } else {
      editor.setHTML(notice.content)
      alert('이 공지는 HTML 형식입니다. 수정 시 HTML로 저장됩니다.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        fetchNotices()
      } else {
        if (res.status === 401) {
          handleUnauthorized()
          return
        }

        const data = await res.json().catch(() => ({})) as { error?: string }
        alert(data.error || '삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to delete notice:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--paper)]">
        <form onSubmit={handleLogin} className="flat-card p-8 w-full max-w-md">
          <h1 className="type-serif text-2xl mb-6">관리자 로그인</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 border border-[color:var(--line)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[color:var(--jade)]"
          />
          <button type="submit" className="cta w-full">
            로그인
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[color:var(--paper)] py-10">
      <div className="frame max-w-4xl">
        <h1 className="type-serif text-3xl mb-8">공지사항 관리</h1>

        <div className="flat-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? '공지 수정' : '새 공지 작성'}
          </h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full px-4 py-3 border border-[color:var(--line)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[color:var(--jade)]"
          />
           <div className="rounded-lg border border-[color:var(--line)] bg-white mb-4">
             <div ref={editorRootRef} />
           </div>

           <div className="flex gap-3">
             <button onClick={handleSubmit} className="cta">
               {editingId ? '수정 완료' : '작성 완료'}
             </button>
             {editingId && (
               <button
                 onClick={() => {
                   setEditingId(null)
                   setTitle('')
                   editorRef.current?.setMarkdown('')
                 }}
                 className="cta-ghost"
               >
                 취소
               </button>
             )}
           </div>
         </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">공지 목록</h2>
          {notices.map((notice) => (
            <div key={notice.id} className="flat-card p-6">
              <h3 className="text-lg font-semibold mb-2">{notice.title}</h3>
               <div
                 className="notice-content mt-4 text-sm leading-relaxed text-[color:var(--muted)] mb-4"
                 dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(notice.content) }}
               />
              <div className="text-sm text-[color:var(--muted)] mb-4">
                {new Date(notice.created_at).toLocaleDateString('ko-KR')}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(notice)} className="cta-ghost text-sm">
                  수정
                </button>
                <button onClick={() => handleDelete(notice.id)} className="cta-ghost text-sm">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
