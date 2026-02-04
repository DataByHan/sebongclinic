'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css'
import { NodeSelection } from 'prosemirror-state'
import type { EditorState, Selection } from 'prosemirror-state'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'
import type { Notice } from '@/types/cloudflare'
import { sanitizeNoticeHtml } from '@/lib/sanitize'
import { applyNoticeImageWidths } from '@/lib/apply-notice-image-width'

type ToastEditorInstance = import('@toast-ui/editor').default

type NoticeImageSize = 'sm' | 'md' | 'lg' | 'full'

type NoticeImageWidthUnit = 'px' | '%'

type NoticeImageWidthPayloadParsed =
  | { kind: 'set', width: string, unit: NoticeImageWidthUnit, pos?: number }
  | { kind: 'clear', pos?: number }

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

const parseNoticeImageWidthPayload = (payload: unknown): NoticeImageWidthPayloadParsed | null => {
  if (!payload || typeof payload !== 'object') return null

  const { width, unit, action, pos } = payload as { width?: unknown, unit?: unknown, action?: unknown, pos?: unknown }
  const posNum = typeof pos === 'number' ? pos : undefined

  if (action === 'clear') return { kind: 'clear', pos: posNum }

  const widthText = typeof width === 'number'
    ? String(width)
    : (typeof width === 'string' ? width.trim() : null)
  if (!widthText) return null
  if (!/^\d+(\.\d+)?$/.test(widthText)) return null

  const unitText = unit === 'px' || unit === '%'
    ? unit
    : null
  if (!unitText) return null

  return { kind: 'set', width: widthText, unit: unitText, pos: posNum }
}

const getWysiwygEditorState = (editor: ToastEditorInstance): EditorState | null => {
  const maybe = editor as unknown as { getCurrentModeEditor?: () => unknown }
  const mode = maybe.getCurrentModeEditor?.() as { view?: { state?: EditorState } } | undefined
  return mode?.view?.state ?? null
}

const getWysiwygEditorView = (editor: ToastEditorInstance): EditorView | null => {
  const maybe = editor as unknown as { getCurrentModeEditor?: () => unknown }
  const mode = maybe.getCurrentModeEditor?.() as { view?: EditorView } | undefined
  return mode?.view ?? null
}

const ensureWysiwygImageNodeSelectionFromClick = (
  editor: ToastEditorInstance,
  e: MouseEvent,
): boolean => {
  const view = getWysiwygEditorView(editor)
  if (!view) return false

  const posInfo = view.posAtCoords({ left: e.clientX, top: e.clientY })
  if (!posInfo) return false

  const { state } = view
  const candidates = [posInfo.pos, posInfo.pos - 1, posInfo.pos + 1]
    .filter((pos) => pos >= 0)

  const imagePos = candidates.find((pos) => state.doc.nodeAt(pos)?.type?.name === 'image')
  if (imagePos === undefined) return false

  view.focus()
  view.dispatch(state.tr.setSelection(NodeSelection.create(state.doc, imagePos)).scrollIntoView())
  return true
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [notices, setNotices] = useState<Notice[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number, y: number, width: number, aspectRatio: number } | null>(null)
  const [dragCurrentWidth, setDragCurrentWidth] = useState<number | null>(null)
  const [resizeHandlePos, setResizeHandlePos] = useState<{ top: number, left: number } | null>(null)

  const editorRef = useRef<ToastEditorInstance | null>(null)
  const editorRootRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  const passwordRef = useRef(password)

  useEffect(() => {
    passwordRef.current = password
  }, [password])

  const updateResizeHandlePosition = useCallback(() => {
    const editorEl = editorRootRef.current
    if (!editorEl) return

    const selectedEl = editorEl.querySelector('.ProseMirror-selectednode') as HTMLElement | null
    if (!selectedEl || selectedEl.tagName.toLowerCase() !== 'img') {
      setResizeHandlePos(null)
      return
    }

    const rect = selectedEl.getBoundingClientRect()
    setResizeHandlePos({
      top: rect.bottom - 8,
      left: rect.right - 8,
    })
  }, [])

  const updateSelectedImageHandle = useCallback(() => {
    const editorEl = editorRootRef.current
    if (!editorEl) return

    const selectedEl = editorEl.querySelector('.ProseMirror-selectednode') as HTMLElement | null
    const isImageNodeSelected = selectedEl?.tagName?.toLowerCase() === 'img'
    if (!isImageNodeSelected) {
      setResizeHandlePos(null)
      return
    }

    updateResizeHandlePosition()
  }, [updateResizeHandlePosition])

  useEffect(() => {
    if (!resizeHandlePos) return

    const handleReposition = () => {
      updateResizeHandlePosition()
    }

    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    return () => {
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [resizeHandlePos, updateResizeHandlePosition])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const editorEl = editorRootRef.current
    if (!editorEl) return

    const selectedEl = editorEl.querySelector('.ProseMirror-selectednode') as HTMLImageElement | null
    if (!selectedEl || selectedEl.tagName.toLowerCase() !== 'img') return

    const rect = selectedEl.getBoundingClientRect()
    const currentWidth = rect.width
    const aspectRatio = rect.width / rect.height

    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: currentWidth,
      aspectRatio,
    })
    setDragCurrentWidth(currentWidth)
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging || !dragStart) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x
      const newWidth = Math.max(120, Math.min(1200, dragStart.width + deltaX))
      setDragCurrentWidth(newWidth)
      updateResizeHandlePosition()
    }

    const handleMouseUp = () => {
      if (dragCurrentWidth !== null) {
        const roundedWidth = Math.round(dragCurrentWidth)
        setTimeout(() => {
          const editorInstance = editorRef.current
          if (!editorInstance) return

          const state = getWysiwygEditorState(editorInstance)
          if (!state) return

          const found = findSelectedImage(state)

          if (found) {
            editorInstance.exec('setNoticeImageWidth', {
              width: String(roundedWidth),
              unit: 'px',
            })

            requestAnimationFrame(() => {
              updateSelectedImageHandle()
            })
          }
        }, 0)
      }

      setIsDragging(false)
      setDragStart(null)
      setDragCurrentWidth(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, dragCurrentWidth, updateResizeHandlePosition, updateSelectedImageHandle])

    useEffect(() => {
      let cancelled = false
      let instance: ToastEditorInstance | null = null
      let editorEl: HTMLDivElement | null = null

      const handleMaybeSyncSelection = () => {
        updateSelectedImageHandle()
      }

      const handleEditorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null
        if (!target) return

        const clickedImage = target.closest('img')
        if (clickedImage) {
          const editorInstance = editorRef.current
          if (editorInstance) {
            ensureWysiwygImageNodeSelectionFromClick(editorInstance, e)
          }

          requestAnimationFrame(() => {
            updateSelectedImageHandle()
          })
          return
        }

        requestAnimationFrame(() => {
          updateSelectedImageHandle()
        })
      }

      const initEditor = async () => {
        if (!isAuthenticated || !editorRootRef.current) return
        const { default: ToastEditor } = await import('@toast-ui/editor')
        if (cancelled || !editorRootRef.current) return

        editorEl = editorRootRef.current

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

         instance.addCommand('wysiwyg', 'setNoticeImageWidth', (payload, state, dispatch) => {
           const parsed = parseNoticeImageWidthPayload(payload)
           if (!parsed) return false

           let found: { pos: number, node: ProseMirrorNode } | null = null

           if (parsed.pos !== undefined) {
             const nodeAt = state.doc.nodeAt(parsed.pos)
             if (nodeAt?.type?.name === 'image') {
               found = { pos: parsed.pos, node: nodeAt }
             }
           }

           if (!found) {
             found = findSelectedImage(state)
           }

           if (!found) return false

           const nextAttrs: Record<string, unknown> = { ...found.node.attrs }

           if (parsed.kind === 'clear') {
             delete nextAttrs['data-notice-width']
           } else {
             nextAttrs['data-notice-width'] = `${parsed.width}${parsed.unit}`
             delete nextAttrs['data-notice-size']
           }

           dispatch(state.tr.setNodeMarkup(found.pos, null, nextAttrs))
           return true
         })

         instance.on('change', () => {
           const html = instance?.getHTML() ?? ''
           setPreviewHtml(sanitizeNoticeHtml(html))
         })

          editorRef.current = instance

          editorEl.addEventListener('mouseup', handleMaybeSyncSelection)
          editorEl.addEventListener('keyup', handleMaybeSyncSelection)
          editorEl.addEventListener('focusin', handleMaybeSyncSelection)
          editorEl.addEventListener('click', handleEditorClick)

           requestAnimationFrame(() => {
             updateSelectedImageHandle()
           })
        }

     void initEditor()

      return () => {
        cancelled = true

        if (editorEl) {
          editorEl.removeEventListener('mouseup', handleMaybeSyncSelection)
          editorEl.removeEventListener('keyup', handleMaybeSyncSelection)
          editorEl.removeEventListener('focusin', handleMaybeSyncSelection)
          editorEl.removeEventListener('click', handleEditorClick)
        }

        if (instance) {
          instance.destroy()
        }
        editorRef.current = null

        setResizeHandlePos(null)
      }
    }, [isAuthenticated, updateSelectedImageHandle])

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotices()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (previewRef.current) {
      applyNoticeImageWidths(previewRef.current)
    }
  }, [previewHtml])

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

           {resizeHandlePos && (
              <>
                <div
                  ref={resizeHandleRef}
                  onMouseDown={handleResizeStart}
                 className="fixed z-50 w-4 h-4 rounded-full bg-[color:var(--jade)] border-2 border-white cursor-nwse-resize shadow-lg hover:scale-125 transition-transform"
                 style={{
                   top: resizeHandlePos.top,
                   left: resizeHandlePos.left,
                   pointerEvents: isDragging ? 'none' : 'auto',
                 }}
                 role="button"
                 aria-label="이미지 크기 조절"
               />
               {isDragging && dragCurrentWidth !== null && (
                 <div
                   className="fixed z-50 px-3 py-2 rounded-lg bg-[color:var(--ink)] text-white text-xs font-semibold shadow-lg pointer-events-none"
                   style={{
                     top: resizeHandlePos.top - 40,
                     left: resizeHandlePos.left - 30,
                   }}
                 >
                   {Math.round(dragCurrentWidth)}px
                 </div>
               )}
             </>
           )}


           <div className="mt-6 rounded-lg border border-[color:var(--line)] bg-white p-6">
             <h3 className="text-lg font-semibold mb-4">게시 미리보기</h3>
             <div
               ref={previewRef}
               className="prose max-w-none text-sm leading-relaxed text-[color:var(--muted)]"
               dangerouslySetInnerHTML={{ __html: previewHtml }}
             />
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
                   setPreviewHtml('')
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
