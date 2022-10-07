import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGlobal } from 'web-utils'
import { globalAboutUs } from '../base/global/aboutus'
import { Submenu } from './AvianAboutPT'
import { IconCodeLoad } from './top-icons'

export const AvianAboutTirta = () => {
  const meta = useGlobal(globalAboutUs, async () => {
    if (!meta.TRT.loading) return
    const post = await db.post.findFirst({
      where: { type: 'aboutus', title: 'PT Tirtakencana Tatawarna' },
    })
    meta.TRT.data = (post?.content as any).data
    meta.TRT.data.personel.content = post?.content?.personel
    meta.TRT.loading = false
    meta.render()
  })

  const Personel = ({ data }: any) => (
    <>
      <LazyLoadImage src={data.img} className="w-full h-full" />
      <div className="box-jajaran cursor-pointer text-white absolute bottom-0 w-full p-1 bg-white  bg-opacity-0 transition duration-400">
        <strong className="flex items-center">
          <div
            className={`${
              data.title.length > 12 ? 'text-xs' : 'text-xs'
            } font-bold`}
            css={css`
              text-shadow: 2px 2px 2px #000;
            `}
          >
            {data.title}
          </div>
        </strong>

        <div
          className="text-xs"
          css={css`
            text-shadow: 2px 2px 2px #000;
          `}
        >
          {data.subtitle}
        </div>
      </div>
    </>
  )

  const linkContent = [
    { title: 'Tentang Kami', hash: '#tentang-tirta' },
    { title: 'Distribusi', hash: '#distribusi' },
    { title: 'Informasi Teknologi', hash: '#informasi-teknologi' },
    { title: 'Logistik', hash: '#logistik' },
    { title: 'Jajaran Direksi', hash: '#direksi' },
  ]

  const subScroll = (id: any) =>
    document
      .querySelector(id)
      .scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (meta.TRT.loading)
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
        css={css`
          height: 106px;
        `}
        src="/images/LogoTentangTKTW.png"
        alt="about-tirta"
      />
      <Submenu data={linkContent} subScroll={subScroll} />
      <div
        className="p-2.5 bg-white"
        id="tentang-tirta"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold text-lg py-6">
          Tentang PT Tirtakencana Tatawarna
        </div>
        <div className="flex flex-col gap-6">
          <div
            dangerouslySetInnerHTML={{
              __html: meta.TRT.data.tentang_kami.description,
            }}
          />
        </div>
      </div>

      <div
        className="p-2.5 bg-white filter drop-shadow-md"
        id="distribusi"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold text-lg py-6">Distribusi</div>
        <img src={meta.TRT.data.distribusi.drawable_top} alt="peta-tirta" />
        <div
          className="mt-12"
          dangerouslySetInnerHTML={{
            __html: meta.TRT.data.distribusi.description,
          }}
        />
      </div>

      <div className="p-2.5 flex flex-col gap-8">
        <div
          id="informasi-teknologi"
          css={css`
            scroll-margin: 60px;
          `}
        >
          <div className="text-center font-bold py-6 text-lg">
            Informasi Teknologi
          </div>
          <img
            src={meta.TRT.data.informasi_teknologi.drawable}
            alt="teknologi-tirta"
          />
          <div className="flex flex-col gap-4 mt-6">
            <div
              dangerouslySetInnerHTML={{
                __html: meta.TRT.data.informasi_teknologi.description,
              }}
            />
          </div>
        </div>
        <div
          id="logistik"
          css={css`
            scroll-margin: 60px;
          `}
        >
          <div>
            <div className="text-center font-bold py-6 text-lg">Logistik</div>
            <img src={meta.TRT.data.logistik.drawable} alt="teknologi-tirta" />
            <div className="flex flex-col gap-4 mt-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: meta.TRT.data.logistik.description,
                }}
              />
            </div>
          </div>
        </div>
        <div
          id="sdm"
          css={css`
            scroll-margin: 60px;
          `}
        >
          <div className="text-center font-bold py-6 text-lg">
            Sumber Daya Manusia
          </div>
          <img src={meta.TRT.data.sdm.drawable} alt="teknologi-tirta" />
          <div className="flex flex-col gap-4 mt-6">
            <div
              dangerouslySetInnerHTML={{
                __html: meta.TRT.data.sdm.description,
              }}
            />
          </div>
        </div>
      </div>

      <div
        id="direksi"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">
          Jajaran Direksi
        </div>
        <div
          className="px-2.5 mb-4"
          dangerouslySetInnerHTML={{
            __html: meta.TRT.data.jajaran_direksi.desc,
          }}
        />
        <div>
          <Swiper
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            slidesPerView={3.5}
            modules={[Navigation]}
          >
            {meta.TRT.data.jajaran_direksi.content.map(
              (manage: any, idx: number) => (
                <SwiperSlide key={idx}>
                  <div className="relative text-white">
                    <LazyLoadImage src={manage.img} alt={manage.title} />
                    <div className="absolute right-0 left-0 bottom-0 h-20">
                      <div className="absolute top-0 px-2.5">
                        <div className="font-bold">{manage.title}</div>
                        <div className="font-semibold text-xs">
                          {manage.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            )}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </Swiper>
        </div>

        <div className="my-12">
          <div className="text-lg text-center font-bold my-6">
            Personel Kunci
          </div>
          <div
            className="grid grid-cols-2"
            css={css`
              background: url('/images/about-us/tirtakencana-tatawarna/management/bg-mobile.jpg');
              background-position: 50%;
              background-size: cover;
            `}
          >
            {meta.TRT.data.personel.content.map((data: any, idx: number) => {
              // if (idx === 0) {
              //   return (
              //     <div key={idx} className="row-span-2">
              //       <div className="relative w-full h-full">
              //         <Personel data={data} />
              //       </div>
              //     </div>
              //   )
              // }
              // if (idx !== 0) {
              //   return (
              //     <div key={idx}>
              //       <div className="relative w-full h-full">
              //         <Personel data={data} />
              //       </div>
              //     </div>
              //   )
              // }
              return (
                <div key={idx}>
                  <div className="relative w-full h-full">
                    <Personel data={data} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div
        css={css`
          margin-bottom: 50px;
        `}
      />
    </div>
  )
}
