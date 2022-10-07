import { useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Modal } from 'web-ui'
import { useGlobal, useLocal } from 'web-utils'
import { globalWarna } from '../base/global/warna'
import { globalWarnaProduk } from '../base/global/warna-produk'
import AvianWarnaProdukFilter from './AvianWarnaProdukFilter'
import { IconCodeLoad } from './top-icons'
import { lightOrDark, nest, urlMedia, WebStore } from './utils'

type mst_pallete_color = {
  id: number
  id_color_inspiration: number
  name: string
  lab_code: string
  l: any
  a: any
  b: any
  rgb: string | null
  hex: string | null
  type: string
  status: string
  created_at: Date | null
  order: number | null
  kartu_warna: number | null
}

export const AvianWarnaProduk = () => {
  if (!params.cid) {
    return <></>
  }

  const { cid } = params

  const meta = useGlobal(globalWarnaProduk, () => {
    if (meta.color?.id != params.cid) {
      meta.loading = true
      meta.render()
      loadColor().then(async () => {
        await isFavorit()
        await loadProducts()
        meta.loading = false
        meta.render()
      })
    }
  })

  const isFavorit = async () => {
    let status = false
    const itemsStr = await WebStore.get('color-favorite')
    const items = JSON.parse(itemsStr || '[]')
    let idx = items.findIndex((x: mst_pallete_color) => x.id === meta.color?.id)
    if (idx > -1) {
      status = true
    }
    meta.isFavourit = status
  }

  const loadColor = async () => {
    meta.color = await db.mst_pallete_color.findFirst({
      where: {
        id: Number(cid),
      },
    })
  }

  const loadProducts = async () => {
    meta.loading = true
    meta.render()

    meta.color = await db.mst_pallete_color.findFirst({
      where: {
        id: Number(cid),
      },
    })
    const colorType = meta.color?.type
    const products = await db.query(`
        SELECT categories, position, pengencer,surface, application_area, end_result, product.id AS product_id,product.pretty_url,product.name AS product_name,product.image_url 
        FROM dtb_product AS product 
        WHERE product.is_170 = ${!!colorType} OR product.is_888 = ${!!colorType} AND product.status = 1
        ORDER BY product.order
    `)

    if (!!meta.color && meta.color?.kartu_warna === 1) {
      const oneCoat =
        await db.query(`SELECT categories, position, pengencer,surface, application_area, end_result, product.id AS product_id,product.pretty_url,product.name AS product_name,product.image_url 
        FROM dtb_product AS product WHERE product.id = 83`)
      products.unshift(oneCoat[0])
    }

    const sellings = await db.query(`
        SELECT psp.id_product, sp.name,sp.icon_url FROM mst_product_selling_point AS psp
        JOIN mst_selling_point AS sp
            ON sp.id = psp.id_selling_point
        ORDER BY psp.id
    `)

    meta.products = products.reduce((result: any, item: any) => {
      const productSellings = sellings.filter(
        (sell: any) => item.product_id === sell.id_product
      )
      const products = { ...item, sellings: productSellings }
      return [...result, products]
    }, [])

    meta.productsOrigin = [...meta.products]
    meta.render()
  }

  const getProducts = async (filter: any) => {
    if (filter.length > 0) {
      meta.products = await meta.productsOrigin.reduce(
        (results, item: any, i): any => {
          let intersection = [] as any

          if (item.position && item.position.position) {
            intersection = [
              ...intersection,
              ...item.position.position.filter((x: any) => filter.includes(x)),
            ]
          }

          if (item.pengencer && item.pengencer.pengencer) {
            intersection = [
              ...intersection,
              ...item.pengencer.pengencer.filter((x: any) =>
                filter.includes(x)
              ),
            ]
          }

          if (item.surface && item.surface.surface) {
            intersection = [
              ...intersection,
              ...item.surface.surface.filter((x: any) => filter.includes(x)),
            ]
          }

          if (item.application_area && item.application_area.application_area) {
            intersection = [
              ...intersection,
              ...item.application_area.application_area.filter((x: any) =>
                filter.includes(x)
              ),
            ]
          }

          if (item.end_result && item.end_result.end_result) {
            intersection = [
              ...intersection,
              ...item.end_result.end_result.filter((x: any) =>
                filter.includes(x)
              ),
            ]
          }

          if (filter.length !== 0 && intersection.length == filter.length) {
            return results.length === 0 ? [item] : [...results, item]
          } else {
            return results
          }
        },
        []
      )
    } else meta.products = meta.productsOrigin

    meta.loading = false
    meta.render()
  }

  const Warna = () => (
    <div
      className="w-full h-56"
      css={css`
        background-color: ${meta.color?.hex};
      `}
    >
      <div className="h-56 text-white relative">
        <div
          onClick={async () => {
            const itemsStr = await WebStore.get('color-favorite')
            const items = JSON.parse(itemsStr || '[]')
            let idx = items.findIndex(
              (x: mst_pallete_color) => x.id === meta.color?.id
            )
            if (idx > -1) {
              items.splice(idx, 1)
              meta.isFavourit = false
            } else {
              items.push(meta.color)
              meta.isFavourit = true
            }
            WebStore.set('color-favorite', JSON.stringify(items))
            meta.render()
          }}
          className="w-5 h-5 m-2.5 absolute right-0 cursor-pointer"
        >
          {meta.isFavourit ? (
            <img
              className={`${
                lightOrDark(meta.color?.hex) === 'light' && 'filter invert'
              }`}
              src={`/icons/ic-fav-aktif.png`}
              alt=""
            />
          ) : (
            <img
              className={`${
                lightOrDark(meta.color?.hex) === 'light' && 'filter invert'
              }`}
              src={`/icons/ic-fav-nonaktif.png`}
              alt=""
            />
          )}
        </div>
        <div className="absolute bottom-0 p-2.5">
          <div
            className={`text-sm font-medium leading-tight text-white ${
              lightOrDark(meta.color?.hex) === 'light' && 'text-gray-700'
            }`}
          >
            <div>{meta.color?.name}</div>
            <div>{meta.color?.lab_code}</div>
          </div>
        </div>
      </div>
    </div>
  )

  const Products = () => (
    <div className="flex flex-1 self-stretch flex-col items-center justify-start bg-white">
      <div className="grid grid-cols-2">
        {meta.products.map((item: any, idx) => (
          <a
            key={idx}
            href={`/produk/detail/${item.product_id}`}
            className={`flex flex-1 mx-1 my-1 self-stretch flex-col space-y-2.5 items-center justify-start p-2.5 bg-white border rounded border-warmGray-300 `}
          >
            <div
              css={css`
                opacity: ${item._error ? 0.3 : 1};
                width: 128px;
                height: 137px;
              `}
            >
              <LazyLoadImage
                src={urlMedia(encodeURI(item.image_url))}
                css={css`
                  opacity: ${item._error ? 0.3 : 1};
                `}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = '/imgs/product-not-found.svg'
                }}
              />
            </div>
            <div className="flex self-stretch flex-col space-y-1 items-start justify-start">
              <div className="text-sm font-bold text-green-700">
                {item.product_name}
              </div>
              <div className="flex flex-col space-y-1 items-center justify-start">
                {item.sellings.slice(0, 3).map((items: any, idx: any) => (
                  <div
                    key={idx}
                    className="flex self-stretch space-x-1 items-center justify-start"
                  >
                    <img src="/imgs/1104_31361.x1.svg" />
                    <div className="text-xs text-gray-800">{items.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )

  return (
    <div
      className="flex flex-col flex-1 bg-white overflow-auto"
      ref={(e) => {
        if (e) {
          e.scrollTop = meta.scrollTop
        }
      }}
      onScroll={(e: any) => {
        meta.scrollTop = e.target.scrollTop
      }}
    >
      {meta.loading ? (
        <div className="p-6">
          <IconCodeLoad />
          <IconCodeLoad />
          <IconCodeLoad />
        </div>
      ) : (
        <>
          <Warna />
          <AvianWarnaProdukFilter
            onUseFilter={(filter) => getProducts(filter)}
            colorId={cid}
            style={{
              transition: 'all 1s',
            }}
          />
          <Products />
        </>
      )}
    </div>
  )
}
