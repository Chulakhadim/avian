import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Modal } from 'web-ui'
import { useGlobal } from 'web-utils'
import { globalProdukWarna } from '../base/global/produk-warna'
import { CloseIcon, IconCodeLoad } from './top-icons'
import { urlMedia } from './utils'

export const AvianProdukWarna = () => {
  if (!params.id) return <></>

  const meta = useGlobal(globalProdukWarna, () => {
    if (params.id != meta.produk.id) {
      meta.loading = true
      meta.render()
      getProduct().then(() => {
        getColorInspiration().then(() => {
          getPallete(meta.colorInspiration[0].id).then(() => {
            meta.loading = false
            meta.render()
          })
        })
      })
    }
  })

  const getProduct = async () => {
    meta.produk = await db.dtb_product.findFirst({
      where: {
        id: Number(params.id),
      },
      include: {
        mst_product_selling_point: true,
      },
    })
  }

  const getColorInspiration = async () => {
    meta.colorInspiration = await db.mst_color_inspiration.findMany({
      orderBy: {
        order: 'asc',
      },
    })
  }

  const getPallete = async (id: number) => {
    meta.selectedInspiration = id
    meta.loadingPallete = true
    meta.render()

    let kartuWarna = {}
    if (meta.produk.name === 'Avitex One Coat') kartuWarna = { kartu_warna: 1 }

    const res888 = await db.mst_pallete_color.findMany({
      where: {
        id_color_inspiration: id,
        type: '888',
        ...kartuWarna,
      },
      orderBy: {
        id: 'asc',
      },
    })
    const res170 = await db.mst_pallete_color.findMany({
      where: {
        id_color_inspiration: id,
        type: '170',
        ...kartuWarna,
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

  const pSize = (window.innerWidth - 40) / 6

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
          {(!!meta.produk.ready_mix_url &&
          meta.produk.ready_mix_url.url.length > 0 &&
          !!meta.produk.ready_mix_url.url[0]) && (
            <>
              {/* add -> className="order-2 mt-5" */}
              <div className="order-2 w-full text-center">
                <div className="text-base font-bold text-green-900 mt-5 mb-2">
                  Ready Mix{' '}
                  {meta.produk.name}
                </div>
                {meta.loading ? (
                  <>
                    <IconCodeLoad />
                  </>
                ) : (
                  meta.produk.ready_mix_url?.url.length > 0 && (
                    <div
                      className={`inline-flex space-x-2.5 items-start justify-start p-2.5 overflow-y-hidden`}
                      onClick={() => {
                        meta.modalImage = true
                        meta.render()
                      }}
                    >
                      {meta.produk.ready_mix_url.url.map(
                        (item: any, i: any) => (
                          <LazyLoadImage
                            key={i}
                            className="w-1/4 h-full"
                            src={`${urlMedia(decodeURI(`${item}`))}`}
                          />
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            </>
          )}
          {(!!meta.produk.is_888 || !!meta.produk.is_170) && (
            <>
              <div className="flex order-1 w-full flex-col justify-center">
                <div
                  className={`flex self-stretch justify-center text-lg font-bold leading-relaxed text-green-900`}
                >
                  Pilih Inspirasi Warna
                </div>

                <div
                  className={`flex self-stretch justify-between p-1 items-center`}
                >
                  {meta.loading ? (
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
              </div>
              <div className="flex order-3 w-full flex-col justify-center">
                <div className="w-full text-lg font-bold leading-relaxed text-center text-green-900">
                  Warna Tinting
                </div>
                {meta.loadingPallete ? (
                  <>
                    <IconCodeLoad />
                    <IconCodeLoad />
                  </>
                ) : (
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
                          className={`btn-fade bg-warmGray-200 w-full h-full`}
                          css={css`
                            background: ${item.hex};
                          `}
                          href={`/warna/preview/${item.id}/false`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        show={meta.modalImage}
        onClose={() => {
          meta.modalImage = false
          meta.render()
        }}
      >
        <div className="flex flex-col items-center">
          <div className={`flex bg-white shadow w-full overflow-auto`}>
            {!!meta.produk.ready_mix_url &&
              meta.produk.ready_mix_url.url.map((item: any, i: any) => (
                <LazyLoadImage
                  key={i}
                  className="w-full h-450"
                  src={`${urlMedia(decodeURI(`${item}`))}`}
                />
              ))}
          </div>
          <div
            className="bg-white p-2 flex items-center px-5 btn-fade"
            onClick={() => {
              meta.modalImage = false
              meta.render()
            }}
          >
            Tutup
          </div>
        </div>
      </Modal>

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