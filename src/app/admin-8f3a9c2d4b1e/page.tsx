'use client'

import { useState, useEffect, useRef } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css'
import type { EditorState, Selection } from 'prosemirror-state'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import type { Notice } from '@/types/cloudflare'
import { sanitizeNoticeHtml } from '@/lib/sanitize'

type ToastEditorInstance = import('@toast-ui/editor').default

type NoticeImageSize = 'sm' | 'md' | 'lg' | 'full'

const parseNoticeImageSizePayload = (payload: unknown): NoticeImageSize | null => {
  if (!payload || typeof payload !== 'object') return null
  if (!('size' in payload)) return null
  const size = (payload as { size?: unknown }).size
  if (size === 'sm' || size === 'md' || size === 'lg' || size === 'full') return size
  return null
}

const selectionToImageNode = (selection: Selection): ProseMirrorNode | null => {
  const maybe = selection as unknown as { node?: ProseMirrorNode }
  if (maybe.node?.type?.name === 'image') return maybe.node
  return null
}

const findSelectedImage = (state: EditorState): { pos: number, node: ProseMirrorNode } | null => {
  const directNode = selectionToImageNode(state.selection)
  if (directNode) return { pos: state.selection.from, node: directNode }

  const { doc, selection } = state
  const candidates = [selection.from, selection.from - 1, selection.to, selection.to - 1]
    .filter((pos) => Number.isFinite(pos) && pos >= 0)

  for (const pos of candidates) {
    const nodeAt = doc.nodeAt(pos)
    if (nodeAt?.type?.name === 'image') return { pos, node: nodeAt }
  }

  let found: { pos: number, node: ProseMirrorNode } | null = null
  const scanFrom = Math.max(0, Math.min(selection.from, selection.to) - 2)
  const scanTo = Math.max(selection.from, selection.to) + 2

  doc.nodesBetween(scanFrom, scanTo, (node, pos) => {
    if (found) return false
    if (node.type.name === 'image') {
      found = { pos, node }
      return false
    }
    return undefined
  })

  return found
}

const createNoticeImageSizePopupBody = (editor: ToastEditorInstance): HTMLElement => {
  const root = document.createElement('div')
  root.className = 'tui-notice-image-size-popup'
  root.style.padding = '10px'

  const label = document.createElement('div')
  label.textContent = 'Image Size'
  label.style.fontSize = '12px'
  label.style.marginBottom = '8px'
  label.style.opacity = '0.8'
  root.appendChild(label)

  const row = document.createElement('div')
  row.style.display = 'flex'
  row.style.gap = '6px'
  root.appendChild(row)

  const presets: Array<{ text: string, size: NoticeImageSize }> = [
    { text: 'S', size: 'sm' },
    { text: 'M', size: 'md' },
    { text: 'L', size: 'lg' },
    { text: 'Full', size: 'full' },
  ]

  for (const preset of presets) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = preset.text
    button.setAttribute('aria-label', `Image Size ${preset.text}`)
    button.style.padding = '6px 10px'
    button.style.border = '1px solid var(--line)'
    button.style.borderRadius = '10px'
    button.style.background = 'var(--paper)'
    button.style.color = 'var(--ink)'
    button.style.cursor = 'pointer'
    button.addEventListener('click', () => {
      editor.exec('setNoticeImageSize', { size: preset.size })
    })
    row.appendChild(button)
  }

  return root
}

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
          height: '300px',
          initialEditType: 'wysiwyg',
          previewStyle: 'vertical',
          usageStatistics: false,
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

        instance.addCommand('wysiwyg', 'setNoticeImageSize', (payload, state, dispatch) => {
          const size = parseNoticeImageSizePayload(payload)
          if (!size) return false

          const found = findSelectedImage(state)
          if (!found) {
            alert('이미지를 선택해 주세요.')
            return false
          }

          const nextAttrs: Record<string, unknown> = {
            ...found.node.attrs,
            'data-notice-size': size,
          }

          dispatch(state.tr.setNodeMarkup(found.pos, null, nextAttrs))
          return true
        })

        instance.insertToolbarItem(
          { groupIndex: 0, itemIndex: 999 },
          {
            name: 'noticeImageSize',
            tooltip: 'Image Size',
            text: 'Size',
            className: 'tui-notice-image-size',
            popup: {
              body: createNoticeImageSizePopupBody(instance),
            },
          },
        )

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

    const html = editorInstance.getHTML()
    const hasText = editorInstance.getMarkdown().trim().length > 0
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
        editorInstance.setHTML('')
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
    editorRef.current?.setHTML(notice.content)
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
          <div className="rounded-lg border border-[color:var(--line)] bg-white">
            <div ref={editorRootRef} />
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
                  editorRef.current?.setHTML('')
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
