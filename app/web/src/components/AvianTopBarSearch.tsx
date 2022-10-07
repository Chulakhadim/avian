import { useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useInitMobile } from 'web-ui/src/mobile/utils/use-init-mobile'
import { useGlobal, useLocal } from 'web-utils'
import { globalSearch } from '../base/global/search'
import { IconCodeLoad } from './top-icons'

const AvianTopBarSearch = () => {
  const mobile = useInitMobile()

  const state = useGlobal(globalSearch, () => {
    state.keyword = ''
    state.search = ''
    state.allProductsColors.length = 0
    state.render()
  })

  const local = useLocal({
    h: window.innerHeight,
  })

  useEffect(() => {
    loadPopularProducts()
    loadColors() // getInfoDevice()
  }, [])

  useEffect(() => {
    loadProducts()
    loadColors()
  }, [state.keyword])

  const loadPopularProducts = async () => {
    state.loading = true
    state.render()

    const q =
      await db.query(`SELECT product.id,product.name,product.image_url FROM dtb_product AS product 
          INNER JOIN dtb_product_search AS product_search
            ON product.id = product_search.product_id
          WHERE LOWER(product.name) LIKE '%${state.keyword}%' LIMIT 2`)

    state.popularProducts = q
    state.loading = false
    state.render()
  }

  const loadProducts = async () => {
    state.loading = true
    state.render()

    const q = await db.query(
      `SELECT id,name,image_url FROM dtb_product AS product WHERE LOWER(product.name) LIKE '%${state.keyword}%' limit 10`
    )
    state.products = q
    state.allProductsColors.push(...q)
    state.loading = false
    state.render()
  }

  const loadColors = async () => {
    state.loading = true
    state.render()

    const q = await db.query(
      `SELECT id,name,lab_code,hex FROM mst_pallete_color AS color WHERE LOWER(color.name) LIKE '%${state.keyword}%' limit 10`
    )

    state.colors = q
    state.allProductsColors.push(...q)
    state.loading = false
    state.render()
  }

  let typingTimer: any
  let timeout = 1000

  const handleSearch = (e: any) => {
    if (e.target.value === ' ') return
    state.search = e.target.value.toLowerCase()
    state.render()

    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      state.allProductsColors.length = 0
      state.keyword = e.target.value.toLowerCase()
      state.render()
    }, timeout)
  }

  const handleResetSearch = () => {
    state.keyword = ''
    state.search = ''
    state.allProductsColors.length = 0
    state.render()
  }

  const styles = {
    search: {
      height: '32px',
      padding: '6px 34px',
    },
    searchIcon: {
      width: '160px',
      height: '160px',
    },
  }

  const renderProducts = () => (
    <>
      {state.products?.map((item: any, idx: any) => (
        <div
          key={idx}
          className={`${
            state.products.length !== idx + 1 && 'border-b-2'
          } px-6 py-3`}
        >
          <a href={`/produk/detail/${item.id}`}>
            <Product item={item} />
          </a>
        </div>
      ))}
    </>
  )

  const renderPopularProducts = () => (
    <>
      {state.popularProducts?.map((item: any, idx: any) => (
        <div
          key={idx}
          className={`${
            state.popularProducts.length !== idx + 1 && 'border-b-2'
          } px-6 py-3`}
        >
          <a href={`/produk/detail/${item.id}`}>
            <Product item={item} />
          </a>
        </div>
      ))}
    </>
  )

  const renderPopularColors = () => (
    <>
      {state.colors.slice(2, 4)?.map((col: any, idx: any) => (
        <div
          key={idx}
          className={`${
            state.colors.slice(2, 4).length !== idx + 1 && 'border-b-2'
          } px-6 py-3 rounded`}
        >
          <a href={`/warna/preview/${col.id}/true`}>
            <div className="flex items-center gap-4 font-bold">
              <div
                css={css`
                  width: 64px;
                  height: 62px;
                  background-color: ${col.hex};
                `}
              ></div>
              <div className="flex flex-col gap-1">
                <div className="text-avian-green2">{col.name}</div>
                <div className="text-avian-green2">{col.lab_code}</div>
              </div>
            </div>
          </a>
        </div>
      ))}
    </>
  )

  const renderColors = () => (
    <>
      {state.colors?.map((col: any, idx: any) => (
        <div
          key={idx}
          className={`${
            state.colors.length !== idx + 1 && 'border-b-2'
          } px-6 py-3 rounded`}
        >
          <a href={`/warna/preview/${col.id}/true`}>
            <div className="flex items-center gap-4 font-bold">
              <div
                css={css`
                  width: 64px;
                  height: 62px;
                  background-color: ${col.hex};
                `}
              ></div>
              <div className="flex flex-col gap-1">
                <div className="text-avian-green2">{col.name}</div>
                <div className="text-avian-green2">{col.lab_code}</div>
              </div>
            </div>
          </a>
        </div>
      ))}
    </>
  )

  const renderAllProductsColors = () => (
    <>
      {[...state.products.slice(0, 5), ...state.colors.slice(0, 5)].map(
        (item, idx) => (
          <div
            key={idx}
            className={`${
              [...state.products, ...state.colors].length !== idx + 1 &&
              'border-b-2'
            } px-6 py-3 rounded`}
          >
            {item.hex ? (
              <a href={`/warna/preview/${item.id}/true`}>
                <Color item={item} />{' '}
              </a>
            ) : (
              <a href={`/produk/detail/${item.id}`}>
                <Product item={item} />
              </a>
            )}
          </div>
        )
      )}
    </>
  )

  const renderTabs = () => (
    <div className="flex justify-between text-center filter drop-shadow-lg bg-white">
      {['Semua', 'Produk', 'Warna'].map((item, idx) => (
        <div
          key={idx}
          className={`${
            state.tabActive === item && 'avian-green3'
          } flex-1 py-2 rounded`}
          onClick={() => {
            state.tabActive = item
            state.render()
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )

  window.addEventListener('resize', () => {
    local.h = window.innerHeight
    local.render()
  })

  return (
    <div
      className="flex flex-col flex-1 z-50 bg-white px-2.5 pt-5 pb-16 overflow-none absolute inset-0"
      css={css`
        margin-top: ${50 + mobile.insets.top}px;
      `}
    >
      {}
      <div className="relative flex items-center inset-0 bg-red-100 z-100 top-0">
        <img
          src="/icons/ic-search-input.svg"
          className="absolute left-2 z-10"
        />
        <input
          onChange={handleSearch}
          placeholder="Cari Produk / Warna"
          className="w-full filter drop-shadow-md"
          value={state.search}
          css={styles.search}
        />
        {state.keyword && (
          <img
            onClick={handleResetSearch}
            src="/icons/close.svg"
            width="12"
            height="12"
            className="absolute right-2 z-10"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 m-2.5">
        {state.loading && (
          <>
            <IconCodeLoad />
            <IconCodeLoad />
          </>
        )}
        {(() => {
          if (!state.loading) {
            if (!state.keyword) {
              return (
                <>
                  <div className="font-bold">Produk Populer</div>
                  {renderPopularProducts()}
                  <div className="font-bold">Warna Populer</div>
                  {renderPopularColors()}
                </>
              )
            } else {
              return (
                <>
                  {renderTabs()}
                  <div
                    className="overflow-auto"
                    css={css`
                      height: ${local.h -
                      52 -
                      20 -
                      32 -
                      10 -
                      40 -
                      mobile.insets.top -
                      mobile.insets.bottom}px;
                    `}
                  >
                    {state.tabActive === 'Semua' ? (
                      [...state.products, ...state.colors].length ? (
                        renderAllProductsColors()
                      ) : (
                        <NotFound />
                      )
                    ) : state.tabActive === 'Produk' ? (
                      state.products.length ? (
                        renderProducts()
                      ) : (
                        <NotFound />
                      )
                    ) : state.colors.length ? (
                      renderColors()
                    ) : (
                      <NotFound />
                    )}
                  </div>
                </>
              )
            }
          }
        })()}
      </div>
    </div>
  )
}

export default AvianTopBarSearch

const Product = ({ item }: any) => {
  return (
    <div className="flex items-center gap-4 font-bold">
      {!!item.image_url && (
        <LazyLoadImage
          alt={item.name}
          height={62}
          src={`https://avianbrands.com${
            item.image_url[0] === '/' ? item.image_url : `/${item.image_url}`
          }`}
          width={64}
          effect="opacity"
        />
      )}

      <div className="text-avian-green2">{item.name}</div>
    </div>
  )
}

const Color = ({ item }: any) => {
  return (
    <div className="flex items-center gap-4 font-bold">
      <div
        css={css`
          width: 64px;
          height: 62px;
          background-color: ${item.hex};
        `}
      ></div>
      <div className="flex flex-col gap-1">
        <div className="text-avian-green2">{item.name}</div>
        <div className="text-avian-green2">{item.lab_code}</div>
      </div>
    </div>
  )
}

const NotFound = () => {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <img
        src="/icons/ic-search-not-found.svg"
        alt="search"
        css={css`
          width: '160px';
          height: '160px';
        `}
      />
      <div className="text-avian-grey2">Tidak ada hasil yang ditemukan</div>
    </div>
  )
}
