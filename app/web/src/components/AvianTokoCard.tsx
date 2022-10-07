import { FC, useEffect } from 'react'
import { useGlobal, useLocal } from 'web-utils'
import { defaultCenter, globalToko } from '../base/global/toko'

export const AvianTokoCard: FC = () => {
  const toko = useGlobal(globalToko, () => {
    toko.selected = null
    toko.render()
  })
  const local = useLocal({ data: null as any })
  const map = toko.map

  useEffect(() => {
    if (toko.selected)
      db.mst_store
        .findFirst({ where: { id: parseInt(toko.selected.id) } })
        .then((e) => {
          local.data = e
          local.render()
        })
  }, [toko.selected])

  if (!toko.selected || !local.data) return null

  const origin = defaultCenter
  const item = local.data
  return (
    <div
      className="absolute bottom-0 left-0 w-4/5 bg"
      css={css`
        z-index: 1000;
      `}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="bg-white flex flex-row items-center justify-around p-3 shadow-md rounded-md h-full mb-8"
          css={css`
            width: 280px;
          `}
        >
          <div
            className="flex flex-col flex-1"
            onClick={() => {
              // panTo(
              //   !!item.latitude ? item.latitude : item.lattitude,
              //   item.longitude,
              //   item.id
              // )
            }}
          >
            <div className="text-green-900 font-bold text-light-green-hover">
              {item.name}
            </div>
            <div className="flex font-normal mt-2 text-gray-600 ">
              <div>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="text-xs pl-2">{item.address || '-'}</div>
            </div>
            <div className="flex font-normal text-gray-600  mt-2">
              <div>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <a
                href={item.phone ? `tel:${item.phone}` : undefined}
                className={
                  'pl-2 text-xs  text-green-600 font-bold ' +
                  (item.phone ? 'underline' : '')
                }
              >
                {item.phone || '-'}
              </a>
            </div>
          </div>

          <div
            className="flex flex-col text-center direction-map"
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${item.lattitude},${item.longitude}`,
                '_blank'
              )
            }}
          >
            <div
              className="self-center bg-no-repeat p-6"
              css={css`
                background-image: url('/images/icon_direction.png');
              `}
            ></div>
            <div className="text-light-green-hover text-xs pt-2">
              Petunjuk Arah
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
