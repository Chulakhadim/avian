import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGlobal } from 'web-utils'
import { globalAboutUs } from '../base/global/aboutus'
import { Submenu } from './AvianAboutPT'
import { IconCodeLoad } from './top-icons'

export const AvianAboutAIC = () => {
  const meta = useGlobal(globalAboutUs, async () => {
    if (!meta.AIC.loading) return
    const post = await db.post.findFirst({
      where: { type: 'aboutus', title: 'Avian Innovation Center' },
    })
    meta.AIC.data = post?.content
    meta.AIC.loading = false
    meta.render()
  })

  const linkContent = [
    {
      title: 'Tentang AIC',
      hash: '#tentang-aic',
    },
    {
      title: 'Teknologi',
      hash: '#teknologi',
    },
    {
      title: 'Riset dan Inovasi',
      hash: '#riset-inovasi',
    },
    {
      title: 'Ahli R&D Kami',
      hash: '#ahlirnd',
    },
  ]

  const subScroll = (id: any) =>
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

  if (meta.AIC.loading)
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
        src="/images/tentang_kami_aic_header.jpg"
        alt="about-avian-aic"
      />
      <Submenu data={linkContent} subScroll={subScroll} />
      <div
        className="p-2.5 bg-gray-50"
        id="tentang-aic"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">
          Tentang Avian Innovation Center
        </div>
        <div className="mb-6 flex flex-col gap-4">
          {meta.AIC.data.about.desc.map((e: any, i: number) => {
            return <div key={i} dangerouslySetInnerHTML={{ __html: e }} />
          })}
          <div
            dangerouslySetInnerHTML={{ __html: meta.AIC.data.aic.description }}
          />
        </div>
        <iframe
          className="w-full"
          height="200"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
          src={meta.AIC.data.aic.video_url}
        ></iframe>
        <div
          id="teknologi"
          css={css`
            scroll-margin: 60px;
          `}
        >
          <div className="text-center font-bold py-6 text-lg">Teknologi</div>
          <div
            className="mb-6"
            dangerouslySetInnerHTML={{
              __html: meta.AIC.data.teknologi.description,
            }}
          />
          <div className="flex flex-col gap-6">
            {meta.AIC.data.teknologi.content.map((e: any, idx: number) => (
              <div className="bg-white" key={idx}>
                <LazyLoadImage src={e.image_url} alt={e.title} />
                <div className="p-2.5">{e.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="p-2.5"
        id="riset-inovasi"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">
          Riset dan Inovasi
        </div>
        <img
          src={meta.AIC.data.riset_dan_inovasi.image_url}
          alt="riset dan inovasi avian"
        />
        <div
          className="mt-6"
          dangerouslySetInnerHTML={{
            __html: meta.AIC.data.riset_dan_inovasi.description,
          }}
        />
      </div>
      <div
        id="ahlirnd"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">Ahli R&D Kami</div>
        <div className="p-2.5 mb-6">
          <div
            dangerouslySetInnerHTML={{
              __html: meta.AIC.data.ahli_r_d.description,
            }}
          />
        </div>
        <div>
          <Swiper
            slidesPerView={4}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            modules={[Navigation]}
          >
            {meta.AIC.data.ahli_r_d.content.map((item: any, idx: number) => (
              <SwiperSlide key={idx}>
                <div>
                  <LazyLoadImage src={item.image_url} alt={item.title} />
                  <div className="text-avian-green1 text-xs p-2">
                    <div className="font-bold mb-1 text-sm">{item.title}</div>
                    <div>{item.description}</div>
                  </div>
                </div>

                <div
                  className="swiper-button-prev"
                  css={css`
                    top: 30%;
                  `}
                ></div>
                <div
                  className="swiper-button-next"
                  css={css`
                    top: 30%;
                  `}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div
        css={css`
          margin-bottom: 100px;
        `}
      />
    </div>
  )
}
