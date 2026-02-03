'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { Notice } from '@/types/cloudflare'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [notices, setNotices] = useState<Notice[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[200px] focus:outline-none border border-[color:var(--line)] rounded-lg',
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
    if (password === 'sebong2025') {
      setIsAuthenticated(true)
    } else {
      alert('잘못된 비밀번호입니다.')
    }
  }

  const handleSubmit = async () => {
    if (!title || !editor) return

    const content = editor.getHTML()
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
        alert('저장에 실패했습니다.')
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
        alert('삭제에 실패했습니다.')
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
          <EditorContent editor={editor} />
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
