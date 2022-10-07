import { page } from 'web-init'
import { useGlobal } from 'web-utils'
import { AvianProduk } from '../../components/AvianProduk'
import { globalProduk } from '../global/produk'

export default page({
  url: '/produk/:cat?/:catid?',
  component: ({ layout }) => {
    const produk = useGlobal(globalProduk, () => {
      if (!!params.cat) {
        produk.tab = params.cat
        produk.render()
      }
    })
    return (
      <>
        {!produk.tab ? (
          <div className="flex flex-1 self-stretch flex-col space-y-5 items-stretch justify-start p-5">
            <div className="text-base font-bold text-center text-green-900">
              Pilih Produk Berdasarkan
            </div>
            <div className="flex flex-1 flex-col space-y-2.5 items-stretch just">
              <div
                className="flex flex-1 flex-col items-center justify-center rounded-lg"
                onClick={() => {
                  produk.tab = 'solusi'
                  produk.render()
                }}
                css={css`
                  background-image: url('/imgs/bg-produk-1.png');
                  background-size: 100% 100%;
                  background-repeat: no-repeat;
                `}
              >
                <div className="text-2xl font-bold text-white">Solusi</div>
              </div>
              <div
                className="flex flex-1 flex-col items-center justify-center rounded-lg"
                onClick={() => {
                  produk.tab = 'kategori'
                  produk.render()
                }}
                css={css`
                  background-image: url('/imgs/bg-produk-2.png');
                  background-size: 100% 100%;
                  background-repeat: no-repeat;
                `}
              >
                <div className="text-2xl font-bold text-white">Kategori</div>
              </div>
            </div>
          </div>
        ) : (
          <AvianProduk {...params} />
        )}
      </>
    )
  },
})
