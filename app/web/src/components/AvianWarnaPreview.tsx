import { useEffect } from 'react'
import { Modal } from 'web-ui'
import { useGlobal, useLocal } from 'web-utils'
import { globalWarna } from '../base/global/warna'
import { IconCodeLoad } from './top-icons'
import { lightOrDark, WebStore } from './utils'

type mst_pallete_color = {
  id: number
  id_color_inspiration: number
  name: string
  lab_code: string
  l: any
  a: any
  b: any
  rgb: string | null
  hex: string | null
  type: string
  status: string
  created_at: Date | null
  order: number | null
  kartu_warna: number | null
}

export const AvianWarnaPreview = () => {
  if (!params.id) {
    return <></>
  }

  const local = useLocal({
    warna: {} as mst_pallete_color | null,
    loading: true,
    isFavourit: false,
  })

  useEffect(() => {
    const getPreview = async () => {
      local.warna = await db.mst_pallete_color.findFirst({
        where: {
          id: Number(params.id),
        },
      })
      local.loading = false
      local.render()
    }

    const isFavorit = async () => {
      let status = false
      const itemsStr = await WebStore.get('color-favorite')
      const items = JSON.parse(itemsStr || '[]')
      let idx = items.findIndex(
        (x: mst_pallete_color) => x.id === local.warna?.id
      )
      if (idx > -1) {
        status = true
      }
      local.isFavourit = status
      local.render()
    }

    getPreview().then(() => {
      isFavorit()
    })
  }, [])

  return (
    <div
      className={`flex self-stretch flex-col items-start justify-start p-5 h-full`}
    >
      {local.loading ? (
        <>
          <IconCodeLoad />
          <IconCodeLoad />
        </>
      ) : (
        <div
          className={`flex flex-1 self-stretch flex-col space-y-5 items-start justify-start`}
        >
          <div
            className={`flex flex-1 self-stretch flex-col items-start justify-start bg-green-900`}
            css={css`
              background: ${local.warna?.hex};
            `}
          >
            <div className="flex self-stretch flex-col items-end justify-center p-2.5">
              <div
                className={`flex items-start justify-start p-1`}
                onClick={async () => {
                  const itemsStr = await WebStore.get('color-favorite')
                  const items = JSON.parse(itemsStr || '[]')
                  let idx = items.findIndex(
                    (x: mst_pallete_color) => x.id === local.warna?.id
                  )
                  if (idx > -1) {
                    items.splice(idx, 1)
                    local.isFavourit = false
                  } else {
                    items.push(local.warna)
                    local.isFavourit = true
                  }
                  WebStore.set('color-favorite', JSON.stringify(items))
                  local.render()
                }}
              >
                {!local.isFavourit ? (
                  <img
                    src="/imgs/994_272677.x1.svg"
                    className={`flex flex-col items-start justify-start`}
                    css={css`
                      width: 25px;
                      min-width: 25px;
                      max-width: 25px;
                      height: 25px;
                      min-height: 25px;
                      max-height: 25px;
                      ${lightOrDark(local.warna?.hex) === 'light' &&
                      'filter: invert(1);'}
                    `}
                  />
                ) : (
                  <img
                    src="/imgs/994_275435.x1.svg"
                    className={`flex flex-col items-start justify-start`}
                    css={css`
                      width: 25px;
                      min-width: 25px;
                      max-width: 25px;
                      height: 25px;
                      min-height: 25px;
                      max-height: 25px;
                      ${lightOrDark(local.warna?.hex) === 'light' &&
                      'filter: invert(1);'}
                    `}
                  />
                )}
              </div>
            </div>
            <div
              className={`flex flex-1 self-stretch flex-col space-y-1 items-start justify-end p-4`}
            >
              <div className={`flex self-stretch items-start justify-start`}>
                <div
                  className={`text-sm font-medium leading-tight text-white ${
                    lightOrDark(local.warna?.hex) === 'light' && 'text-gray-700'
                  }`}
                >
                  {local.warna?.name}
                </div>
              </div>
              <div className="flex self-stretch items-start justify-start">
                <div
                  className={`text-sm font-medium leading-tight text-white ${
                    lightOrDark(local.warna?.hex) === 'light' && 'text-gray-700'
                  }`}
                >
                  {local.warna?.lab_code}
                </div>
              </div>
            </div>
          </div>
          {params.temukanProduk === "true" && (
            <a
              href={`/warna/produk/${local.warna?.id}`}
              className="w-full text-sm px-4 py-2.5 bg-white border text-avian-green2 text-center rounded border-green-900 btn-fade"
            >
              Temukan produk dengan warna ini
            </a>
          )}
        </div>
      )}
    </div>
  )
}
