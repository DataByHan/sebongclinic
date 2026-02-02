'use client'

import { useEffect, useId, useRef, useState } from 'react'

type KakaoMapProps = {
  appKey: string
  address: string
  className?: string
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

function loadKakaoScript(appKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src*="dapi.kakao.com"]')
    if (existing) {
      const waitForLoad = () => {
        if (window.kakao?.maps) {
          resolve()
        } else {
          setTimeout(waitForLoad, 100)
        }
      }
      waitForLoad()
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`
    script.onload = () => {
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => {
          resolve()
        })
      } else {
        reject(new Error('Kakao Maps SDK not initialized'))
      }
    }
    script.onerror = () => reject(new Error('Failed to load Kakao SDK'))
    document.head.appendChild(script)
  })
}

export default function KakaoMap({ appKey, address, className }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<LoadState>('idle')
  const containerId = useId()

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      if (!containerRef.current) return
      if (typeof window === 'undefined') return

      try {
        setState('loading')
        await loadKakaoScript(appKey)
        
        if (cancelled) return
        if (!window.kakao?.maps) {
          setState('error')
          return
        }

        const kakao = window.kakao
        const container = containerRef.current
        if (!container) return

        const defaultCenter = new kakao.maps.LatLng(35.153, 129.118)
        const map = new kakao.maps.Map(container, { center: defaultCenter, level: 3 })
        const geocoder = new kakao.maps.services.Geocoder()

        geocoder.addressSearch(address, (result, status) => {
          if (cancelled) return
          if (status !== kakao.maps.services.Status.OK) {
            setState('error')
            return
          }
          const first = result[0]
          if (!first) {
            setState('error')
            return
          }

          const lat = Number(first.y)
          const lng = Number(first.x)
          const center = new kakao.maps.LatLng(lat, lng)
          map.setCenter(center)

          const marker = new kakao.maps.Marker({ position: center })
          marker.setMap(map)

          setState('ready')
        })
      } catch {
        if (cancelled) return
        setState('error')
      }
    }

    start()
    return () => {
      cancelled = true
    }
  }, [address, appKey])

  return (
    <div className={['relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white', className ?? ''].join(' ')}>
      <div ref={containerRef} id={containerId} className="absolute inset-0" />
      {state !== 'ready' ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[color:var(--paper)]/70 backdrop-blur-sm">
          <div className="text-sm text-[color:var(--muted)]">
            {state === 'error' ? '지도를 불러오지 못했습니다.' : '지도를 불러오는 중…'}
          </div>
        </div>
      ) : null}
    </div>
  )
}
