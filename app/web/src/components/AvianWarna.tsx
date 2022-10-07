import { Modal } from 'web-ui'
import { useGlobal } from 'web-utils'
import { globalWarna } from '../base/global/warna'
import { CloseIcon, IconCodeLoad } from './top-icons'
import { WebStore } from './utils'

export const AvianWarna = () => {
  const meta = useGlobal(globalWarna, async () => {
    const getColorInspiration = async () => {
      meta.colorInspiration = await db.mst_color_inspiration.findMany({
        orderBy: {
          order: 'asc',
        },
      })
      meta.loadingInspiration = false
      meta.render()
    }

    const getColorFavourite = async () => {
      const itemsStr = await WebStore.get('color-favorite')
      const items = JSON.parse(itemsStr || '[]')
      meta.favouriteColor = items
      meta.render()
    }

    if (meta.loadingInspiration) {
      getColorInspiration().then(() => {
        getPallete(meta.colorInspiration[0].id)
      })
    }
    getColorFavourite()
  })

  const pSize = (window.innerWidth - 40) / 6

  const getPallete = async (id: number) => {
    meta.selectedInspiration = id
    meta.tabListColor = 'all'
    meta.loadingPallete = true
    meta.render()

    const res888 = await db.mst_pallete_color.findMany({
      where: {
        id_color_inspiration: id,
        type: '888',
      },
      orderBy: {
        id: 'asc',
      },
    })

    const res170 = await db.mst_pallete_color.findMany({
      where: {
        id_color_inspiration: id,
        type: '170',
      },
      orderBy: {
        id: 'asc',
      },
    })

    const colors = [...res888, ...res170]
    meta.palleteColor = colors
    meta.loadingPallete = false
    meta.render()
  }

  return (
    <>
      <div
        className={`flex flex-1 flex-col h-full overflow-auto pb-12`}
        ref={(e) => {
          if (e) {
            e.scrollTop = meta.scrollTop
          }
        }}
        onScroll={(e: any) => {
          meta.scrollTop = e.target.scrollTop
        }}
      >
        <div
          className={`flex self-stretch flex-col items-start justify-start p-5 space-y-5`}
        >
          <div
            className={`flex self-stretch justify-center text-lg font-bold leading-relaxed text-green-900`}
          >
            Pilih Inspirasi Warna
          </div>
          <div className={`flex self-stretch justify-between p-1 items-center`}>
            {meta.loadingInspiration ? (
              <>
                <IconCodeLoad />
              </>
            ) : (
              <>
                {meta.colorInspiration.map((item, i) => (
                  <div
                    key={i}
                    className={`btn-fade bg-black rounded-full`}
                    css={css`
                      width: 40px;
                      min-width: 40px;
                      max-width: 40px;
                      height: 40px;
                      min-height: 40px;
                      max-height: 40px;
                      background: ${item.hex};
                      ${item.id === meta.selectedInspiration &&
                      `min-width: 60px; min-height: 60px;`}
                    `}
                    onClick={() => getPallete(item.id)}
                  />
                ))}
              </>
            )}
          </div>
          <div
            className={`flex self-stretch items-center justify-start bg-white shadow rounded overflow-hidden`}
          >
            <div
              className={`flex flex-1 items-start justify-center p-2 bg-white rounded btn-fade text-sm leading-tight text-trueGray-500 ${
                meta.tabListColor === 'all' && 'avian-green3'
              }`}
              onClick={() => {
                meta.tabListColor = 'all'
                meta.render()
              }}
            >
              Semua Warna
            </div>
            <div
              className={`flex flex-1 items-start justify-center p-2 bg-white rounded btn-fade text-sm leading-tight text-trueGray-500 ${
                meta.tabListColor === 'favourite' && 'avian-green3'
              }`}
              onClick={() => {
                meta.tabListColor = 'favourite'
                meta.render()
              }}
            >
              Warna Favorit Saya
            </div>
          </div>
          <div className="flex self-stretch flex-col items-start justify-start">
            {meta.loadingPallete ? (
              <>
                <IconCodeLoad />
                <IconCodeLoad />
              </>
            ) : (
              <>
                {meta.tabListColor === 'all' && (
                  <div
                    className={`flex self-stretch items-start justify-start flex-wrap`}
                  >
                    {meta.palleteColor.map((item, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-start justify-start p-0.5`}
                        css={css`
                          width: ${pSize}px;
                          height: ${pSize}px;
                        `}
                      >
                        <a
                          className={`bg-warmGray-200 w-full h-full`}
                          css={css`
                            background: ${item.hex};
                          `}
                          href={`/warna/preview/${item.id}/true`}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {meta.tabListColor === 'favourite' && (
                  <div
                    className={`flex self-stretch items-start justify-start flex-wrap`}
                  >
                    {meta.favouriteColor.map((item, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-start justify-start p-0.5`}
                        css={css`
                          width: ${pSize}px;
                          height: ${pSize}px;
                        `}
                      >
                        <a
                          className={`bg-warmGray-200 w-full h-full`}
                          css={css`
                            background: ${item.hex};
                          `}
                          href={`/warna/preview/${item.id}/true`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        show={meta.modal}
        onClose={() => {
          meta.modal = false
          meta.render()
        }}
      >
        <div className={`flex bg-white shadow rounded-lg p-6 w-4/5 relative`}>
          <button
            onClick={() => {
              meta.modal = false
              meta.render()
            }}
            className="border-none outline-none cursor-pointer group py-1 px-2 absolute top-0 right-1"
          >
            <>
              <CloseIcon/>
            </>
          </button>
          <div className="flex self-stretch flex-col items-center justify-center overflow-y-auto mt-3">
            <div className="text-red-500 text-lg font-semibold">
              Akurasi Warna
            </div>

            <div className="flex flex-col items-start justify-start p-5 bg-white rounded">
              <div className="flex flex-col space-y-6 items-center justify-start bg-white rounded-tl rounded-tr">
                <div className="flex flex-col space-y-1 items-center justify-start mt-4">
                  <div className="text-xs text-gray-800 break-normal text-center leading-normal">
                    Warna-warna digital pada layar ini dibuat mendekati kartu
                    warna sesungguhnya. Perbedaan warna mungkin terjadi
                    dikarenakan perbedaan dan pengaturan resolusi layar, maka
                    warna yang Anda lihat tidak dapat menjadi acuan utama. Untuk
                    referensi warna sebenarnya gunakan Kartu Warna yang tersedia
                    di toko.
                  </div>
                </div>
                <div
                  className="flex self-stretch items-center justify-center p-2 bg-white shadow border border-green-700 rounded text-xs leading-none text-green-700 btn-fade"
                  onClick={() => {
                    meta.modal = false
                    meta.render()
                  }}
                >
                  OK
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
