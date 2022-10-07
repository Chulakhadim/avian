import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useGlobal } from 'web-utils'
import { globalProduk } from '../base/global/produk'
import { IconCodeLoad } from './top-icons'
import { urlMedia } from './utils'

export const AvianProdukList = ({ cat }: any) => {
  const meta = useGlobal(globalProduk, async () => {
    if (meta.product.list.length === 0) await fetchProduk()
    meta.filterProduct = async () => {
      meta.product.loading = true
      meta.product.scrollTop = 0
      meta.render()

      const filterList = [] as any[]

      const list = meta.tab === 'solusi' ? meta.solutions : meta.categories
      const walkChild = (list: any[]) => {
        for (let i of list) {
          if (i._checked && i.children.length === 0) {
            filterList.push(i)
          }
          if (i.children) {
            walkChild(i.children)
          }
        }
      }
      walkChild(list)

      const ids = {} as any
      filterList.map((e) => (ids[e.id] = true))

      meta.product.list =
        meta.tab == 'solusi' ? meta.product.solutions : meta.product.categories

      if (Object.keys(ids).length > 0) {
        meta.product.list = meta.product.list.filter((product) => {
          if (meta.tab === 'solusi') {
            for (let i of product.id_solution.id) {
              if (ids[i]) return true
            }
          } else {
            if (ids[product.id_category]) return true
          }
          return false
        })
      }
      meta.product.loading = false
      meta.render()
    }

    if (!!cat) {
      meta.filterProduct()
    }
  })

  const fetchProduk = async () => {
    meta.product.loading = true
    meta.render()
    const prod = await db.dtb_product.findMany({
      include: {
        mst_category: true,
      },
      where: {
        is_show: 1,
      },
      orderBy: {
        order: 'asc',
      },
    })

    const sellingPoint = await db.query(`SELECT 
            mst_product_selling_point.id_product,
            mst_selling_point.name, 
            mst_selling_point.icon_url 
            FROM mst_selling_point 
            JOIN mst_product_selling_point ON (mst_product_selling_point.id_selling_point = mst_selling_point.id)`)
    const solution = prod.filter((x: any) => x.id_solution.id.length > 0)
    const category = prod.filter((x: any) => x.id_category)

    const groupProduct = (data: any) => {
      return data.reduce((result: any, item: any) => {
        const produk_selling = sellingPoint.filter(
          (selling: any) => Number(selling.id_product) === Number(item.id)
        )
        const _product = { ...item, selling: produk_selling }
        return result.length === 0 ? [_product] : [...result, _product]
      }, [])
    }

    meta.product.solutions = groupProduct(solution)
    meta.product.categories = groupProduct(category)
    meta.product.list =
      meta.tab == 'solusi' ? meta.product.solutions : meta.product.categories
    meta.product.loading = false
    meta.render()
  }

  return (
    <div className="flex flex-1 relative self-stretch mx-2 overflow-hidden">
      {meta.product.loading ? (
        <div className="flex flex-col space-y-10 items-center justify-center py-10 flex-1">
          <IconCodeLoad />
          <IconCodeLoad />
          <IconCodeLoad />
        </div>
      ) : (
        <>
          <div
            className="absolute pointer-events-none"
            css={css`
              z-index: 10;
              box-shadow: 0px 5px 7px 7px white;
              height: 5px;
              top: -11px;
              left: -10px;
              right: -15px;
            `}
          ></div>
          <div
            className="absolute inset-0 overflow-auto overflow-x-hidden"
            ref={(e) => {
              if (e) {
                e.scrollTop = meta.product.scrollTop
              }
            }}
            onScroll={(e: any) => {
              meta.product.scrollTop = e.target.scrollTop
            }}
          >
            <div className="grid grid-cols-2">
              {meta.product.list
                .filter(
                  (e, i, s) => {
                    return s.findIndex((x: any) => x.name === e.name) === i
                  }
                )
                .map((item, idx) => (
                  <a
                    key={idx}
                    href={`/produk/detail/${item.id}`}
                    className={`relative flex flex-1 mx-1 my-1 self-stretch flex-col space-y-2.5 items-center justify-start p-2.5 bg-white border rounded border-warmGray-300 btn-fade `}
                  >
                    {!!item.image_url && (
                      <div
                        css={css`
                          opacity: ${item._error ? 0.3 : 1};
                          width: 128px;
                          height: 137px;
                        `}
                      >
                        <LazyLoadImage
                          src={urlMedia(item.image_url)}
                          css={css`
                            opacity: ${item._error ? 0.3 : 1};
                          `}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = '/imgs/product-not-found.svg'
                          }}
                        />
                      </div>
                    )}
                    <div className="absolute left-0 -top-2.5 flex flex-col gap-2">
                      {item.is_new && <img src="/icons/ic-baru.svg" alt="" />}
                      {item.is_promo && (
                        <img src="/icons/ic-promo.svg" alt="" />
                      )}
                    </div>
                    <div className="flex self-stretch flex-col space-y-1 items-start justify-start">
                      <div className="text-sm font-bold text-green-700">
                        {item.name}
                      </div>
                      <div className="flex flex-col space-y-1 items-center justify-start">
                        {Array.isArray(item.selling) &&
                          item.selling
                            .map((items: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex self-stretch space-x-1 justify-start"
                              >
                                <div>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={12}
                                    height={16}
                                    fill="none"
                                  >
                                    <path
                                      d="m2.5 8.667 2 2.666 5-6.666"
                                      stroke="#3EB049"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                                <div className="text-xs text-gray-800">
                                  {items.name}
                                </div>
                              </div>
                            ))
                            .slice(0, 3)}
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
