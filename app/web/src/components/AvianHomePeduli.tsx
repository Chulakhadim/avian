import { useGlobal } from 'web-utils'
import { globalHome } from '../base/global/home'
import { Swiper, SwiperSlide } from 'swiper/react'
import { dateFormat } from './utils'
import { IconCodeLoad } from './top-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { LazyLoadImage } from 'react-lazy-load-image-component'

export const AvianHomePeduli = () => {
  const meta = useGlobal(globalHome, async () => {
    if (meta.listPeduli.length === 0) {
      meta.listPeduli = await db.mst_csr.findMany({
        select: {
          artikel_csr_id: true,
          id: true,
          image_landing: true,
          mst_csr_artikel: {
            select: {
              judul: true,
              created_date: true,
              pretty_url: true,
              short_content: true,
            },
          },
        },
        where: {
          artikel_csr_id: {
            not: null,
          },
          is_show: 1
        },
        take: 5,
        orderBy: {
          id: 'desc',
        },
      })
      meta.render()
    }
  })

  return (
    <>
      <div className="flex self-stretch p-4 flex-col items-start justify-start">
        <div className="flex self-stretch flex-col space-y-1 items-start justify-start">
          <div className="flex self-stretch space-x-1 items-center justify-start">
            <div className={`flex flex-1 flex-col items-start justify-start`}>
              <div
                className={`text-lg font-bold leading-relaxed text-green-900  text-avian-green1`}
              >
                Avian Brands Peduli
              </div>
            </div>
            <div
              className={`flex flex-col items-start justify-start`}
              onClick={() => navigate('/peduli')}
            >
              <div
                className={`text-xs font-bold leading-none text-green-500 text-avian-green3`}
              >
                Lihat Semua
              </div>
            </div>
          </div>
          <div className={`text-sm leading-tight text-gray-800`}>
            Avian Brands berkomitmen untuk memberikan dampak positif bagi
            masyarakat kini dan nanti yang kami salurkan melalui Avian Brands
            Peduli, sebuah wadah tanggung jawab sosial terhadap dunia
            pendidikan, lingkungan, dan aksi tanggap bencana.
          </div>
        </div>
      </div>

      <div
        className="flex p-4 self-stretch flex-col items-start justify-start"
        css={css`
          height: 216px;
        `}
      >
        {meta.listPeduli.length === 0 && (
          <>
            <IconCodeLoad />
            <IconCodeLoad />
          </>
        )}

        <AnimatePresence>
          <Swiper slidesPerView={2.4} spaceBetween={15} className="w-full">
            {meta.listPeduli.map((item: any, idx: number) => {
              if (item.mst_csr_artikel) {
                return (
                  <SwiperSlide key={idx}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col"
                      onClick={() =>
                        navigate(`/peduli/${item.artikel_csr_id}`)
                      }
                    >
                      <LazyLoadImage
                        src={`https://avianbrands.com${item.image_landing}`}
                        className={`flex flex-col items-start justify-start rounded  overflow-hidden object-cover w-40 sm:w-32`}
                        onError={(e: any) => {
                          e.target.onerror = null
                          e.target.src =
                            'http://e.plansys.co:3020/fimgs/871_303578.x3.png'
                        }}
                      />
                      <div className="flex space-x-1 items-center justify-start my-2">
                        <img
                          src="/imgs/icon-peduli.svg"
                          css={css`
                            width: 16px;
                            height: 16px;
                          `}
                        />
                        <div
                          className={`text-xs flex-1 leading-none text-gray-800`}
                        >
                          {dateFormat(
                            item.mst_csr_artikel.created_date,
                            'd MMMM yyyy'
                          )}
                        </div>
                      </div>

                      <div
                        className={`leading-tight text-xs text-avian-green2 font-bold line-clamp-3`}
                      >
                        {item.mst_csr_artikel.judul.length > 35
                          ? item.mst_csr_artikel.judul.substring(0, 35) + '...'
                          : item.mst_csr_artikel.judul}
                      </div>
                    </motion.div>
                  </SwiperSlide>
                )
              }
            })}
          </Swiper>
        </AnimatePresence>
      </div>
    </>
  )
}
