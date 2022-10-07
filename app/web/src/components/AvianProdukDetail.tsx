import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useGlobal } from 'web-utils'
import { globalProduk } from '../base/global/produk'
import { AvianProdukBeli } from './AvianProdukBeli'
import { AvianProdukDetailAction } from './AvianProdukDetailAction'
import { IconCodeLoad } from './top-icons'
import { urlMedia } from './utils'

export const AvianProdukDetail = () => {
  const meta = useGlobal(globalProduk, async () => {
    if (!params.tid) {
      return
    }
    meta.detailLoading = true
    meta.render()
    const product = await db.dtb_product.findFirst({
      where: {
        id: Number(params.tid),
      },
      include: {
        mst_product_selling_point: true,
      },
    })
    if (product) {
      const sellingPoint =
        await db.query(`SELECT mst_product_selling_point.id_product, mst_selling_point.name, mst_selling_point.icon_url 
      FROM mst_selling_point 
      JOIN mst_product_selling_point ON (mst_product_selling_point.id_selling_point = mst_selling_point.id)
      WHERE mst_product_selling_point.id_product = ${product.id}`)
      const categoryProduct =
        await db.query(`SELECT mst_category.name as category_name FROM mst_category
      WHERE mst_category.id = ${product.id_category}`)
      meta.detail = {
        ...product,
        selling: sellingPoint,
        category_name: categoryProduct[0]?.category_name,
      }

      const getYoutubeID = (url: string) => {
        if (url) {
          const urlsplit = url.split(
            /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/
          )
          return urlsplit[3]
        }

        return null
      }

      let youtubeID = getYoutubeID(meta.detail.tv_ads_url)
      if (!youtubeID) youtubeID = getYoutubeID(meta.detail.video_url)
      let document: any[] = []

      if (!!meta.detail.msds_url) {
        document.push({
          name: `MSDS ${meta.detail.name}`,
          url: meta.detail.msds_url,
        })
      }

      if (!!meta.detail.tds_url) {
        document.push({
          name: `TDS ${meta.detail.name}`,
          url: meta.detail.tds_url,
        })
      }

      const petunjuk_pembuangan = {
        solvent_based:
          'Jangan dibiarkan masuk ke saluran pembuangan atau aliran air. Bila dilakukan pembakaran, maka harus dilakukan kontrol. Bahan dan/atau wadah bekas harus dibuang sebagai limbah berbahaya. Wadah bekas pakai bisa digunakan kembali bila telah selesai dibersihkan. Jika bahan dan/atau wadah dibuang tercampur bersama dengan limbah yang lain, maka aturan ini tidak berlaku lagi, harus diberi kode yang sesuai. Untuk informasi yang lebih jelas dan benar mengenai aturan cara pembuangan limbahnya, maka harus menghubungi badan yang memiliki otoritas penanganan limbah di daerah masing-masing.',
        solvent_based_en:
          'Do not let it enter to water reservoir or water flow. Burning activities must be under surveillance. Ex-used material and / or container must be disposed as hazardous toxic. Reusable container is reusable after their cleaning process. Any mixed material and / or container with other waste shall invalid these rules. Mark with appropriate code. For more clear and accurate information on waste disposal method, contact the local authorized waste management agencies.',
        water_based:
          'Pembuangan limbah sesuai dengan peraturan setempat. Insinerasi yang terkontrol di rekomendasikan. Wadah yang terkontaminasi dapat digunakan kembali setelah dibersihkan.',
        water_based_en:
          'Waste disposal shall subject to the local regulation. Controlled incineration is recommended. Contaminated container is reusable following its cleaning. ',
      }
      let tentang_produk = [
        {
          title: 'Pengencer',
          value: (meta.detail.pengencer?.pengencer || []).join(', '),
        },
        {
          title: 'Hasil Akhir',
          value: meta.detail.end_result || '',
        },
        {
          title: 'Daya Sebar',
          value: !!meta.detail.min_spread
            ? `${meta.detail.min_spread} ${meta.detail.spread_unit?.replace(
                'm2',
                'm<sup>2</sup>'
              )}`
            : '',
        },
        {
          title: 'Waktu Pengeringan',
          value: meta.detail.dry_time || '',
        },
        {
          title: 'Jumlah Lapisan Cat',
          value: !!meta.detail.layers_max
            ? `${meta.detail.layers_max} ${meta.detail.layers_unit}`
            : '',
        },
      ]
      meta.detail = {
        ...meta.detail,
        youtubeID: 'https://www.youtube.com/embed/' + youtubeID,
        document,
        petunjuk_pembuangan,
        tentang_produk,
      }
    }

    meta.detailLoading = false
    meta.render()
  })

  return (
    <div className="flex flex-col items-stretch flex-1">
      {meta.detailLoading ? (
        <div className="flex flex-col space-y-10 flex-1 items-center justify-center">
          <img
            src={'/imgs/product-not-found.svg'}
            css={css`
              opacity: 0.3;
              width: 200px;
              min-width: 200px;
              max-width: 200px;
              height: 200px;
              min-height: 200px;
              max-height: 200px;
              background-size: 100% 100%;
              background-repeat: no-repeat;
            `}
          />
          <IconCodeLoad />
          <IconCodeLoad />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {!!meta.detail.image_url ? (
            <LazyLoadImage
              src={
                meta.detail._imgerror
                  ? '/imgs/product-not-found.svg'
                  : urlMedia(meta.detail.image_url)
              }
              css={css`
                opacity: ${meta.detail._imgerror ? 0.3 : 1};

                width: 200px;
                min-width: 200px;
                max-width: 200px;
                height: 200px;
                min-height: 200px;
                max-height: 200px;
                background-size: 100% 100%;
                background-repeat: no-repeat;
              `}
              onError={(e: any) => {
                meta.detail._imgerror = true
                meta.render()
              }}
            />
          ) : <div className='py-2'></div>}
          <div className="flex self-stretch flex-col space-y-4 items-start justify-start">
            <div className="flex flex-col space-y-4  px-4">
              <div className="flex self-stretch flex-col items-start justify-start">
                <div className="inline-flex space-y-2 flex-col items-start justify-start w-80">
                  <p className="text-xs font-bold leading-none text-gray-500">
                    {meta.detail.category_name}
                  </p>
                  <p className="text-base font-bold leading-normal text-gray-800">
                    {meta.detail.name}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm leading-normal text-gray-800`}
                dangerouslySetInnerHTML={{
                  __html: !!meta.detail.description
                    ? meta.detail.description
                    : '-',
                }}
              />
              {!!meta.detail.is_beli && <AvianProdukBeli />}
            </div>
            {/** Keunggulan */}
            <div
              className="flex flex-1 self-stretch flex-col space-y-1 items-start justify-center p-4 bg-trueGray-200"
              css={css`
                background-color: #dfe6df;
              `}
            >
              <div className="text-sm font-bold leading-none text-gray-900 mt-4">
                Keunggulan Produk
              </div>
              {!meta.detail.layout ? (
                <div className="grid grid-cols-3 p-2.5">
                  {Array.isArray(meta.detail.selling) &&
                    meta.detail.selling.map((item: any, index: number) => (
                      <div className="pb-4" key={index}>
                        <div className="flex flex-col items-center">
                          <div className="w-20">
                            <LazyLoadImage
                              className="w-full"
                              src={urlMedia(encodeURI(item.icon_url))}
                            />
                          </div>
                          <div className="text-sm font-normal text-center">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-stretch justify-start pt-2">
                  {Array.isArray(meta.detail.selling) &&
                    meta.detail.selling.map((item: any, index: number) => (
                      <div className="" key={index}>
                        <div className="text-sm font-normal">{item.name}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <AvianProdukDetailAction />
            {/** Kemasan */}
            <div className="flex self-stretch flex-col space-y-3 items-start justify-start px-4 py-2.5">
              <div className="text-sm font-bold leading-none text-gray-800">
                Kemasan
              </div>
              <div className="text-sm leading-none text-gray-800">
                Ukuran yang tersedia
              </div>
              <div className="flex flex-wrap space-x-2.5 items-start justify-start">
                {!!meta.detail.packaging &&
                  meta.detail.packaging.packaging
                    .slice()
                    .sort((a: any, b: any) => a + b)
                    .map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-center mt-1 px-5 py-1.5 bg-white border border-warmGray-300"
                      >
                        <div className="text-sm font-medium leading-none text-gray-800">
                          {item} {meta.detail.packaging_unit}
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/**Tentang */}
            <div className="flex self-stretch flex-col space-y-1 items-start justify-start px-4 py-2.5">
              <div className="text-sm font-bold leading-none text-gray-800 pb-2">
                Tentang Produk
              </div>
              {!!meta.detail.tentang_produk &&
                meta.detail.tentang_produk[0]?.value && (
                  <div className="inline-flex items-start justify-start w-72">
                    <div className="flex space-x-4 items-start justify-start w-48 p-1">
                      <img src="/imgs/icon-pengencer.svg" />
                      <div className="text-sm font-medium leading-none text-gray-800">
                        Pengencer
                      </div>
                    </div>
                    <div className="inline-flex flex-col items-start justify-start flex-1 h-full p-1">
                      <p
                        className="w-full flex-1 text-sm font-medium leading-none text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: !!meta.detail.tentang_produk
                            ? meta.detail.tentang_produk[0].value
                            : '-',
                        }}
                      />
                    </div>
                  </div>
                )}
              {!!meta.detail.tentang_produk &&
                !!meta.detail.tentang_produk[1].value.end_result &&
                meta.detail.tentang_produk[1].value.end_result[0] && (
                  <div className="inline-flex items-start justify-start w-72">
                    <div className="flex space-x-4 items-start justify-start w-48 p-1">
                      <img src="/imgs/icon-hasilakhir.svg" />
                      <div className="text-sm font-medium leading-none text-gray-800">
                        Hasil Akhir
                      </div>
                    </div>
                    <div className="inline-flex flex-col items-start justify-start flex-1 h-full p-1">
                      <p
                        className="w-full flex-1 text-sm font-medium leading-none text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: !!meta.detail.tentang_produk
                            ? !!meta.detail.tentang_produk[1].value.end_result
                              ? meta.detail.tentang_produk[1].value
                                  .end_result[0]
                              : '-'
                            : '-',
                        }}
                      />
                    </div>
                  </div>
                )}
              {!!meta.detail.tentang_produk &&
                meta.detail.tentang_produk[2].value && (
                  <div className="inline-flex items-start justify-start w-100">
                    <div className="flex space-x-4 items-start justify-start w-48 p-1">
                      <img src="/imgs/icon-dayasebar.svg" />
                      <div className="text-sm font-medium leading-none text-gray-800">
                        Daya Sebar
                      </div>
                    </div>
                    <div className="inline-flex flex-col items-start justify-start flex-1 h-full p-1">
                      <p
                        className="w-full flex-1 text-sm font-medium leading-none text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: !!meta.detail.tentang_produk
                            ? meta.detail.tentang_produk[2].value
                            : '-',
                        }}
                      />
                    </div>
                  </div>
                )}
              {!!meta.detail.tentang_produk &&
                meta.detail.tentang_produk[3].value && (
                  <div className="inline-flex items-start justify-start w-100">
                    <div className="flex space-x-4 items-start justify-start w-48 p-1">
                      <img src="/imgs/icon-waktu.svg" />
                      <div className="text-sm font-medium leading-none text-gray-800">
                        Waktu Pengeringan
                      </div>
                    </div>
                    <div className="inline-flex flex-col items-start justify-start flex-1 h-full p-1">
                      <div
                        className="w-full flex-1 text-sm font-medium leading-none text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: !!meta.detail.tentang_produk
                            ? meta.detail.tentang_produk[3].value
                            : '-',
                        }}
                      />
                    </div>
                  </div>
                )}
              {!!meta.detail.tentang_produk &&
                meta.detail.tentang_produk[4].value && (
                  <div className="inline-flex items-start justify-start w-100">
                    <div className="flex space-x-4 items-start justify-start w-48 p-1">
                      <img src="/imgs/icon-cat.svg" />
                      <div className="text-sm font-medium leading-none text-gray-800">
                        Jumlah Lapisan Cat
                      </div>
                    </div>
                    <div className="inline-flex flex-col items-start justify-start flex-1 h-full p-1">
                      <div
                        className="w-full flex-1 text-sm font-medium leading-none text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: !!meta.detail.tentang_produk
                            ? meta.detail.tentang_produk[4].value
                            : '-',
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>

            {/** Youtube */}
            {meta.detail.youtubeID !== 'https://www.youtube.com/embed/null' && (
              <div className="flex self-stretch flex-col space-y-1 items-start justify-start p-4">
                <div className="text-sm font-bold leading-none text-gray-800 pb-4">
                  Video Produk
                </div>

                <iframe
                  width="100%"
                  height="100%"
                  src={meta.detail.youtubeID}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
              </div>
            )}

            {/** Petunjuk Pembuangan */}
            <div className="flex self-stretch flex-col space-y-2.5 items-start justify-start px-4 py-2.5">
              <div className="bg-warmGray-300" />
              <div className="flex self-stretch space-x-1 items-start justify-start">
                <div className="text-sm font-bold leading-none text-gray-800 pb-2">
                  Petunjuk Pembuangan Produk
                </div>
                <div />
              </div>
              <div className="text-sm font-bold leading-none">
                Solvent Based
              </div>
              <div className="text-sm leading-normal text-gray-800">
                {!!meta.detail.petunjuk_pembuangan
                  ? meta.detail.petunjuk_pembuangan.solvent_based
                  : ''}
              </div>
              <div className="text-sm font-bold leading-none">Water Based</div>
              <div className="text-sm leading-normal text-gray-800">
                {!!meta.detail.petunjuk_pembuangan
                  ? meta.detail.petunjuk_pembuangan.water_based
                  : ''}
              </div>
            </div>

            {/** Dokumen */}

            {Array.isArray(meta.detail.document) &&
              meta.detail.document.length > 0 && (
                <div className="flex self-stretch flex-col space-y-2.5 items-start justify-start px-4 py-2.5">
                  <div className="text-sm font-bold leading-none text-gray-800">
                    Dokumen
                  </div>
                  {Array.isArray(meta.detail.document) &&
                    meta.detail.document.map((item: any, idx: number) => (
                      <div
                        className="flex self-stretch items-center pr-0 justify-start border border-warmGray-300"
                        key={idx}
                      >
                        <div className="flex flex-1 space-x-1 items-center justify-start px-2.5 py-1.5">
                          <img src="/imgs/icon-paper.svg" />
                          <div className="text-sm font-medium leading-tight text-trueGray-500">
                            {item.name}
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            window.open(
                              `https://avianbrands.com${item.url}`,
                              '_blank'
                            )
                          }}
                          className="flex space-x-1 items-center justify-center px-2.5 py-1.5 bg-white shadow border border-emerald-700"
                        >
                          <img src="/imgs/icon-down.svg" />
                          <div className="text-sm font-medium leading-none text-emerald-700">
                            Unduh File
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            <div
              className=""
              css={css`
                height: 100px;
              `}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
