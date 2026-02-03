'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css'
import type { EditorState, Selection } from 'prosemirror-state'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import type { Notice } from '@/types/cloudflare'
import { sanitizeNoticeHtml } from '@/lib/sanitize'
import { applyNoticeImageWidths } from '@/lib/apply-notice-image-width'

type ToastEditorInstance = import('@toast-ui/editor').default

type NoticeImageSize = 'sm' | 'md' | 'lg' | 'full'

type NoticeImageWidthUnit = 'px' | '%'

type NoticeImageWidthPayloadParsed =
  | { kind: 'set', width: string, unit: NoticeImageWidthUnit }
  | { kind: 'clear' }

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

  const { width, unit, action } = payload as { width?: unknown, unit?: unknown, action?: unknown }
  if (action === 'clear') return { kind: 'clear' }

  const widthText = typeof width === 'number'
    ? String(width)
    : (typeof width === 'string' ? width.trim() : null)
  if (!widthText) return null
  if (!/^\d+(\.\d+)?$/.test(widthText)) return null

  const unitText = unit === 'px' || unit === '%'
    ? unit
    : null
  if (!unitText) return null

  return { kind: 'set', width: widthText, unit: unitText }
}

const parseNoticeWidthText = (value: unknown): { width: string, unit: NoticeImageWidthUnit } | null => {
  if (typeof value !== 'string') return null
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(px|%)$/)
  if (!match) return null
  const unit = match[2] === 'px' ? 'px' : '%'
  return { width: match[1], unit }
}

const getWysiwygEditorState = (editor: ToastEditorInstance): EditorState | null => {
  const maybe = editor as unknown as { getCurrentModeEditor?: () => unknown }
  const mode = maybe.getCurrentModeEditor?.() as { view?: { state?: EditorState } } | undefined
  return mode?.view?.state ?? null
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [notices, setNotices] = useState<Notice[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')

  const [imagePopoverOpen, setImagePopoverOpen] = useState(false)
  const [imagePopoverTop, setImagePopoverTop] = useState(0)
  const [imagePopoverLeft, setImagePopoverLeft] = useState(0)
  const [imagePopoverSelectedKey, setImagePopoverSelectedKey] = useState<string | null>(null)
  const [imageWidthInput, setImageWidthInput] = useState('')
  const [imageWidthUnit, setImageWidthUnit] = useState<NoticeImageWidthUnit>('px')
  const [imageWidthError, setImageWidthError] = useState<string | null>(null)

  const editorRef = useRef<ToastEditorInstance | null>(null)
  const editorRootRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const imagePopoverRef = useRef<HTMLDivElement>(null)

  const passwordRef = useRef(password)
  const imagePopoverOpenRef = useRef(false)
  const imagePopoverSelectedKeyRef = useRef<string | null>(null)
  const suppressPopoverForKeyRef = useRef<string | null>(null)

  useEffect(() => {
    passwordRef.current = password
  }, [password])

  useEffect(() => {
    imagePopoverOpenRef.current = imagePopoverOpen
  }, [imagePopoverOpen])

  useEffect(() => {
    imagePopoverSelectedKeyRef.current = imagePopoverSelectedKey
  }, [imagePopoverSelectedKey])

  const closeImagePopover = useCallback(({ suppress }: { suppress: boolean }) => {
    if (suppress) {
      suppressPopoverForKeyRef.current = imagePopoverSelectedKeyRef.current
    }
    setImagePopoverOpen(false)
    setImageWidthError(null)
  }, [])

  const validateImageWidth = useCallback(({ widthText, unit }: { widthText: string, unit: NoticeImageWidthUnit }): string | null => {
    const trimmed = widthText.trim()
    if (!trimmed) return '값을 입력해 주세요.'
    if (!/^\d+(\.\d+)?$/.test(trimmed)) return '숫자만 입력해 주세요.'

    const value = Number.parseFloat(trimmed)
    if (!Number.isFinite(value)) return '유효한 숫자를 입력해 주세요.'
    if (value <= 0) return '0보다 큰 값을 입력해 주세요.'
    if (unit === '%' && value > 100) return '퍼센트(%)는 100 이하로 입력해 주세요.'
    if (unit === 'px' && value > 5000) return '픽셀(px)은 5000 이하로 입력해 주세요.'
    return null
  }, [])

  const updateImagePopoverPosition = useCallback(() => {
    const editorEl = editorRootRef.current
    const popoverEl = imagePopoverRef.current
    if (!editorEl || !popoverEl) return

    const selectedEl = editorEl.querySelector('.ProseMirror-selectednode') as HTMLElement | null
    if (!selectedEl) return

    const anchorRect = selectedEl.getBoundingClientRect()
    const popRect = popoverEl.getBoundingClientRect()

    const gutter = 10
    const belowTop = anchorRect.bottom + 10
    const aboveTop = anchorRect.top - popRect.height - 10
    const top = (belowTop + popRect.height <= window.innerHeight - gutter) ? belowTop : aboveTop

    const nextTop = clamp(Math.round(top), gutter, Math.max(gutter, window.innerHeight - popRect.height - gutter))
    const nextLeft = clamp(
      Math.round(anchorRect.left),
      gutter,
      Math.max(gutter, window.innerWidth - popRect.width - gutter),
    )

    setImagePopoverTop(nextTop)
    setImagePopoverLeft(nextLeft)
  }, [])

  const syncImagePopoverFromSelection = useCallback(({ forceOpen }: { forceOpen: boolean }) => {
    const editorInstance = editorRef.current
    if (!editorInstance) return

    if (!forceOpen) {
      const selectedEl = editorRootRef.current?.querySelector('.ProseMirror-selectednode') as HTMLElement | null
      const isImageNodeSelected = selectedEl?.tagName?.toLowerCase() === 'img'
      if (!isImageNodeSelected) {
        suppressPopoverForKeyRef.current = null
        setImagePopoverOpen(false)
        setImagePopoverSelectedKey(null)
        setImageWidthError(null)
        return
      }
    }

    const state = getWysiwygEditorState(editorInstance)
    if (!state) return

    const found = findSelectedImage(state)
    if (!found) {
      suppressPopoverForKeyRef.current = null
      setImagePopoverOpen(false)
      setImagePopoverSelectedKey(null)
      setImageWidthError(null)
      return
    }

    const key = `${found.pos}:${String(found.node.attrs.src ?? '')}`
    const isSuppressed = suppressPopoverForKeyRef.current === key

    setImagePopoverSelectedKey(key)

    const canOpen = forceOpen || !isSuppressed
    if (!canOpen) return

    if (key !== imagePopoverSelectedKeyRef.current || !imagePopoverOpenRef.current) {
      const parsed = parseNoticeWidthText(found.node.attrs['data-notice-width'])
      setImageWidthInput(parsed?.width ?? '')
      setImageWidthUnit(parsed?.unit ?? 'px')
      setImageWidthError(null)
    }

    setImagePopoverOpen(true)
    requestAnimationFrame(() => {
      updateImagePopoverPosition()
    })
  }, [updateImagePopoverPosition])

  const applyImageWidth = () => {
    const editorInstance = editorRef.current
    if (!editorInstance) return

    const widthText = imageWidthInput.trim()
    const error = validateImageWidth({ widthText, unit: imageWidthUnit })
    if (error) {
      setImageWidthError(error)
      return
    }

    setImageWidthError(null)
    suppressPopoverForKeyRef.current = null
    const success = (editorInstance.exec as (name: string, payload?: Record<string, unknown>) => boolean)('setNoticeImageWidth', { width: widthText, unit: imageWidthUnit })
    if (!success) {
      alert('이미지를 선택해 주세요.')
      return
    }

    requestAnimationFrame(() => {
      syncImagePopoverFromSelection({ forceOpen: true })
    })
  }

  const clearImageWidth = () => {
    const editorInstance = editorRef.current
    if (!editorInstance) return

    setImageWidthInput('')
    setImageWidthError(null)
    suppressPopoverForKeyRef.current = null
    const success = (editorInstance.exec as (name: string, payload?: Record<string, unknown>) => boolean)('setNoticeImageWidth', { action: 'clear' })
    if (!success) {
      alert('이미지를 선택해 주세요.')
      return
    }

    requestAnimationFrame(() => {
      syncImagePopoverFromSelection({ forceOpen: true })
    })
  }

  useEffect(() => {
    if (!imagePopoverOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeImagePopover({ suppress: true })
      }
    }

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (!target) return
      if (imagePopoverRef.current?.contains(target)) return

      const selectedEl = editorRootRef.current?.querySelector('.ProseMirror-selectednode')
      if (selectedEl && selectedEl.contains(target)) return

      closeImagePopover({ suppress: true })
    }

    const handleReposition = () => {
      updateImagePopoverPosition()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [closeImagePopover, imagePopoverOpen, updateImagePopoverPosition])

    useEffect(() => {
      let cancelled = false
      let instance: ToastEditorInstance | null = null
      let editorEl: HTMLDivElement | null = null

      const handleMaybeSyncSelection = () => {
        syncImagePopoverFromSelection({ forceOpen: false })
      }

      const handleEditorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null
        if (!target) return

        const clickedImage = target.closest('img')
        if (clickedImage) {
          suppressPopoverForKeyRef.current = null
          syncImagePopoverFromSelection({ forceOpen: true })
          return
        }

        syncImagePopoverFromSelection({ forceOpen: false })
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

           const found = findSelectedImage(state)
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
            syncImagePopoverFromSelection({ forceOpen: false })
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

        suppressPopoverForKeyRef.current = null
        setImagePopoverOpen(false)
        setImagePopoverSelectedKey(null)
      }
    }, [isAuthenticated, syncImagePopoverFromSelection])

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

           {imagePopoverOpen && (
             <div
               ref={imagePopoverRef}
               className="fixed z-50 w-[min(360px,calc(100vw-20px))] flat-card p-4"
               style={{ top: imagePopoverTop, left: imagePopoverLeft }}
               role="dialog"
               aria-label="이미지 너비 설정"
             >
               <div className="flex items-start justify-between gap-3 mb-3">
                 <div className="text-sm font-semibold">이미지 너비</div>
                 <button
                   type="button"
                   onClick={() => closeImagePopover({ suppress: true })}
                   className="cta-ghost px-3 py-2 text-sm"
                 >
                   닫기
                 </button>
               </div>

               <div className="text-xs text-[color:var(--muted)] mb-2">
                 선택된 이미지에만 적용됩니다.
               </div>

               <div className="flex items-center gap-2">
                 <input
                   type="text"
                   inputMode="decimal"
                   value={imageWidthInput}
                   onChange={(e) => {
                     setImageWidthInput(e.target.value)
                     if (imageWidthError) setImageWidthError(null)
                   }}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       e.preventDefault()
                       applyImageWidth()
                     }
                   }}
                   placeholder="예: 320"
                   className={[
                     'flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--jade)]',
                     imageWidthError ? 'border-[color:var(--tangerine)]' : 'border-[color:var(--line)]',
                   ].join(' ')}
                   aria-invalid={Boolean(imageWidthError)}
                 />

                 <div className="inline-flex rounded-xl border border-[color:var(--line)] overflow-hidden">
                   <button
                     type="button"
                     onClick={() => setImageWidthUnit('px')}
                     className={[
                       'px-3 py-2 text-sm',
                       imageWidthUnit === 'px' ? 'bg-[color:var(--paper)] text-[color:var(--ink)]' : 'bg-white text-[color:var(--muted)]',
                     ].join(' ')}
                     aria-pressed={imageWidthUnit === 'px'}
                   >
                     px
                   </button>
                   <button
                     type="button"
                     onClick={() => setImageWidthUnit('%')}
                     className={[
                       'px-3 py-2 text-sm border-l border-[color:var(--line)]',
                       imageWidthUnit === '%' ? 'bg-[color:var(--paper)] text-[color:var(--ink)]' : 'bg-white text-[color:var(--muted)]',
                     ].join(' ')}
                     aria-pressed={imageWidthUnit === '%'}
                   >
                     %
                   </button>
                 </div>
               </div>

               {imageWidthError && (
                 <div className="text-xs mt-2 text-[color:var(--tangerine)]">
                   {imageWidthError}
                 </div>
               )}

               <div className="flex gap-2 mt-4">
                 <button type="button" onClick={applyImageWidth} className="cta">
                   적용
                 </button>
                 <button type="button" onClick={clearImageWidth} className="cta-ghost">
                   지우기
                 </button>
               </div>
             </div>
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
