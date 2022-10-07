import { useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Swiper, SwiperSlide } from 'swiper/react'
import { page } from 'web-init'
import { useGlobal, usePager } from 'web-utils'
import { IconCodeLoad } from '../../components/top-icons'
import { dateFormat, uriLink, urlMedia } from '../../components/utils'
import { globalPeduli } from '../global/peduli'

export default page({
  url: '/peduli/:id?',
  layout: 'top-only',
  component: ({ layout }) => {
    const state = useGlobal(globalPeduli)
    const filters = ['Semua', 'Pendidikan', 'Lingkungan', 'Bencana']

    const pager = usePager({
      pageSize: 10,
      init: state.pager,
      onChange: (pager) => {
        state.pager = pager
      },
      query: ({ take, skip }) => {
        let where = ''
        if (state.activeTab[0] !== 'Semua')
          where += `AND t.type IN (${state.activeTab
            .map((x) => filters.indexOf(x))
            .join(',')})`

        return db.query(`SELECT t.*, a.date, a.judul, a.created_date, a.pretty_url, a.short_content
          FROM mst_csr AS t INNER 
          JOIN mst_csr_artikel AS a ON t.artikel_csr_id = a.id 
          WHERE t.is_show = 1 ${where}
          ORDER BY t.id DESC
          LIMIT ${take} OFFSET ${skip}`)
      },
    })

    const handleTab = (value: string) => {
      const removeItem = (array: string[], value: string) => {
        const index = array.indexOf(value)
        array.splice(index, 1)
      }

      let tabs: string[] = [...state.activeTab]

      if (!tabs.includes(value)) {
        tabs.push(value)
      } else if (tabs.length > 1) {
        removeItem(tabs, value)
      }

      if (tabs.length > 1 && tabs.includes('Semua')) {
        removeItem(tabs, 'Semua')
      }

      if (tabs.length === 3 || value === 'Semua') {
        tabs = ['Semua']
      }

      state.activeTab = tabs
      state.render()

      pager.reload()
    }

    useEffect(() => {
      ;(async () => {
        if (params.id) {
          state.loading = true
          state.render()
          state.article = await db.mst_csr_artikel.findFirst({
            select: {
              date: true,
              judul: true,
              mst_csr: true,
              created_date: true,
              pretty_url: true,
              content: true,
              short_content: true,
            },
            where: {
              id: Number(params.id),
            },
          })
          state.loading = false
          state.render()
        }
      })()
    }, [params.id])

    if (params.id) {
      if (state.loading)
        return (
          <>
            <IconCodeLoad />
            <IconCodeLoad />
            <IconCodeLoad />
            <IconCodeLoad />
          </>
        )
      return (
        <div className="flex flex-col flex-1 p-3 bg-white">
          <div className="flex gap-1 items-center">
            <img src="/icons/ic-calendar.svg" alt="" />
            <div
              css={css`
                font-size: 10px;
                color: #333;
              `}
            >
              {dateFormat(state.article.created_date, 'dd MMMM yyyy')}
            </div>
          </div>
          <div className="font-semibold text-xl my-3">
            {state.article.judul}
          </div>

          <img
            src={
              state.article.mst_csr[0].image_landing
                ? urlMedia(state.article.mst_csr[0].image_landing)
                : '/imgs/product-not-found.png'
            }
            className="w-full h-full rounded-md mb-4"
          />
          <div
            className="text-avian-grey4 prose"
            css={css`
              * {
                font-family: 'Sarabun' !important;
              }
            `}
            dangerouslySetInnerHTML={{
              __html: state.article.content.replace(
                /\.\.\/\.\.\/upload/gi,
                'https://avianbrands.com/upload/'
              ),
              // .replace(/up\.avianbrands\.com\//gi, 'avianbrands.com/'),
            }}
          />
        </div>
      )
    }

    return (
      <div
        className="flex flex-col items-stretch overflow-auto absolute inset-0"
        ref={(el) => {
          if (el) {
            el.scrollTop = state.scrollTop
          }
        }}
        onScroll={(e: any) => {
          const elm = e.target
          state.scrollTop = elm.scrollTop
          if (elm.scrollTop + 100 > elm.scrollHeight - elm.clientHeight) {
            if (!pager.loading) pager.next()
          }
        }}
      >
        <div className="px-4">
          <div className="text-base text-center font-bold text-avian-green1 my-5">
            Avian Brands Peduli
          </div>
          <div>
            <Swiper slidesPerView={3.6} spaceBetween={5}>
              {filters.map((filter, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    key={idx}
                    className={`${
                      state.activeTab.indexOf(filter) >= 0 &&
                      'avian-green3 text-white'
                    } text-xs text-center text-avian-grey3 py-2 rounded border btn-fade`}
                    css={css`
                      border-color: #737373;
                    `}
                    onClick={() => {
                      handleTab(filter)
                    }}
                  >
                    {filter}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="my-5 space-y-4">
            {pager.data.map((data: any, idx) => {
              return (
                <a key={idx} href={`/peduli/${data.artikel_csr_id}`}>
                  <div className="flex gap-2">
                    <div
                      css={css`
                        width: 120px;
                        height: 90px;
                      `}
                      className="rounded"
                    >
                      <LazyLoadImage
                        src={
                          data.image_landing
                            ? urlMedia(data.image_landing)
                            : '/imgs/product-not-found.png'
                        }
                        className="w-full h-full rounded-md"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex gap-1 items-center">
                        <img src="/icons/ic-calendar.svg" alt="calendar-icon" />
                        <div
                          css={css`
                            font-size: 10px;
                            color: #333;
                          `}
                        >
                          {dateFormat(data.created_date, 'dd MMMM yyyy')}
                        </div>
                      </div>
                      <div className="text-avian-green2 text-sm font-bold leading-5">
                        {(data.judul || '')?.length > 49
                          ? (data.judul || '').substring(0, 49) + '...'
                          : data.judul || ''}
                      </div>
                      <div className="text-avian-grey4 text-xs">
                        {(data.short_content || '').length > 56
                          ? (data.short_content || '').substring(0, 56) + '...'
                          : data.short_content}
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
            {pager.hasMore && (
              <>
                <IconCodeLoad />
                <IconCodeLoad />
              </>
            )}
          </div>
        </div>
      </div>
    )
  },
})
