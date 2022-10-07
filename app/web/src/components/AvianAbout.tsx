import { useLocal } from 'web-utils'
import { AvianAboutAIC } from './AvianAboutAIC'
import { AvianAboutPT } from './AvianAboutPT'
import { AvianAboutStore } from './AvianAboutStore'
import { AvianAboutTirta } from './AvianAboutTirta'

export const AvianAbout = () => {
  const local = useLocal({
    tab: 'PT',
    tabs: {
      PT: ['PT Avia Avian', <AvianAboutPT />],
      AIC: ['Avian Innovation Center', <AvianAboutAIC />],
      STR: ['Avian Brands Store', <AvianAboutStore />],
      TRT: ['PT Tirtakencana Tatawarna', <AvianAboutTirta />],
    },
  })

  const component = (local.tabs as any)[local.tab][1]

  return (
    <div
      className="flex flex-1 flex-col items-stretch overflow-hidden relative"
      css={css`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
        }
      `}
    >
      <div className="flex flex-row space-x-4 text-sm py-3 absolute top-0 w-full z-[1000] overflow-x-auto">
        {Object.entries(local.tabs).map(([k, v]) => {
          const [title] = v
          return (
            <div
              key={k}
              className={`whitespace-nowrap px-3 text-base ${
                local.tab === k ? 'font-bold' : ''
              }`}
              onClick={() => {
                local.tab = k
                local.render()
                const doc = document.getElementById('component')
                if (!!doc) doc.scrollTop = 0
              }}
            >
              {title}
            </div>
          )
        })}
      </div>
      <div
        className="overflow-auto"
        css={css`
          margin-top: 48px;
        `}
        id="component"
      >
        {component}
      </div>
    </div>
  )
}
