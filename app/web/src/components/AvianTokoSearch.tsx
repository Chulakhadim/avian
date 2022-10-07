import { FC, useEffect } from 'react'
import { Sidebar } from 'web-ui'
import { useGlobal, waitUntil } from 'web-utils'
import { globalToko } from '../base/global/toko'
import { AvianTokoSearchForm } from './AvianTokoSearchForm'
import { IconFilter } from './top-icons'

export const AvianTokoSearch: FC = ({}) => {
  const meta = useGlobal(globalToko)

  const filterCount = Object.values(meta.filter.data).filter((e) => {
    if (!e) return false
    if (typeof e === 'object' && Object.keys(e).length === 0) return false
    return true
  }).length

  const kategori = Object.values(meta.filter.data.kategori)
  const produk = Object.values(meta.filter.data.produk)
  const lokasi = Object.values(meta.filter.data.lokasi)
  const toko = Object.values(meta.filter.data.toko)

  useEffect(() => {
    if (!!params.pid) {
      const filter = meta.filter.data as any
      for (let i of Object.keys(filter)) {
        ;(meta.filter.data as any)[i] = {}
      }

      const store_id = params.tid ? params.tid : params.pid
      db.mst_store
        .findFirst({
          where: {
            store_id,
          },
        })
        .then(async (e) => {
          if (e) {
            for (let k of Object.keys(meta.filter.data.toko)) {
              delete meta.filter.data.toko[k]
            }
            meta.filter.data.toko[e.id] = e

            await waitUntil(() => meta.map.bounds)
            await meta.map.redrawMarker(true, true)

            await waitUntil(() => meta.map.flatted.length > 0)
            for (let i of meta.map.flatted) {
              if (parseInt(i.id) === parseInt(e.id + '')) {
                meta.selected = {
                  id: i.id,
                  lat: parseFloat(e.lattitude as any),
                  lng: parseFloat(e.longitude as any),
                }
                meta.render()
              }
            }
          }
        })

      if (params.tid) {
        db.dtb_product
          .findFirst({
            where: {
              id: Number(params.pid),
            },
          })
          .then((e) => {
            if (e) meta.filter.data.produk[e.id as any] = e
            meta.map.redrawMarker(true, true)
          })
      }
    }
  }, [])

  return (
    <>
      <div
        className="absolute z-10 inset-0 bottom-auto flex bg-opacity-50 bg-white-100 flex-wrap p-1 pt-2"
        css={css`
          &::before {
            filter: blur(10px) saturate(2);
          }
        `}
      >
        <>
          <div
            className={`bg-white flex items-center btn-fade rounded ml-1 py-1 mb-1 self-center text-sm pl-2 pr-2 shadow border border-gray-400 btn-fade`}
            onClick={() => {
              meta.filter.open = true
              meta.render()
            }}
          >
            {filterCount > 0 ? (
              <div
                className={`bg-green-600 text-white rounded mr-1 p-0 self-center px-1`}
                css={css`
                  line-height: 17px;
                `}
              >
                {filterCount}
              </div>
            ) : (
              <div className="mr-1 rotate-90">
                <IconFilter />
              </div>
            )}
            Filter
          </div>

          {kategori && kategori.length > 0 && (
            <div
              onClick={() => {
                meta.filter.open = true
                meta.render()
              }}
              className="bg-white flex items-center btn-fade rounded ml-1 py-1 mb-1 self-center text-sm shadow-md pl-2 pr-1"
            >
              {kategori.length > 1
                ? 'Multi Kategori'
                : (kategori[0] as any).name}
              {kategori.length > 1 ? (
                <span
                  className="ml-1 bg-green-200 rounded"
                  css={css`
                    padding: 0px 7px 0px 5px;
                  `}
                >
                  {kategori.length}
                </span>
              ) : (
                <div className="pl-1"></div>
              )}
            </div>
          )}

          {produk && produk.length > 0 && (
            <div
              onClick={() => {
                meta.filter.open = true
                meta.render()
              }}
              className="bg-white flex items-center btn-fade rounded ml-1 py-1 mb-1 self-center text-sm shadow-md pl-2 pr-1"
            >
              {produk.length > 1 ? 'Multi Produk' : (produk[0] as any).name}
              {produk.length > 1 ? (
                <span
                  className="ml-1 bg-green-200 rounded"
                  css={css`
                    padding: 0px 7px 0px 5px;
                  `}
                >
                  {produk.length}
                </span>
              ) : (
                <div className="pl-1"></div>
              )}
            </div>
          )}

          {lokasi && lokasi.length > 0 && (
            <div
              onClick={() => {
                meta.filter.open = true
                meta.render()
              }}
              className="bg-white flex items-center btn-fade rounded ml-1 py-1 mb-1 self-center text-sm shadow-md pl-2 pr-1"
            >
              {lokasi.length > 1 ? 'Multi Lokasi' : (lokasi[0] as any).name}
              {lokasi.length > 1 ? (
                <span
                  className="ml-1 bg-green-200 rounded"
                  css={css`
                    padding: 0px 7px 0px 5px;
                  `}
                >
                  {lokasi.length}
                </span>
              ) : (
                <div className="pl-1"></div>
              )}
            </div>
          )}

          {toko && toko.length > 0 && (
            <div
              onClick={() => {
                meta.filter.open = true
                meta.render()
              }}
              className="bg-white flex items-center btn-fade rounded ml-1 py-1 mb-1 self-center text-sm shadow-md pl-2 pr-1"
            >
              {toko.length > 1 ? 'Multi Toko' : (toko[0] as any).name}
              {toko.length > 1 ? (
                <span
                  className="ml-1 bg-green-200 rounded"
                  css={css`
                    padding: 0px 7px 0px 5px;
                  `}
                >
                  {toko.length}
                </span>
              ) : (
                <div className="pl-1"></div>
              )}
            </div>
          )}
        </>
      </div>
      <Sidebar
        show={meta.filter.open}
        onClose={() => {
          meta.filter.open = false
          meta.render()
        }}
        className="w-4/5 bg-white"
      >
        {meta.filter.open && <AvianTokoSearchForm />}
      </Sidebar>
    </>
  )
}
