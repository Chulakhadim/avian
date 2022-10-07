import { Marker } from '@react-google-maps/api'
import useSupercluster from 'use-supercluster'
import { useGlobal } from 'web-utils'
import { defaultCenter, globalToko } from '../base/global/toko'

export const AvianTokoMapCluster = () => {
  const toko = useGlobal(globalToko)
  const meta = toko.map

  let bounds = null as any

  if (meta.bounds) {
    const aNorth = meta.bounds.getNorthEast().lat()
    const aEast = meta.bounds.getNorthEast().lng()
    const aSouth = meta.bounds.getSouthWest().lat()
    const aWest = meta.bounds.getSouthWest().lng()
    bounds = {
      nw: {
        lat: aNorth,
        lng: aWest,
      },
      se: {
        lat: aSouth,
        lng: aEast,
      },
    }
  }

  const maps = (window as any).google.maps as typeof google.maps
  const { clusters, supercluster } = useSupercluster({
    points: meta.flatted.map((e) => {
      return {
        type: 'Feature',
        properties: {
          id: e.id,
          kota: e.kota,
          cluster: false,
          point_count: 0,
          cluster_id: 0,
          lat: e.location.lat,
          lng: e.location.lng,
        },
        geometry: {
          type: 'Point',
          coordinates: [e.location.lng, e.location.lat],
        },
      }
    }),
    bounds: bounds
      ? [bounds.nw.lng, bounds.se.lat, bounds.se.lng, bounds.nw.lat]
      : undefined,
    zoom: meta.zoom,
    options: {
      radius: 100,
    },
  })
  return (
    <>
      {clusters.map((e, idx) => {
        const location = e.geometry.coordinates
        const lng = parseFloat(location[0].toString())
        const lat = parseFloat(location[1].toString())
        const { cluster, id, cluster_id } = e.properties
        const selected = toko.selected && toko.selected.id === id
        let isActive = true

        if (meta.search) isActive = false
        if (!cluster) {
          if (Object.keys(meta.found).length > 0) {
            Object.keys(meta.found).find((e) => {
              if (parseInt(e) === parseInt(id)) {
                isActive = true
              }
            })
          }

          if (selected) isActive = true
          return (
            <Marker
              key={idx}
              shape={
                {
                  type: 'circle',
                } as any
              }
              opacity={isActive ? 1 : 0.4}
              position={new maps.LatLng(lat, lng)}
              onClick={() => {
                toko.selected = {
                  id,
                  lat,
                  lng,
                }
                toko.render()
              }}
              icon={{
                scaledSize: selected
                  ? new maps.Size(45, 45)
                  : new maps.Size(75, 75),
                url: selected
                  ? '/images/map_marker_store.png'
                  : '/images/map_icon.png',
              }}
            />
          )
        } else {
          if (Object.keys(meta.found).length > 0) {
            if (findChildren(meta.found, cluster_id, supercluster)) {
              isActive = true
            }
          }

          return (
            <Marker
              key={idx}
              onClick={() => {
                meta.zoom += 1
                meta.center = { lat, lng }
                toko.render()
              }}
              opacity={isActive ? 1 : 0.4}
              position={new maps.LatLng(lat, lng)}
              icon={{
                url: '/images/marker_cluster.png',
                scaledSize: new maps.Size(75, 75),
              }}
            />
          )
        }
      })}
      <Marker
        position={defaultCenter}
        icon={{
          url: '/images/map_saya.png',
          scaledSize: new maps.Size(75, 75),
        }}
      />
    </>
  )
}

export type GroupedStore = Record<
  string,
  {
    code: string
    ids: number[]
    stores: Record<number, any>
  }
>

export type Bound = google.maps.LatLngBounds

export type FlattedStore = {
  id: string
  location: {
    lat: number
    lng: number
  }
  kota: string
  kota_code: string
}

const findChildren = (
  searchResult: Record<string, FlattedStore>,
  cluster_id: any,
  supercluster: any
) => {
  for (let i of supercluster?.getChildren(cluster_id)) {
    if (i.properties.point_count > 1) {
      if (findChildren(searchResult, i.properties.cluster_id, supercluster)) {
        return true
      }
    } else if (searchResult[i.properties.id]) {
      return true
    }
  }
  return false
}

const flattenChildren = (cluster_id: any, supercluster: any) => {
  let results: any = {}
  for (let i of supercluster?.getChildren(cluster_id)) {
    if (i.properties.point_count > 1) {
      const a = flattenChildren(i.properties.cluster_id, supercluster)
      for (let [_, v] of Object.entries(a) as any) {
        results[v.properties.id] = v
      }
    } else {
      results[i.properties.id] = i
    }
  }
  return results
}
