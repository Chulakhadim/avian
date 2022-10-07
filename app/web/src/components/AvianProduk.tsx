import { useGlobal } from 'web-utils'
import { globalProduk } from '../base/global/produk'
import { AvianProdukFilter } from './AvianProdukFilter'
import { AvianProdukList } from './AvianProdukList'
import { AvianProdukTabFilter } from './AvianProdukTabFilter'

export const AvianProduk = ({ cat, catid }: any) => {
  const meta = useGlobal(globalProduk, () => {})

  //   const action = {
  //     fetchProduct: async () => {
  //       const prod = await db.dtb_product.findMany({
  //         include: {
  //           mst_category: true,
  //         },
  //         where: {
  //           is_show: 1,
  //         },
  //         orderBy: {
  //           order: 'asc',
  //         },
  //       })

  //       const sellingPoint = await db.query(`SELECT
  //             mst_product_selling_point.id_product,
  //             mst_selling_point.name,
  //             mst_selling_point.icon_url
  //             FROM mst_selling_point
  //             JOIN mst_product_selling_point ON (mst_product_selling_point.id_selling_point = mst_selling_point.id)`)
  //       const solusi = prod.filter((x: any) => x.id_solution.id.length > 0)
  //       const category = prod.filter((x) => x.id_category)

  //       const groupProduct = (data: any) => {
  //         return data.reduce((result: any, item: any) => {
  //           const produk_selling = sellingPoint.filter(
  //             (selling: any) => Number(selling.id_product) === Number(item.id)
  //           )
  //           const _product = { ...item, selling: produk_selling }
  //           return result.length === 0 ? [_product] : [...result, _product]
  //         }, [])
  //       }

  //       const produkSolusi = groupProduct(solusi)
  //       const produkCategory = groupProduct(category)
  //       meta.solusi = [...produkSolusi]
  //       meta.category = [...produkCategory]
  //       meta.list = meta.tab == 'solusi' ? [...meta.solusi] : [...meta.category]
  //       meta.loading = false
  //       meta.render()
  //     },
  //   }

  return (
    <div className="flex flex-1 self-stretch flex-col items-center justify-start bg-white">
      <div
        className={`flex self-stretch items-center justify-start bg-white shadow  overflow-hidden`}
      >
        <div
          className={`flex flex-1 items-start justify-center px-2.5 py-2 bg-white ${
            meta.tab === 'solusi' && 'avian-green3'
          }`}
          onClick={() => {
            meta.tab = 'solusi'
            meta.product.loading = true
            meta.product.list = [...meta.product.solutions]
            meta.render()
            setTimeout(() => {
              meta.product.scrollTop = 0
              meta.product.loading = false
              meta.render()
            }, 100)
          }}
        >
          <div className={`text-sm  leading-tight text-trueGray-500`}>
            Solusi Avian Brands
          </div>
        </div>
        <div
          className={`flex flex-1 self-stretch items-start justify-center px-2.5 py-2 bg-white  ${
            meta.tab === 'kategori' && 'avian-green3'
          }`}
          onClick={() => {
            meta.tab = 'kategori'
            meta.product.loading = true
            meta.product.list = [...meta.product.categories]
            meta.render()
            setTimeout(() => {
              meta.product.scrollTop = 0
              meta.product.loading = false
              meta.render()
            }, 100)
          }}
        >
          <div className={`text-sm leading-tight text-trueGray-500`}>
            Kategori
          </div>
        </div>
      </div>
      <AvianProdukTabFilter cat={cat} catid={catid} />
      <AvianProdukFilter />
      <AvianProdukList cat={cat} />
    </div>
  )
}
