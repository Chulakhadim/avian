import { page } from 'web-init'
import { useLocal } from 'web-utils'
import { IconCodeLoad } from '../../components/top-icons'

export default page({
  url: '/pemasaran',
  layout: 'top-only',
  component: ({ layout }) => {
    const state = useLocal(
      { tabActive: 'Agen', filter: '', list: [] as any, loading: true },
      async () => {
        state.list = await db.dtb_branch.findMany({
          where: {
            type: {
              in: [1, 2],
            },
          },
        })
        state.loading = false
        state.render()
      }
    )
    return (
      <div className="flex flex-col h-screen">
        <img src="/imgs/pemasaran.jpg" />

        <div className="flex flex-col px-3">
          <div className="py-4 text-sm">
            Dengan kantor cabang yang tersebar pada seluruh area di Indonesia,
            PT Tirtakencana Tatawarna mampu menyalurkan produk ke lebih dari
            59.000 toko.
          </div>

          <div className="relative flex items-center">
            <img
              src="/imgs/ic-search-input.svg"
              className="absolute left-2 z-10"
            />
            <input
              placeholder={
                state.tabActive === 'Agen' ? 'Cari Agen' : 'Cari Cabang'
              }
              className="w-full filter drop-shadow-md"
              css={css`
                height: 40px;
                padding: 6px 34px;
              `}
              onChange={(e) => {
                const val = e.target.value
                state.filter = val
                state.render()
              }}
            />
          </div>

          <div
            className={`flex filter drop-shadow-lg mt-2 rounded-sm mb-3 ${
              window.innerWidth <= 375 ? 'text-sm' : ''
            }`}
          >
            {['Agen', 'Tirtakencana Tatawarna'].map((item, idx) => (
              <div
                key={idx}
                className={`${
                  state.tabActive === item ? 'avian-green3' : 'bg-white'
                } flex-1 text-center p-2 rounded-sm flex items-center justify-center`}
                onClick={() => {
                  state.tabActive = item
                  state.render()
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div
            className="overflow-auto"
            css={css`
              height: calc((${window.innerHeight - 50 - 215.5 - 92 - 40 - 40 - 35}px) - env(safe-area-inset-bottom) - env(safe-area-inset-top));
            `}
          >
            {state.loading && (
              <>
                <IconCodeLoad />
                <IconCodeLoad />
                <IconCodeLoad />
              </>
            )}
            {state.list.map((item: any, idx: number) => {
              if (state.tabActive === 'Agen') {
                if (item.type !== 2) return null
              } else {
                if (item.type !== 1) return null
              }

              if (
                state.filter &&
                item.name.toLowerCase().indexOf(state.filter.toLowerCase()) < 0
              ) {
                return null
              }

              return (
                <div
                  key={idx}
                  css={css`
                    height: 40px;
                  `}
                  className="text-avian-black border-b flex items-center text-sm"
                >
                  {item.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  },
})
