import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useGlobal } from 'web-utils'
import { globalHome } from '../base/global/home'
import { IconCodeLoad } from './top-icons'
import { dateFormat, urlMedia } from './utils'

export const AvianHomeNews = () => {
  const meta = useGlobal(globalHome, async () => {
    if (meta.listNews.length === 0) {
      meta.listNews = await db.dtb_article.findMany({
        select: {
          title: true,
          pretty_url: true,
          short_content: true,
          date: true,
          image_device: true,
          id: true,
        },
        take: 3,
        orderBy: {
          id: 'desc',
        },
      })
      meta.render()
    }
  })

  return (
    <div className="flex p-4 flex-col item-stretch">
      <div className={`flex self-stretch space-x-1 items-center justify-start`}>
        <div className={`flex flex-1 flex-col items-start justify-start`}>
          <div
            className={`text-lg font-bold leading-relaxed text-green-900 text-avian-green1`}
          >
            Artikel
          </div>
        </div>
        <a
          className={`text-xs font-bold leading-none text-green-500 text-avian-green3`}
          href="/artikel"
        >
          Lihat Semua
        </a>
      </div>
      <div
        className={`flex self-stretch flex-col space-y-6 items-start justify-start py-4`}
        css={css`
          min-height: 500px;
        `}
      >
        {meta.listNews.length === 0 && (
          <>
            <IconCodeLoad />
            <IconCodeLoad />
            <IconCodeLoad />
          </>
        )}
        {meta.listNews.map((item: any, idx: number) => {
          return (
            <div
              key={idx}
              className={`flex self-stretch flex-col space-y-2.5 items-start justify-start`}
              onClick={() => {
                let link = item.pretty_url
                if (typeof link !== 'string') link = ''
                navigate(`/artikel${link[0] === '/' ? link : `/${link}`}`)
              }}
            >
              {item.image_device && (
                <LazyLoadImage
                  src={urlMedia(item.image_device)}
                  className={`rounded-md object-cover w-full aspect-w-4 aspecth-h-3`}
                  onError={(e: any) => {
                    e.target.onerror = null
                  }}
                />
              )}
              <div className="flex self-stretch flex-col space-y-0.5 items-start justify-start rounded-tl rounded-tr">
                <div className="flex space-x-1 items-center justify-start">
                  <img
                    src="/imgs/icon-news.svg"
                    css={css`
                      width: 20px;
                      min-width: 20px;
                      max-width: 20px;
                      height: 20px;
                      min-height: 20px;
                      max-height: 20px;
                    `}
                  />
                  <div className={`text-xs leading-none text-gray-800`}>
                    {dateFormat(item.date, 'd MMMM yyyy')}
                  </div>
                </div>
                <div
                  className={`pt-1 text-sm font-bold leading-tight text-avian-green2`}
                >
                  {item.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
