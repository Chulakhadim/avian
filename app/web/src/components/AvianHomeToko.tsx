import { Swiper, SwiperSlide } from 'swiper/react'
import { useGlobal } from 'web-utils'
import { globalHome } from '../base/global/home'
import { globalToko } from '../base/global/toko'
import { ProgressBar } from './loader-icons'

export const AvianHomeToko = () => {
  const toko = useGlobal(globalToko)
  const meta = useGlobal(globalHome, async () => {
    if (!localStorage.lokasi_aktif) {
      meta.isGPSon = 'no'
      meta.render()
    } else {
      if (localStorage.lokasi_aktif === 'y' && meta.isGPSon === 'pending') {
        action.aktifkanLokasi()
      }
    }
  })

  const action = {
    cekLokasi: async () => {
      const w = window as any
      if (w.Capacitor) {
        const geo = w.Capacitor.Plugins.Geolocation
        const res = await geo.requestPermissions()
        return res.location === 'granted'
      } else {
        const res = await navigator.permissions.query({ name: 'geolocation' })
        return res.state === 'granted'
      }
    },
    aktifkanLokasi: async () => {
      if (await action.cekLokasi()) {
        localStorage.lokasi_aktif = 'y'
        meta.isGPSon = 'yes'
        await action.getLokasiTerdekat()
        meta.render()
      } else {
        meta.isGPSon = 'no'
        alert('Gagal Mengaktifkan Lokasi')
        meta.render()
      }
    },
    dapatkanLokasi: async () => {
      let res
      const w = window as any
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
              res =
                await cap.Plugins.Geolocation.getCurrentPosition({
                  enableHighAccuracy: true,
                })
            }
          } else {
            const isLocationEnabled =
              await cap.Plugins.BluetoothLe.isLocationEnabled()
            if (isLocationEnabled.value && !!cap.Plugins.Geolocation) {
              res =
                await cap.Plugins.Geolocation.getCurrentPosition({
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
        return !!res ? res.coords : null
      } catch (err) {
        return err
      }
    },
    getLokasiTerdekat: async () => {
      meta.lokasiLoading = true
      meta.render()
      const loc = await action.dapatkanLokasi()
      if (!!loc) {
        const lat = loc.latitude
        const lng = loc.longitude
        let res = [] as any[]
        if (lat === undefined || lng === undefined) {
          return res
        }
        const sql = `SELECT *, ST_DistanceSphere(ST_Point( lattitude, longitude) , ST_MakePoint(${lat},${lng})) as distance
        FROM mst_store order by distance asc limit 10`
        res = await db.query(sql)
        meta.lokasiTerdekat = res
      } else {
        meta.isGPSon = 'no'
      }

      meta.lokasiLoading = false
      meta.render()
    },
    getRealDistance: (distance: number) => {
      const result = distance / 1000
      return result.toFixed(1)
    },
  }

  return (
    <div
      className={`flex self-stretch flex-col space-y-8 items-start justify-start p-4`}
    >
      <div className="flex self-stretch flex-col space-y-1 items-start justify-start">
        <div
          className={`text-lg font-bold leading-relaxed text-green-900 text-avian-green1`}
        >
          Lokasi Toko Terdekat
        </div>
        <div className={`text-sm leading-tight text-gray-800`}>
          Temukan toko-toko Avian Brands terdekat dari lokasi Anda
        </div>
      </div>
      <div
        className="flex self-stretch flex-col space-y-8 items-start justify-start"
        css={css`
          height: 120px;
        `}
      >
        {meta.isGPSon === 'no' && (
          <div
            className="mx-auto flex flex-col gap-2.5 w-64 p-5"
            css={css`
              width: 280px;
            `}
          >
            <div className="text-xs text-avian-grey4">
              Untuk melihat toko-toko terdekat dari Anda, aktifkan layanan
              lokasi di ponsel Anda.
            </div>
            <div
              className={`btn-fade text-center text-avian-green4 avian-green3 text-white px-12 py-2.5 rounded-md`}
              onClick={action.aktifkanLokasi}
            >
              Aktifkan Lokasi
            </div>
          </div>
        )}

        {(meta.isGPSon === 'pending' || meta.lokasiLoading) && (
          <div
            className="mx-auto flex flex-col gap-2.5 w-64 p-5"
            css={css`
              width: 280px;
            `}
          >
            <div className="text-sm text-avian-grey4 text-center">
              <div className="mb-3">Mencari toko terdekat...</div>
              <ProgressBar />
            </div>
          </div>
        )}

        {meta.isGPSon === 'yes' && !meta.lokasiLoading && (
          <Swiper slidesPerView={1.5} spaceBetween={20} className="w-full">
            {meta.lokasiTerdekat.map((item: any, key: number) => {
              return (
                <SwiperSlide key={key}>
                  <a
                    className={`flex flex-col  shadow rounded`}
                    href={`/toko/${item.store_id}`}
                    onClick={() => {
                      toko.filter.open = false
                      navigate(`/toko/${item.store_id}`)
                    }}
                  >
                    <div
                      className={`flex self-stretch flex-col space-y-0.5 items-start justify-start p-2.5 bg-white rounded-tl rounded-tr  gap-2`}
                    >
                      <div className="flex self-stretch space-x-0.5 items-center justify-start">
                        <img
                          src="/imgs/rumah.svg"
                          css={css`
                            width: 20px;
                            min-width: 20px;
                            max-width: 20px;
                            height: 20px;
                            min-height: 20px;
                            max-height: 20px;
                          `}
                        />
                        <div
                          className={`text-base font-bold leading-normal text-green-900  text-avian-green1`}
                        >
                          {item.name.length > 20
                            ? item.name.substring(0, 20) + '...'
                            : item.name}
                        </div>
                      </div>
                      <div
                        css={css`
                          height: 35px;
                        `}
                        className={`text-sm leading-tight text-gray-800`}
                      >
                        {item.address}
                      </div>
                    </div>
                    <div
                      className={`flex self-stretch items-start justify-end py-1 pl-1 pr-2.5 bg-green-500 rounded-bl rounded-br avian-green3`}
                    >
                      <div className={`text-xs text-white`}>
                        {action.getRealDistance(item.distance)} km
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}
      </div>
    </div>
  )
}
