'use client'

import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import type { Notice } from '@/types/cloudflare'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [notices, setNotices] = useState<Notice[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[240px] focus:outline-none border border-[color:var(--line)] rounded-lg prose-img:my-4 prose-img:rounded-xl prose-img:max-w-full',
      },
    },
  })

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
    if (!editor) return
    if (!title.trim()) {
      alert('제목을 입력해 주세요.')
      return
    }
    if (!password.trim()) {
      handleUnauthorized()
      return
    }

    const html = editor.getHTML()
    const hasText = editor.getText().trim().length > 0
    const hasImage = html.includes('<img')
    if (!hasText && !hasImage) {
      alert('내용을 입력해 주세요.')
      return
    }

    const content = html
    const url = editingId ? `/api/notices/${editingId}` : '/api/notices'
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, password }),
      })

      if (res.ok) {
        setTitle('')
        editor.commands.setContent('')
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
    editor?.commands.setContent(notice.content)
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

  const handleImageUpload = async (file: File) => {
    if (!editor) return
    if (!password.trim()) {
      handleUnauthorized()
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 가능)')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json() as { error?: string }
        if (res.status === 401) {
          handleUnauthorized()
          return
        }
        alert(error.error || '업로드 실패')
        return
      }

      const data = await res.json() as { url: string }
      editor.chain().focus().setImage({ src: data.url, alt: '' }).run()
    } catch (error) {
      console.error('Upload error:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (uploading) return
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      return
    }
    handleImageUpload(file)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleFileSelect}
              disabled={uploading}
              className="cta-ghost text-sm"
            >
              {uploading ? '업로드 중...' : '이미지 추가'}
            </button>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={[
                'rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]',
                editor?.isActive('bold') ? 'bg-[color:var(--paper-2)]' : '',
              ].join(' ')}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor?.can().chain().focus().toggleBold().run()}
            >
              굵게
            </button>
            <button
              type="button"
              className={[
                'rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]',
                editor?.isActive('italic') ? 'bg-[color:var(--paper-2)]' : '',
              ].join(' ')}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
            >
              기울임
            </button>
            <button
              type="button"
              className={[
                'rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]',
                editor?.isActive('strike') ? 'bg-[color:var(--paper-2)]' : '',
              ].join(' ')}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              disabled={!editor?.can().chain().focus().toggleStrike().run()}
            >
              취소선
            </button>
            <button
              type="button"
              className={[
                'rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]',
                editor?.isActive('heading', { level: 2 }) ? 'bg-[color:var(--paper-2)]' : '',
              ].join(' ')}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              제목
            </button>
            <button
              type="button"
              className={[
                'rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]',
                editor?.isActive('bulletList') ? 'bg-[color:var(--paper-2)]' : '',
              ].join(' ')}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              글머리
            </button>
            <button
              type="button"
              className={[
                'rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]',
                editor?.isActive('orderedList') ? 'bg-[color:var(--paper-2)]' : '',
              ].join(' ')}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              번호
            </button>
            <button
              type="button"
              className={[
                'rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]',
                editor?.isActive('blockquote') ? 'bg-[color:var(--paper-2)]' : '',
              ].join(' ')}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              인용
            </button>
            <button
              type="button"
              className="rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().chain().focus().undo().run()}
            >
              되돌리기
            </button>
            <button
              type="button"
              className="rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm transition-colors hover:bg-[color:var(--paper-2)]"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().chain().focus().redo().run()}
            >
              다시하기
            </button>
          </div>

          <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <EditorContent editor={editor} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="cta">
              {editingId ? '수정 완료' : '작성 완료'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null)
                  setTitle('')
                  editor?.commands.setContent('')
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
                className="prose max-w-none mb-4"
                dangerouslySetInnerHTML={{ __html: notice.content }}
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
