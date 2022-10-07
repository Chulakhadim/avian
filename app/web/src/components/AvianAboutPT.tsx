import { FC } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGlobal, useLocal } from 'web-utils'
import { globalAboutUs } from '../base/global/aboutus'
import { IconCodeLoad } from './top-icons'

export const AvianAboutPT = () => {
  const meta = useGlobal(globalAboutUs, async () => {
    if (!meta.PT.loading) return
    const post = await db.post.findFirst({
      where: { type: 'aboutus', title: 'PT Avia Avian (Avian Brands)' },
    })
    meta.PT.data = post?.content
    meta.PT.loading = false
    meta.render()
  })

  const linkContent = [
    {
      title: 'Tentang Kami',
      hash: '#tentang-kami',
    },
    {
      title: 'Visi dan Misi',
      hash: '#visi-misi',
    },
    {
      title: 'Perjalanan Avian Brands',
      hash: '#perjalanan-avian',
    },
    {
      title: 'Direksi',
      hash: '#direksi',
    },
    {
      title: 'Pabrik',
      hash: '#pabrik',
    },
  ]

  const renderPerjalananAvian = () => (
    <div
      className="relative"
      css={css`
        width: 100%;
        height: 600px;
      `}
    >
      <Swiper
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        pagination={{ clickable: true, el: '.swiper-pagination' }}
        modules={[Pagination, Navigation]}
      >
        {meta.PT.data.perjalanan.list.map((e: any, idx: number) => (
          <SwiperSlide key={idx}>
            <div className="flex flex-col bg-white">
              <LazyLoadImage src={e.drawable} alt={e.year} />
              <div className="p-2.5 h-56 overflow-y-auto">
                <div className="text-avian-green1 font-bold">{e.year}</div>
                <div
                  className="mb-14"
                  dangerouslySetInnerHTML={{ __html: e.desc }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
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
      </Swiper>

      <div
        className={`z-20 flex self-stretch space-x-2.5 items-end justify-center p-4 swiper-pagination`}
      />
    </div>
  )

  const renderManagements = () => (
    <div
      css={css`
        background-image: url('/images/JajaranDireksiAvianBrands_bg.jpg');
        background-size: cover;
        background-repeat: no-repeat;
      `}
    >
      <Swiper
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        slidesPerView={4}
        modules={[Navigation]}
      >
        {meta.PT.data.jajaran.drawable.map((e: any, idx: number) => (
          <SwiperSlide key={idx}>
            <div className="relative">
              <div
                className="w-fit h-fit"
                css={css`
                  background-image: url('${e.img}');
                  background-position: bottom center;
                  background-size: cover;
                  background-repeat: no-repeat;
                `}
              >
                <img
                  src={`/images/JajaranDireksiAvianBrands_PakHadi.png`}
                  className="w-full h-full opacity-0"
                />
              </div>
              <div className="p-2 absolute left-0 bottom-0 w-full h-24 text-white text-xs bg-black bg-opacity-40">
                <div className="font-bold">{e.title}</div>
                <div className="text-xs">{e.subtitle}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div
          className="swiper-button-prev"
          css={css`
            top: 50%;
          `}
        ></div>
        <div
          className="swiper-button-next"
          css={css`
            top: 50%;
          `}
        ></div>
      </Swiper>
    </div>
  )

  const renderPersonelKey = () => (
    <div
      id="personel-kunci"
      css={css`
        /* img {
          max-height: 150px;
        } */
      `}
    >
      <Swiper
        slidesPerView={4}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        modules={[Navigation]}
      >
        {meta.PT.data.personel.drawable.map((e: any, idx: number) => (
          <SwiperSlide key={idx}>
            <LazyLoadImage src={e.img} alt={e.title} />
            <div className="text-avian-green1 text-xs p-2">
              <div className="font-bold mb-1">{e.title}</div>
              <div>{e.subtitle}</div>
            </div>
          </SwiperSlide>
        ))}
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
      </Swiper>
    </div>
  )

  const subScroll = (id: any) =>
    document
      .querySelector(id)
      .scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (meta.PT.loading)
    return (
      <div className="p-4">
        <IconCodeLoad />
        <IconCodeLoad />
        <IconCodeLoad />
      </div>
    )

  return (
    <div className="bg-gray-200 flex flex-col flex-1">
      {/* <Menu /> */}
      <img
        className="w-full"
        src="/images/about-avian-brands.jpg"
        alt="about-avian-brands"
      />
      <Submenu data={linkContent} subScroll={subScroll} />
      <div
        className="p-2.5 bg-gray-50"
        id="tentang-kami"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">
          Tentang Avian Brands
        </div>
        <div dangerouslySetInnerHTML={{ __html: meta.PT.data.about.desc }} />
      </div>
      <div
        className="p-2.5 bg-gray-50 pb-6"
        id="visi-misi"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold py-6 text-lg">Visi dan Misi</div>
        <div className="mb-6">
          <div className="text-center text-avian-green1 mb-2">Visi</div>
          <div dangerouslySetInnerHTML={{ __html: meta.PT.data.visi }} />
        </div>
        <div className="mt-6">
          <div className="text-center text-avian-green1 mb-2">Misi</div>
          <div className="space-y-1">
            <div
              dangerouslySetInnerHTML={{ __html: meta.PT.data.misi[0].desc1 }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: meta.PT.data.misi[0].desc2 }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: meta.PT.data.misi[0].desc3 }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: meta.PT.data.misi[0].desc4 }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: meta.PT.data.misi[0].desc5 }}
            />
          </div>
        </div>
        <div className="text-center font-bold my-12 text-lg">Nilai Kami</div>
        <div className="grid grid-cols-2 gap-6">
          {meta.PT.data.nilai.map((value: any, idx: number) => (
            <div key={idx} className="flex flex-col">
              <LazyLoadImage
                src={value.drawable}
                alt={value.title}
                className="w-32"
              />
              <div className="my-2 text-avian-green1">{value.title}</div>
              <div
                className="w-40"
                dangerouslySetInnerHTML={{ __html: value.description }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className="p-2.5 bg-gray-100"
        id="perjalanan-avian"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="text-center font-bold text-lg py-6">
          Perjalanan Avian Brands
        </div>
        <div
          className="mb-12"
          dangerouslySetInnerHTML={{ __html: meta.PT.data.perjalanan.desc }}
        />
        {renderPerjalananAvian()}
      </div>
      <div
        className="bg-gray-100 pb-12"
        id="direksi"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <div className="p-2.5 mb-4">
          <div className="text-center font-bold text-lg py-6">
            Komisaris dan Direksi
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: meta.PT.data.jajaran.desc }}
          />
        </div>
        {renderManagements()}
        <div>
          <div className="text-center font-bold text-lg my-12">
            Personel Kunci
          </div>
          {renderPersonelKey()}
        </div>
      </div>
      <div
        className="relative"
        id="pabrik"
        css={css`
          scroll-margin: 60px;
        `}
      >
        <img src="/images/pabrik_avian.png" alt="pabrik avian" />
        <div className="absolute bottom-0 p-2.5 text-white bg-black bg-opacity-30">
          <div className="font-bold">Pabrik</div>
          <div dangerouslySetInnerHTML={{ __html: meta.PT.data.pabrik.desc }} />
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

export const Submenu: FC<any> = ({ data, subScroll }) => {
  const meta = useLocal({ active: 0 })
  return (
    <div className="bg-white sticky top-0 z-50">
      <Swiper slidesPerView={2.5} spaceBetween={40}>
        {data.map((menu: any, idx: number) => {
          return (
            <SwiperSlide
              key={idx}
              className={`${
                idx === meta.active && 'border-b-4 border-green-600'
              } py-2 whitespace-nowrap text-center`}
            >
              <div
                onClick={() => {
                  subScroll(menu.hash)
                  meta.active = idx
                  meta.render()
                }}
              >
                {menu.title}
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
