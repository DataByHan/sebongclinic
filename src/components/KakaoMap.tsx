'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type KakaoMapProps = {
  appKey: string
  address: string
  className?: string
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

function ensureKakaoScript(appKey: string) {
  const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-maps-sdk="true"]')
  if (existing) return

  const script = document.createElement('script')
  script.dataset.kakaoMapsSdk = 'true'
  script.async = true
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false&libraries=services`
  document.head.appendChild(script)
}

export default function KakaoMap({ appKey, address, className }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<LoadState>('idle')

  const containerId = useMemo(() => {
    return `kakao-map-${Math.random().toString(16).slice(2)}`
  }, [])

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      if (!containerRef.current) return
      if (typeof window === 'undefined') return

      try {
        setState('loading')
        ensureKakaoScript(appKey)

        const waitForSdk = () =>
          new Promise<void>((resolve, reject) => {
            const startedAt = Date.now()
            const tick = () => {
              if (cancelled) return
              if (window.kakao?.maps?.load) return resolve()
              if (Date.now() - startedAt > 12000) return reject(new Error('Kakao Maps SDK load timeout'))
              window.setTimeout(tick, 50)
            }
            tick()
          })

        await waitForSdk()
        if (cancelled) return

        window.kakao!.maps.load(() => {
          if (cancelled) return
          const container = containerRef.current
          if (!container) return

          const defaultCenter = new window.kakao!.maps.LatLng(35.153, 129.118)
          const map = new window.kakao!.maps.Map(container, { center: defaultCenter, level: 3 })
          const geocoder = new window.kakao!.maps.services.Geocoder()

          geocoder.addressSearch(address, (result, status) => {
            if (cancelled) return
            if (status !== window.kakao!.maps.services.Status.OK) {
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
            const center = new window.kakao!.maps.LatLng(lat, lng)
            map.setCenter(center)

            const marker = new window.kakao!.maps.Marker({ position: center })
            marker.setMap(map)

            setState('ready')
          })
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
