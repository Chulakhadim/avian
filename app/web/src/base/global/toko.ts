import {
  Bound,
  FlattedStore,
  GroupedStore,
} from '../../components/AvianTokoMapCluster'

export const defaultCenter = {
  lat: -7.34257,
  lng: 112.7302,
}

export const globalToko = {
  selected: null as null | {
    id: string
    lat: number
    lng: number
  },
  map: {
    ready: false,
    loading: false,
    center: { ...defaultCenter } as typeof defaultCenter,
    zoom: 14,
    gmap: null as null | google.maps.Map,
    flatted: [] as FlattedStore[],
    search: false,
    found: {} as Record<string, FlattedStore>,
    grouped: {} as GroupedStore,
    bounds: null as null | Bound,
    redrawTimeout: null as any,
    // redrawMarker is declared at AvianTokoMap
    redrawMarker: async (shouldCenter = false, shouldZoom = false) => {},
  },
  filter: {
    data: {
      kategori: {} as Record<any, any>,
      produk: {} as Record<any, any>,
      lokasi: {} as Record<any, any>,
      toko: {} as Record<any, any>,
    },
    open: false,
    options: {
      kategori: {
        search: '',
        flatten: [] as any[],
        tree: null as null | any[],
        reload: async () => {},
        loading: true as boolean,
      },
      produk: {
        search: '',
        flatten: [] as any[],
        tree: null as null | any[],
        reload: async () => {},
        loading: true as boolean,
      },
      lokasi: {
        search: '',
        flatten: [] as any[],
        tree: null as null | any[],
        reload: async () => {},
        loading: true as boolean,
      },
      toko: {
        search: '',
        flatten: [] as any[],
        tree: null as null | any[],
        reload: async () => {},
        loading: true as boolean,
      },
    },
    form: '',
  },

  ready: false,
}
