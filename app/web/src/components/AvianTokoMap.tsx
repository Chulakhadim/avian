import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { useGlobal } from 'web-utils'
import { defaultCenter, globalToko } from '../base/global/toko'
import { AvianTokoMapCluster, Bound, FlattedStore } from './AvianTokoMapCluster'

export const AvianTokoMap = () => {
  const toko = useGlobal(globalToko, async () => {
    await getLokasi()
    redrawMarker()
  })

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLEA_API_KEY,
  })

  const meta = toko.map
  const redrawMarker = ((shouldCenter = false, shouldZoom = false) => {
    return new Promise<void>(async (resolve) => {
      if (meta.loading) {
        resolve(undefined)
        return
      }
      meta.loading = true
      const filter = toko.filter.data
      toko.render()

      const keys = (obj: any) => Object.keys(obj)

      clearTimeout(meta.redrawTimeout)
      meta.redrawTimeout = setTimeout(async () => {
        if (meta.bounds) {
          meta.found = {}
          meta.search = false
          meta.grouped = await queryStoreInBounds(meta.bounds)
          meta.flatted = flattenStores(meta.grouped)

          if (keys(filter.kategori).length > 0) {
            if (toko.filter.options.produk.flatten.length === 0) {
              const where = {} as any
              const kat = Object.keys(filter.kategori)
              if (kat.length > 0) {
                where['id_category'] = {
                  in: kat.map((e) => parseInt(e)),
                }
              }

              toko.filter.options.produk.flatten =
                await db.dtb_product.findMany({
                  select: { id: true, name: true },
                  where,
                  orderBy: {
                    order: 'asc',
                  },
                })
            }
          }

          if (
            keys(filter.produk).length > 0 ||
            toko.filter.options.produk.flatten.length > 0
          ) {
            const products = { ...filter.produk }
            if (keys(filter.produk).length === 0) {
              for (let i of toko.filter.options.produk.flatten) {
                products[i.id] = true
              }
            }

            const storeHasProducts = {} as any
            ;(
              await db.mst_store.findMany({
                select: {
                  id: true,
                },
                where: {
                  id: {
                    in: meta.flatted.map((e) => parseInt(e.id)),
                  },
                  OR: keys(products).map((e) => {
                    return {
                      product_ids: {
                        array_contains: [parseInt(e)],
                      },
                    }
                  }),
                },
              })
            ).forEach((e) => {
              storeHasProducts[e.id] = true
            })

            meta.search = true
            meta.flatted.forEach((e) => {
              if (storeHasProducts[e.id]) {
                meta.found[e.id] = e
              }
            })
          }

          if (
            keys(filter.lokasi).length > 0 &&
            keys(filter.toko).length === 0
          ) {
            meta.search = true
            // const values = Object.values(filter.lokasi)
            // meta.flatted.forEach((e) => {
            //   for (let i of values) {
            //     if (e.kota_code === i.code) meta.found[e.id] = e
            //   }
            // })

            meta.flatted.forEach((e) => {
              if (!!toko.filter.options.toko.tree)
                for (let i of toko.filter.options.toko.tree) {
                  if (parseInt(e.id) === i.id) meta.found[e.id] = e
                }
            })
          }

          if (keys(filter.toko).length > 0) {
            meta.search = true
            const values = Object.values(filter.toko)
            meta.flatted.forEach((e) => {
              for (let i of values) {
                if (i.id === parseInt(e.id)) meta.found[e.id] = e
              }
            })
          }

          if (
            shouldCenter &&
            (keys(meta.found).length > 0 ||
              keys(filter.toko).length > 0 ||
              keys(filter.lokasi).length > 0)
          ) {
            const maps = (window as any).google.maps as typeof google.maps
            const bounds = new maps.LatLngBounds()
            for (let p of Object.values(meta.found).map((e) => {
              return e.location
            })) {
              bounds.extend(new maps.LatLng(p.lat, p.lng))
            }

            for (let p of Object.values(filter.toko)) {
              bounds.extend(new maps.LatLng(p.lattitude, p.longitude))
            }

            if (Object.values(filter.toko).length === 0)
              for (let p of Object.values(filter.lokasi)) {
                bounds.extend(new maps.LatLng(p.latitude, p.longitude))
                continue
              }

            if (shouldZoom) {
              const p = defaultCenter
              bounds.extend(new maps.LatLng(p.lat, p.lng))
              meta.gmap?.fitBounds(bounds)
            } else {
              const center = bounds.getCenter()
              meta.center = {
                lat: center.lat(),
                lng: center.lng(),
              }
            }
          }
        }
        meta.loading = false
        toko.render()
        resolve()
      }, 1000)
    })
  }) as any
  meta.redrawMarker = redrawMarker

  const getLokasi = async () => {
    const w = window as any
    let perm = ''
    if (w.Capacitor) {
      const geo = w.Capacitor.Plugins.Geolocation
      perm = await geo.requestPermissions()
    } else {
      const r = await navigator.permissions.query({ name: 'geolocation' })
      perm = r.state
    }
    if (perm !== 'denied') {
      let res
      const cap = w.Capacitor
      try {
        if (cap && !!cap.Plugins.BluetoothLe) {
          let platform = ''
          if (!!cap.Plugins.Device) {
            const info = await cap.Plugins.Device.getInfo()
            platform = info.platform
          } else if (w.Device) {
            const info = await w.Device.getInfo()
            platform = info.platform
          }

          if (platform === 'ios') {
            if (!!cap.Plugins.Geolocation) {
              res = await cap.Plugins.Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
              })
            }
          } else {
            const isLocationEnabled =
              await cap.Plugins.BluetoothLe.isLocationEnabled()
            if (isLocationEnabled.value && !!cap.Plugins.Geolocation) {
              res = await cap.Plugins.Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
              })
            } else {
              await cap.Plugins.BluetoothLe.openLocationSettings()
            }
          }
        } else {
          res = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((pos) => {
              resolve(pos)
            })
          })
        }
        defaultCenter.lat = res.coords.latitude
        defaultCenter.lng = res.coords.longitude
        // defaultCenter.lat = -7.3427854
        // defaultCenter.lng = 112.7281683
        meta.center = { ...defaultCenter }
        meta.ready = true
        meta.loading = false
        toko.render()
      } catch (err) {
        meta.ready = true
        toko.render()
        return err
      }
    }
  }

  return (
    <div
      className="w-full h-full flex-1 relative"
      css={css`
        #map-container {
          width: 100%;
          height: 100%;
        }
      `}
    >
      <img
        onClick={() => {
          meta.center = {
            lat: parseFloat(defaultCenter.lat.toString()),
            lng: parseFloat(defaultCenter.lng.toString()),
          }
          toko.render()
        }}
        className="absolute bg-blue-500 text-white p-3 rounded-full  mb-6 mr-3 bottom-0 right-0 btn-fade shadow-md"
        css={css`
          width: 50px;
          height: 50px;
          z-index: 2000;
        `}
        src="/icons/icon_current.png"
      />

      {meta.loading && <Loading />}

      {isLoaded && meta.ready && (
        <GoogleMap
          id="map-container"
          onLoad={(map) => {
            toko.map.gmap = map
          }}
          options={{
            gestureHandling: 'greedy',
            zoomControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [
                  {
                    visibility: 'off',
                  },
                ],
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [
                  {
                    visibility: 'off',
                  },
                ],
              },
            ],
            mapTypeControl: false,
            streetViewControl: false,
          }}
          onClick={() => {
            if (!!toko.selected) {
              toko.selected = null
              toko.render()
            }
          }}
          onBoundsChanged={() => {
            if (meta.gmap) {
              const zoom = meta.gmap.getZoom()
              if (zoom) {
                meta.zoom = zoom
              }
              const bounds = meta.gmap.getBounds()
              if (bounds) meta.bounds = bounds
              redrawMarker()
            }
          }}
          zoom={toko.map.zoom}
          center={toko.map.center}
        >
          <AvianTokoMapCluster />
        </GoogleMap>
      )}
    </div>
  )
}

const GOOGLEA_API_KEY = 'AIzaSyAdfB-1tzijt8NQRVY6SLNft9_JwxWxu1s'

const flattenStores = (
  stores: Record<
    string,
    {
      code: string
      stores: Record<
        string,
        {
          lat: number
          lng: number
        }
      >
    }
  >
): FlattedStore[] => {
  const result: FlattedStore[] = []

  for (let [k, v] of Object.entries(stores)) {
    for (let [i, j] of Object.entries(v.stores)) {
      result.push({
        kota: k,
        kota_code: v.code,
        id: i,
        location: j,
      })
    }
  }

  return result
}

const queryStoreInBounds = async (b: Bound) => {
  // const count = await countStoreInBounds(b)
  const groups = await queryGroupedStoreInBounds(b)
  const branches = await db.mst_branch.findMany({
    where: {
      code: {
        in: groups.map((e: any) => e.code),
      },
    },
  })
  const result = {} as any
  const groupedName = {} as any

  for (let group of groups) {
    const result = group.stores.split('#')
    const stores = {} as any

    for (let i of result) {
      const col = i.split('|')
      stores[col[0]] = {
        lat: col[1],
        lng: col[2],
      }
    }

    groupedName[group.code] = {
      code: group.code,
      stores,
    }
  }

  for (let branch of branches) {
    result[branch.name] = groupedName[branch.code]
  }

  return result
}

const queryGroupedStoreInBounds = async (b: Bound) => {
  const ne = b.getNorthEast()
  const sw = b.getSouthWest()
  const sql = `SELECT 
      string_agg(concat(
          mst_store.id::character varying,
          '|',
          mst_store.lattitude::character varying,
          '|',
          mst_store.longitude::character varying
          ), '#') as stores,
    
      left(store_id,3) as code
        FROM   mst_store
        WHERE  ST_Point( lattitude, longitude) 
            @ 
            ST_MakeEnvelope (${sw.lat()}, ${sw.lng()},${ne.lat()}, ${ne.lng()})
        group by left(store_id,3) `
  return await db.query(sql)
}

const Loading = () => (
  <div className="absolute right-0 top-1 z-20 text-gray-600 text-base px-2 flex items-center gap-1">
    <span>loading</span>
    <svg
      style={{ marginTop: 5 }}
      width="15"
      height="5"
      viewBox="0 0 120 30"
      xmlns="http://www.w3.org/2000/svg"
      fill="#4B5563"
    >
      <circle cx="15" cy="15" r="15">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="60" cy="15" r="9" fillOpacity="0.3">
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="0.8s"
          values="9;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="0.5"
          to="0.5"
          begin="0s"
          dur="0.8s"
          values=".5;1;.5"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
)
