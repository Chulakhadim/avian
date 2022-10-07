import { Modal } from 'web-ui'
import { useGlobal, useLocal } from 'web-utils'
import { globalProduk } from '../base/global/produk'
import { CloseIcon } from './top-icons'

export const AvianProdukBeli = () => {
  const meta = useGlobal(globalProduk)
  const local = useLocal({
    modalBeli: false,
  })
  if (!meta.detail.is_beli) return null
  return (
    <>
      <div
        className="flex self-stretch items-center justify-center px-2.5 py-3 bg-green-500 shadow rounded btn-fade text-sm font-medium leading-none text-white"
        onClick={() => {
          local.modalBeli = true
          local.render()
        }}
      >
        Beli Sekarang
      </div>
      <Modal
        show={local.modalBeli}
        onClose={() => {
          local.modalBeli = false
          local.render()
        }}
      >
        <div className="p-6 bg-white w-4/5 relative">
                    <button
            onClick={() => {
              local.modalBeli = false
              local.render()
            }}
            className="border-none outline-none cursor-pointer group py-1 px-2 absolute top-0 right-1"
          >
            <>
              <CloseIcon/>
            </>
          </button>
          <div className="text-black-500 text-lg font-semibold text-center mt-3">
            Belanja Sekarang di
            <br />
            Official Store Tokopedia
          </div>

          <div
            className="mt-5 flex self-stretch items-center justify-center px-2.5 py-1.5 border border-green-700 btn-fade"
            onClick={(ev) => {
              window.open('https://www.tokopedia.com/avianjakarta', '_blank')
              ev.stopPropagation()
            }}
          >
            <div
              className="text-xs font-medium leading-none text-green-700"
              css={css`
                padding: 6px;
              `}
            >
              Avian Brands Jakarta
            </div>
          </div>
          <div
            className="mt-5 flex self-stretch items-center justify-center px-2.5 py-1.5 border border-green-700 btn-fade"
            css={css`
              margin-top: 10px;
            `}
            onClick={(ev) => {
              window.open('https://www.tokopedia.com/aviansurabaya', '_blank')
              ev.stopPropagation()
            }}
          >
            <div
              className="text-xs font-medium leading-none text-green-700"
              css={css`
                padding: 6px 0;
              `}
            >
              Avian Brands Surabaya
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
