import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGlobal } from 'web-utils'
import { globalAboutUs } from '../base/global/aboutus'
import { Submenu } from './AvianAboutPT'
import { IconCodeLoad } from './top-icons'

export const AvianAboutStore = () => {
  const meta = useGlobal(globalAboutUs, async () => {
    if (!meta.SRT.loading) return
    const post = await db.post.findFirst({
      where: { type: 'aboutus', title: 'Avian Brands Store' },
    })
    meta.SRT.data = post?.content
    meta.SRT.loading = false
    meta.render()
  })

  const linkContent = [
    { title: 'Tentang Kami', hash: '#tentang-kami' },
    { title: 'Layanan Kami', hash: '#layanan-kami' },
    { title: 'Mengapa Harus Kami?', hash: '#mengapa-kami' },
    { title: 'Proyek Kami', hash: '#proyek-kami' },
    { title: 'Komentar Pelanggan', hash: '#komentar' },
    { title: 'Informasi Kontak', hash: '#kontak' },
  ]

  const subScroll = (id: any) =>
    document
      .querySelector(id)
      .scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (meta.SRT.loading)
    return (
      <div className="p-4">
        <IconCodeLoad />
        <IconCodeLoad />
        <IconCodeLoad />
      </div>
    )

  return (
    <div className="bg-gray-200 flex flex-col flex-1">
      <img
        className="w-full"
        src="/images/tentang_kami_brand_store_header.png"
        alt="about-avian-store"
      />

      <Submenu data={linkContent} subScroll={subScroll} />

      <div
        className="p-2.5 bg-gray-50"
        id="tentang-kami"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">Tentang Kami</div>
        <div className="flex flex-col text-center gap-4">
          <div dangerouslySetInnerHTML={{ __html: meta.SRT.data.about.desc }} />
        </div>
      </div>

      {/* <div
        className="bg-gray-50"
        id="layanan-kami"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">Layanan Kami</div>
        <div className="p-2.5">
          <img
            src={meta.SRT.data.layanan_kami.drawable}
            alt="avian-layanan-kami"
          />

          <div className="flex flex-col gap-6 mb-8">
            <div>
              <div className="text-avian-green1 font-bold">
                {meta.SRT.data.layanan_kami.staff.title}
              </div>
              <div>{meta.SRT.data.layanan_kami.staff.desc}</div>
            </div>
            <div>
              <div className="text-avian-green1 font-bold">
                {meta.SRT.data.layanan_kami.ketersediaan.title}
              </div>
              <div>{meta.SRT.data.layanan_kami.ketersediaan.desc}</div>
            </div>
            <div>
              <div className="text-avian-green1 font-bold">
                {meta.SRT.data.layanan_kami.tukang.title}
              </div>
              <div>{meta.SRT.data.layanan_kami.tukang.desc}</div>
            </div>
          </div>
        </div>
        <iframe
          className="w-full"
          height="200"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
          src={meta.SRT.data.layanan_kami.video_url}
        ></iframe>
      </div> */}

      <div
        className="p-2.5"
        id="mengapa-kami"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">
          Mengapa Harus Kami?
        </div>
        {/* 01 */}
        <div className="bg-white m-2.5 p-2.5">
          <div className="text-gray-200 text-xl">01</div>

          <div className="text-lg text-avian-green1 mb-6 font-bold">
            {
              meta.SRT.data.mengapa_harus_kami.list
                .didukum_penuh_oleh_avian_brands.title
            }
          </div>
          {meta.SRT.data.mengapa_harus_kami.list.didukum_penuh_oleh_avian_brands.list.map(
            (item: any, idx: number) => (
              <div className="my-6" key={idx}>
                <div className="text-avian-green1 font-bold">{item.title}</div>
                <div>{item.desc}</div>
              </div>
            )
          )}
        </div>
        {/* 02 */}
        <div className="bg-white m-2.5 p-2.5">
          <div className="text-gray-200 text-xl">02</div>
          <div className="text-lg text-avian-green1 mb-6 font-bold">
            {
              meta.SRT.data.mengapa_harus_kami.list
                .lokasi_toko_home_care_dekat_dengan_anda.title
            }
          </div>
          <div>
            {
              meta.SRT.data.mengapa_harus_kami.list
                .lokasi_toko_home_care_dekat_dengan_anda.desc_top
            }
          </div>
          <img
            src={
              meta.SRT.data.mengapa_harus_kami.list
                .lokasi_toko_home_care_dekat_dengan_anda.drawable
            }
            alt="peta cabang home care avian"
          />
          <div className="mt-4">
            {meta.SRT.data.mengapa_harus_kami.list.lokasi_toko_home_care_dekat_dengan_anda.location.map(
              (data: any, idx: number) => {
                return (
                  <div className="py-2 flex items-center gap-2" key={idx}>
                    <div
                      css={css`
                        background: ${data.hex};
                      `}
                      className="p-1 rounded-full w-3 h-3"
                    ></div>
                    <div className="text-md font-normal	">
                      {data.code} - {data.name}
                    </div>
                  </div>
                )
              }
            )}
          </div>
          <div className="py-6">
            {
              meta.SRT.data.mengapa_harus_kami.list
                .lokasi_toko_home_care_dekat_dengan_anda.desc_bottom
            }
          </div>
        </div>
        {/* 03 */}
        <div className="bg-white m-2.5 p-2.5">
          <div className="text-gray-200 text-xl">03</div>
          <div className="text-lg text-avian-green1 mb-6 font-bold">
            {
              meta.SRT.data.mengapa_harus_kami.list
                .tukang_home_care_beda_dengan_tukang_biasa.title
            }
          </div>
          {meta.SRT.data.mengapa_harus_kami.list.tukang_home_care_beda_dengan_tukang_biasa.list.map(
            (item: any, idx: number) => (
              <div className="mb-6" key={idx}>
                <div className="text-avian-green1 font-bold">{item.title}</div>
                <div>{item.desc}</div>
              </div>
            )
          )}
        </div>
        {/* 04 */}
        <div className="bg-white m-2.5 p-2.5">
          <div className="text-gray-200 text-xl">04</div>
          <div className="text-lg text-avian-green1 font-bold">
            {meta.SRT.data.mengapa_harus_kami.list.bebas_pilih_warna.title}
          </div>
          <div className="ml-24 my-6">
            <div className="text-lg text-indigo-900">1 harga untuk</div>
            <div className="flex text-indigo-900">
              <div className="text-6xl mr-2">90</div>
              <div className="text-2xl text-left w-32">Warna Khusus</div>
            </div>
          </div>
          <div>
            {meta.SRT.data.mengapa_harus_kami.list.bebas_pilih_warna.desc}
          </div>
          <img
            src={
              meta.SRT.data.mengapa_harus_kami.list.bebas_pilih_warna.drawable
            }
            alt="kartu warna"
          />
        </div>
        {/* 05 */}
        <div className="bg-white m-2.5 p-2.5">
          <div className="text-gray-200 text-xl">05</div>
          <div className="text-lg text-avian-green1 font-bold">
            {meta.SRT.data.mengapa_harus_kami.list.harga_terjangkau.title}
          </div>
          <div className="my-6">
            {meta.SRT.data.mengapa_harus_kami.list.harga_terjangkau.desc}
          </div>
          {meta.SRT.data.mengapa_harus_kami.list.harga_terjangkau.price.map(
            (item: any, idx: number) => (
              <div key={idx} className="my-4 bg-white filter drop-shadow-md">
                <div className="bg-gray-100 font-bold text-center py-2">
                  {item.title}
                </div>
                {item.list.map((item: any, idx: number) => (
                  <div key={idx} className="py-6">
                    <div className="text-center">{item.name}</div>
                    <div className="text-center text-3xl text-green-900">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      <div
        className="text-white p-2.5"
        id="proyek-kami"
        css={css`
          background: url(/images/bg-section.x-proyek-kami.png);
          background-size: cover;
          background-position: 100%;
          scroll-margin: 60px;
        `}
      >
        <div id="proyek-kami" className="text-center font-bold py-10 text-lg">
          Proyek Kami
        </div>
        <div className="flex flex-col gap-6">
          {meta.SRT.data.proyek_kami.list.map((project: any, idx: number) => (
            <div key={idx}>
              <LazyLoadImage
                className="w-6 h-6"
                src={project.drawable}
                alt={project.title}
              />
              <div className="my-2.5">{project.title}</div>
              <div>{project.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        id="komentar"
        className="px-2.5"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-10 text-lg">
          Komentar Pelanggan
        </div>
        <div>
          <Swiper pagination slidesPerView={1.4} spaceBetween={5}>
            {meta.SRT.data.komentar_pelanggan.list.map(
              (comment: any, idx: number) => (
                <SwiperSlide className="h-56" key={idx}>
                  <div className="bg-white px-2.5 py-4">
                    <div className="flex flex-col justify-between max-h-40 h-40">
                      <LazyLoadImage
                        className="w-8"
                        src="/icons/icon_testimoni_home_care.png"
                        alt="testimoni"
                      />
                      <div>"{comment.comment}"</div>
                      <div>
                        {comment.name}, {comment.location}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </div>

      <div
        className="bg-white p-2.5 mt-10"
        id="kontak"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-10 text-lg">
          Informasi Kontak
        </div>
        <div className="w-full flex flex-col flex-wrap pb-5 lg:mx-auto">
          {meta.SRT.data.informasi_kontak.map((data: any, idx: number) => {
            return (
              <div key={idx} className="flex flex-col p-5 w-full border-b">
                <div className="font-medium text-green-900">{data.code}</div>
                <div className="font-bold text-green-900">{data.name}</div>
                <div className="flex flex-col mt-5">
                  {data.contact.map((item: any, idxContact: number) => {
                    return (
                      <div
                        key={idxContact}
                        className="flex flex-row flex-wrap my-1"
                      >
                        <LazyLoadImage
                          src={item.icon}
                          className="w-4 h-4 mt-1"
                        />
                        <div className="ml-3">{item.text}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div
        css={css`
          margin-bottom: 60px;
        `}
      />
    </div>
  )
}
