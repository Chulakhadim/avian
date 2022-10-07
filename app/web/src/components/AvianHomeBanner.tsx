import { AnimatePresence, motion } from 'framer-motion'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Autoplay, Pagination, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useGlobal } from 'web-utils'
import { globalHome } from '../base/global/home'
import { IconCodeLoad } from './top-icons'
export const AvianHomeBanner = () => {
  const meta = useGlobal(globalHome, async () => {
    if (meta.bannerTop.length === 0)
      meta.bannerTop = await db.dtb_slider_mobile.findMany({
        orderBy: {
          ordering: 'asc'
        },
        select: {
          image_url_device: true,
          url: true,
        },
        where: {
          image_url_device: {
            not: null,
          },
        },
      })
    meta.render()
  })

  return (
    <div className="flex self-stretch flex-col items-start justify-start relative ">
      <AnimatePresence>
        {meta.bannerTop.length === 0 ? (
          <div className="aspect-w-4 aspect-h-3 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center ">
              <IconCodeLoad />
            </div>
          </div>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            className="aspect-w-4 aspect-h-3 w-full"
            loop={true}
            pagination={{ clickable: true, el: '.swiper-pagination' }}
            autoplay={{ delay: 3000 }}
          >
            {meta.bannerTop.map((item: any, key: number) => {
              return (
                <SwiperSlide key={key}>
                  <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex aspect-w-4 aspect-h-3 w-full`}
                    href={item.url}
                    target={item.target}
                  >
                    <LazyLoadImage
                      src={`https://avianbrands.com${item.image_url_device}`}
                      className={`flex flex-col items-start justify-start`}
                    />
                  </motion.a>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}
      </AnimatePresence>
      <div
        className={`z-20 flex self-stretch space-x-2.5 items-end justify-center p-4 swiper-pagination absolute bottom-0 left-0 right-0`}
      />
    </div>
  )
}
