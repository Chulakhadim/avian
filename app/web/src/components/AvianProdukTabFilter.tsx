import orderBy from 'lodash.sortby'
import { useGlobal } from 'web-utils'
import { globalProduk } from '../base/global/produk'
import { checkAll } from './AvianProdukFilter'
import { ProgressBar } from './loader-icons'
import { nest } from './utils'

export const AvianProdukTabFilter = ({ cat, catid }: any) => {
  const meta = useGlobal(globalProduk, async () => {
    if (meta.solutions.length === 0 || meta.categories.length === 0) {
      try {
        const sol = await db.query(
          'SELECT sol.id, sol.name,sol.name_en, sol.order, sol.id_parent, sol.content FROM mst_solution as sol'
        )
        const cat = await db.query(
          'SELECT cat.id, cat.name,cat.name_en, cat.order, cat.id_parent, cat.content FROM mst_category as cat'
        )
        meta.solutions = orderBy(nest(sol), ['order'], ['asc'])
        meta.categories = orderBy(nest(cat), ['order'], ['asc'])

        if (!!catid) {
          let idx: any
          if (cat === 'solusi') {
            idx = meta.solutions.findIndex((x) => x.id === Number(catid))
          } else {
            idx = meta.categories.findIndex((x) => x.id === Number(catid))
          }
          checkAll(meta.categories[idx], true)
          meta.categories[idx].checked = true
          meta.categories[idx]._checked = true
        }
        meta.render()
      } catch (e) {
        console.log(e)
      }
    }
  })
  const tabFilter = meta.tab === 'solusi' ? meta.solutions : meta.categories
  return (
    <div className=" overflow-auto z-20 w-full pb-3 pt-2 flex space-x-2.5 items-center justify-start px-2.5">
      <div
        className="h-7 flex space-x-1 items-center justify-center px-2.5 py-1.5 bg-white btn-fade shadow border rounded border-gray-500"
        onClick={() => {
          meta.openFilter = true
          meta.render()
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 rounded-full"
          fill="none"
          css={css`
            transform: rotate(90deg);
          `}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        <p className="text-xs font-medium leading-none text-gray-500">Filter</p>
      </div>
      {tabFilter.length === 0 && <ProgressBar />}
      {tabFilter.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-center px-2.5 py-1.5 ${
            item._checked ? 'avian-green3 text-white' : 'bg-white'
          } shadow rounded min-w-min border border-gray-500`}
          css={{
            height: 29,
          }}
          onClick={() => {
            item._checked = !item._checked
            checkAll(item, item._checked)
            meta.render()
            meta.filterProduct()
          }}
        >
          <label className="whitespace-nowrap text-xs font-medium leading-none">
            {item.name}
          </label>
        </div>
      ))}
    </div>
  )
}
