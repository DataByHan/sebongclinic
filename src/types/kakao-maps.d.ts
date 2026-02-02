declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void
        LatLng: new (lat: number, lng: number) => unknown
        Map: new (container: HTMLElement, options: { center: unknown; level?: number }) => {
          setCenter: (latlng: unknown) => void
        }
        Marker: new (options: { position: unknown }) => {
          setMap: (map: unknown) => void
        }
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (
                result: Array<{ x: string; y: string }>,
                status: string,
              ) => void,
            ) => void
          }
          Status: {
            OK: string
          }
        }
      }
    }
  }
}

export {}
