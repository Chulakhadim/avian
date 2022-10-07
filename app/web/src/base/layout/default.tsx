import { BottomBar, MobileLayout, Sidebar } from 'web-ui'
import { layout } from 'web-init'
import { useGlobal } from 'web-utils'
import { AvianSideBar } from '../../components/AvianSideBar'
import { AvianTopBar } from '../../components/AvianTopBar'
import {
  BerandaAktif,
  BerandaPasif,
  ProdukAktif,
  ProdukPasif,
  TokoAktif,
  TokoPasif,
  VisAktif,
  VisPasif,
  WarnaAktif,
  WarnaPasif,
} from '../../components/bottom-icons'
import { globalLayout } from '../global/layout'
import { useEffect } from 'react'

export default layout({
  component: ({ children }) => {
    const meta = useGlobal(globalLayout)

    useEffect(() => {
      meta.sidebar = false
    }, [location.pathname])

    return (
      <div
        css={css`
          .safe-area-top {
            background: #124734;
          }
          .safe-area-bottom {
            background: #f7f7f8;
          }
          .bottom-bar {
            background: #f7f7f8;
            border-top: 1px solid #e2e2e3;

            .is-active {
              color: #60ae56;
            }
          }
        `}
      >
        <MobileLayout>
          <AvianTopBar
            onShowSidebar={() => {
              meta.sidebar = !meta.sidebar
              meta.render()
            }}
          />
          <div
            className="flex flex-1 flex-col relative"
            css={css`
              background: #fbfbfb;
            `}
          >
            <Sidebar
              className="flex flex-1 self-stretch flex-col space-y-4 items-start justify-start p-4 bg-white w-4/5"
              show={meta.sidebar}
              onClose={() => {
                meta.sidebar = false
                meta.render()
              }}
              onShow={() => {
                meta.sidebar = true
                meta.render()
              }}
            >
              <AvianSideBar />
            </Sidebar>
            <div
              className="absolute inset-0 overflow-auto flex flex-col"
              ref={(el) => {
                if (el) {
                  el.scrollTop = meta.scroll[location.pathname]
                }
              }}
              onScroll={(e) => {
                const div = e.target as HTMLDivElement
                meta.scroll[location.pathname] = div.scrollTop
              }}
            >
              {children}
            </div>
          </div>
          <BottomBar
            tabs={[
              {
                url: '/',
                component: ({ isActive }) => {
                  return (
                    <>
                      {isActive ? <BerandaAktif /> : <BerandaPasif />}
                      <span>Beranda</span>
                    </>
                  )
                },
              },
              {
                url: '/produk',
                component: ({ isActive }) => {
                  return (
                    <>
                      {isActive ? <ProdukAktif /> : <ProdukPasif />}
                      <span>Produk</span>
                    </>
                  )
                },
              },
              {
                url: '/toko',
                isActive: (url) => url.startsWith('/toko'),
                component: ({ isActive }) => {
                  return (
                    <>
                      {isActive ? <TokoAktif /> : <TokoPasif />}
                      <span>Cari Toko</span>
                    </>
                  )
                },
              },
              {
                url: '/warna',
                component: ({ isActive }) => {
                  return (
                    <>
                      {isActive ? <WarnaAktif /> : <WarnaPasif />}
                      <span>Warna</span>
                    </>
                  )
                },
              },
              {
                url: '/vis',
                component: ({ isActive }) => {
                  return (
                    <>
                      {isActive ? <VisAktif /> : <VisPasif />}
                      <span>Visualizer</span>
                    </>
                  )
                },
              },
            ]}
          />
        </MobileLayout>
      </div>
    )
  },
})
