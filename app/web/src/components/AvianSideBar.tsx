import { Modal } from 'web-ui'
import { useLocal } from 'web-utils'
import { CloseIcon } from './top-icons'

export const AvianSideBar = () => {
  const local = useLocal({ modalRezeki: false })
  return (
    <>
      <div className="flex flex-1 self-stretch flex-col space-y-4 items-start justify-start">
        <div className="flex self-stretch flex-col space-y-2.5 items-start justify-start mt-5">
          <a
            className="flex self-stretch space-x-2.5 justify-start px-4 py-1 bg-white shadow rounded link panel-close items-center"
            href="https://wa.me/6281133345908"
            target="_blank"
            data-panel="left"
          >
            <img src="/imgs/icon-wa.png" width={30} height={30} />
            <div className="text-sm font-medium leading-tight text-avian-green2">
              Tanya Admin
            </div>
          </a>
          <a
            className="flex self-stretch space-x-2.5 justify-start px-4 py-1 bg-white shadow rounded link panel-close items-center"
            href="/pemasaran"
            data-panel="left"
          >
            <img
              src="/imgs/icon-pemasaran.png"
              width={30}
              height={30}
              className="flex flex-col items-start justify-start css-14f1rxj"
            />
            <div className="text-sm font-medium leading-tight text-avian-green2">
              Pemasaran
            </div>
          </a>
          <a
            className="flex self-stretch space-x-2.5 justify-start px-4 py-1 bg-white shadow rounded link panel-close items-center"
            href="/about-avian-brands"
            data-panel="left"
          >
            <img
              src="/imgs/icon-info.png"
              width={30}
              height={30}
              className="flex flex-col items-start justify-start css-14f1rxj"
            />
            <div className="text-sm font-medium leading-tight text-avian-green2">
              Tentang Kami
            </div>
          </a>
          <a
            onClick={() => {
              local.modalRezeki = true
              local.render()
            }}
            className="flex self-stretch space-x-2.5 justify-start px-4 py-1 bg-white btn-fade shadow rounded link panel-close items-center"
          >
            <img
              src="/imgs/icon-rezeki-mitra.png"
              width={30}
              height={30}
              className="flex flex-col items-start justify-start css-14f1rxj"
            />
            <div className="text-sm font-medium leading-tight text-avian-green2">
              Rezeki Mitra Avian Brands
            </div>
          </a>

          <Modal
            show={local.modalRezeki}
            animate={'bottom'}
            onClose={() => {
              local.modalRezeki = false
              local.render()
            }}
          >
            <div className="flex flex-col items-start justify-start px-5 pt-2.5 pb-8 bg-white shadow rounded relative">
              <button
                onClick={() => {
                  local.modalRezeki = false
                  local.render()
                }}
                className="border-none outline-none cursor-pointer group py-1 px-2 absolute top-0 right-1"
              >
                <>
                  <CloseIcon />
                </>
              </button>
              <div className="flex flex-col space-y-6 items-center justify-start bg-white rounded-tl rounded-tr mt-6">
                <div
                  css={css`
                    background: url(/images/rezeki.png);
                    width: 250px;
                    height: 196px;
                    background-size: 100%;
                  `}
                />
                <div className="flex flex-col space-y-1 items-center justify-start mt-4">
                  <div className="text-xs text-gray-800">
                    Kumpulkan poin sebanyak-banyaknya
                  </div>
                  <div className="text-xs text-gray-800">
                    dan tukarkan dengan hadiah langsung!
                  </div>
                </div>
                <div
                  className="flex self-stretch items-center justify-center px-2.5 py-1.5 avian-green3 shadow rounded"
                  onClick={async () => {
                    const w = window as any
                    const capacitor = w.Capacitor && w.Capacitor.Plugins
                    let platform = ''
                    if (capacitor && !!capacitor.Device) {
                      const info = await capacitor.Device.getInfo()
                      platform = info.platform
                    } else if (w.Device) {
                      const info = await w.Device.getInfo()
                      platform = info.platform
                    }

                    if (platform === 'ios') {
                      return window.open(
                        'https://apps.apple.com/id/app/rezeki-avian-brands/id1527875398',
                        '_blank'
                      )
                    }

                    window.open(
                      'https://play.google.com/store/apps/details?id=com.avian.loyalty',
                      '_blank'
                    )
                  }}
                >
                  <div
                    className="text-xs font-medium leading-none text-white"
                    css={css`
                      padding: 6px 0;
                    `}
                  >
                    Download Rezeki Mitra Avian Brands
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="flex self-stretch flex-col items-start justify-start">
        <div className="flex self-stretch flex-col space-y-2.5 items-center justify-start">
          <div className="flex self-stretch flex-col space-y-2.5 items-center justify-start p-2.5">
            <div className="flex self-stretch flex-col space-y-0.5 items-center justify-start">
              <div className="text-sm font-bold leading-tight text-green-900">
                Gedung Avian Brands
              </div>
              <div className="text-sm leading-tight text-center text-gray-800">
                Jl. Ahmad Yani 317, Surabaya, Jawa Timur, 60234
              </div>
            </div>
            <div className="text-sm font-medium leading-tight text-emerald-700">
              +62 31 9984 3222
            </div>
            <div className="text-sm font-medium leading-tight text-emerald-700">
              +62 31 9984 3311
            </div>
            <div className="text-sm font-medium leading-tight text-emerald-700">
              mail@avianbrands.com
            </div>
          </div>
          <div className="bg-warmGray-300 css-s6brwz" />
          <div className="flex self-stretch flex-col space-y-2.5 items-center justify-start p-1">
            <div className="text-sm font-medium leading-tight text-center text-green-900">
              Terhubung dengan kami di:
            </div>
            <div className="flex self-stretch items-center justify-between px-5">
              <a href="https://www.facebook.com/AvianBrands/" target="_blank">
                <img
                  src="/imgs/icon-fb.svg"
                  className="flex flex-col items-start justify-start css-362ogc"
                />
              </a>
              <a
                href="https://www.youtube.com/user/avianbrands"
                target="_blank"
              >
                <img
                  src="/imgs/icon-yt.svg"
                  className="flex flex-col items-start justify-start css-1d8yams"
                />
              </a>
              <a href="https://www.instagram.com/avianbrands/" target="_blank">
                <img
                  src="/imgs/icon-ig.svg"
                  className="flex flex-col items-start justify-start css-1twpnv9"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/pt-avia-avian/"
                target="_blank"
              >
                <img
                  src="/imgs/icon-linkdin.svg"
                  className="flex flex-col items-start justify-start css-1qv3agd"
                />
              </a>
              <a
                href="https://www.tiktok.com/@avian.brands?lang=en"
                target="_blank"
              >
                <img
                  src="/imgs/icon-tiktok.svg"
                  className="flex flex-col items-start justify-start css-1twpnv9"
                />
              </a>
            </div>
          </div>
          <div className="bg-warmGray-300 css-s6brwz" />
          <div className="flex self-stretch flex-col items-center justify-start">
            <div className="flex self-stretch flex-col space-y-4 items-center justify-start">
              <div className="text-xs leading-none text-center text-trueGray-500">
                Copyright © 2021 Avian Brands. All Right Reserved.
              </div>
              <div className="text-xs leading-none text-center text-trueGray-500">
                Avian Brands ID 33.1.1 (b311088, dB)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="css-lvn1gy" />
    </>
  )
}
