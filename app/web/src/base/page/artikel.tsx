import { useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { page } from 'web-init'
import { useGlobal, useLocal, usePager } from 'web-utils'
import { IconCodeLoad } from '../../components/top-icons'
import { dateFormat, uriLink, urlMedia } from '../../components/utils'
import { globalArtikel } from '../global/artikel'

export default page({
  url: '/artikel/:id?',
  layout: 'top-only',
  component: ({ layout }) => {
    const state = useGlobal(globalArtikel)
    const pager = usePager({
      pageSize: 10,
      init: state.pager,
      onChange: (pager) => {
        state.pager = pager
      },
      query: ({ take, skip }) => {
        return db.dtb_article.findMany({
          select: {
            image_url: true,
            title: true,
            date: true,
            pretty_url: true,
            short_content: true,
          },
          orderBy: {
            id: 'desc',
          },
          take,
          skip: skip,
        })
      },
    })

    useEffect(() => {
      ;(async () => {
        if (params.id) {
          state.loading = true
          state.render()
          state.article = await db.dtb_article.findFirst({
            select: {
              image_url: true,
              title: true,
              date: true,
              pretty_url: true,
              full_content: true,
            },
            where: {
              OR: [
                {
                  pretty_url: {
                    equals: params.id,
                    mode: 'insensitive',
                  },
                },
                {
                  pretty_url: {
                    equals: `/${params.id}`,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          })
          state.loading = false
          state.render()
        }
      })()
    }, [params.id])

    if (params.id) {
      if (state.loading || !state.article)
        return (
          <div className="flex-col flex h-full w-full items-center justify-center">
            <IconCodeLoad />
            <IconCodeLoad />
            <IconCodeLoad />
            <IconCodeLoad />
          </div>
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
              {dateFormat(state.article.date, 'dd MMMM yyyy')}
            </div>
          </div>
          <div className="font-semibold text-xl my-3">
            {state.article.title}
          </div>
          <div
            className="text-avian-grey4 prose"
            css={css`
              * {
                font-family: 'Sarabun' !important;
              }
            `}
            dangerouslySetInnerHTML={{
              __html: state.article.full_content.replace(
                /\.\.\/\.\.\/upload/gi,
                'https://avianbrands.com/upload/'
              ),
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
            Artikel
          </div>
          <div className="my-5 space-y-4">
            {pager.data.map((data, idx) => {
              return (
                <a key={idx} href={`/artikel${uriLink(data.pretty_url)}`}>
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
                          data.image_url
                            ? urlMedia(data.image_url)
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
                          {dateFormat(data.date, 'dd MMMM yyyy')}
                        </div>
                      </div>
                      <div className="text-avian-green2 text-sm font-bold leading-5">
                        {data.title?.length > 49
                          ? data.title.substring(0, 49) + '...'
                          : data.title}
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
