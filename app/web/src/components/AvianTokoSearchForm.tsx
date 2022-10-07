import { FC, useCallback, useRef } from 'react'
import { useVirtual } from 'react-virtual'
import { Form, Modal } from 'web-ui'
import { niceCase } from 'web-ui/src/form/utils/nice-case'
import { fuzzyMatch, useGlobal, useTree } from 'web-utils'
import { globalToko } from '../base/global/toko'
import { BackIcon } from './top-icons'

export const AvianTokoSearchForm = () => {
  const meta = useGlobal(globalToko)

  return (
    <div className="absolute inset-0 flex flex-1 overflow-auto">
      <Form
        className="flex flex-1 h-full"
        css={css`
          height: calc((${window.innerHeight - 70 - 50}px) - env(safe-area-inset-bottom) - env(safe-area-inset-top));
        `}
        defaultValue={meta.filter}
        schema={{
          fields: {
            kategori: {
              type: 'custom',
              render: ({ ctx }) => {
                return (
                  <SelectForm
                    meta={meta}
                    name="kategori"
                    autoload={true}
                    onChange={() => {
                      meta.filter.options.produk.tree = null
                      meta.filter.data.produk = {}
                      meta.filter.options.produk.reload()
                    }}
                    placeholder="Pilih Kategori"
                    query={async ({ parent }) => {
                      meta.filter.options.kategori.loading = true
                      meta.render()
                      const res = await db.mst_category.findMany({
                        where: { id_parent: parent },
                        orderBy: { order: 'asc' },
                      })
                      meta.filter.options.kategori.loading = false
                      meta.render()
                      return res
                    }}
                  >
                    {(item) => item.name}
                  </SelectForm>
                )
              },
            },
            produk: {
              type: 'custom',
              render: () => {
                return (
                  <SelectForm
                    meta={meta}
                    name="produk"
                    placeholder="Pilih Produk"
                    onChange={() => {
                      meta.filter.options.toko.tree = null
                      meta.filter.data.toko = {}
                      meta.filter.options.toko.reload()
                    }}
                    query={async ({ parent }) => {
                      meta.filter.options.produk.loading = true
                      meta.render()
                      const where = {} as any
                      const kat = Object.keys(meta.filter.data.kategori)
                      if (kat.length > 0) {
                        where['id_category'] = {
                          in: kat.map((e) => parseInt(e)),
                        }
                      }

                      const res = await db.dtb_product.findMany({
                        select: { id: true, name: true },
                        where,
                        orderBy: {
                          order: 'asc',
                        },
                      })
                      meta.filter.options.produk.loading = false
                      meta.render()
                      return res
                    }}
                  >
                    {(item) => item.name}
                  </SelectForm>
                )
              },
            },
            lokasi: {
              type: 'custom',
              render: () => {
                return (
                  <SelectForm
                    meta={meta}
                    name="lokasi"
                    placeholder="Pilih Lokasi"
                    onChange={() => {
                      meta.filter.options.toko.tree = null
                      meta.filter.data.toko = {}
                      meta.filter.options.toko.reload()
                    }}
                    query={async ({ parent }) => {
                      meta.filter.options.lokasi.loading = true
                      meta.render()
                      const res = await db.mst_branch.findMany({
                        select: {
                          id: true,
                          name: true,
                          code: true,
                          latitude: true,
                          longitude: true,
                        },
                        orderBy: {
                          name: 'asc',
                        },
                        distinct: ['name'],
                      })
                      meta.filter.options.lokasi.loading = false
                      meta.render()
                      return res
                    }}
                  >
                    {(item) => item.name}
                  </SelectForm>
                )
              },
            },
            toko: {
              type: 'custom',
              render: () => {
                return (
                  <SelectForm
                    meta={meta}
                    name="toko"
                    placeholder="Pilih Toko"
                    query={async ({ parent }) => {
                      meta.filter.options.toko.loading = true
                      meta.render()
                      const where = {} as any

                      const lok = Object.values(meta.filter.data.lokasi)
                      if (lok.length > 0) {
                        where['OR'] = lok.map((e) => {
                          return {
                            store_id: {
                              startsWith: e.code,
                            },
                          }
                        })
                      }

                      const produk = Object.values(meta.filter.data.produk)
                      if (produk.length > 0) {
                        const storePoducts =
                          await db.mst_store_product.findMany({
                            where: {
                              product_id: {
                                in: produk.map((x) => Number(x.id)),
                              },
                              ...where,
                            },
                          })

                        if (storePoducts.length > 0)
                          where['OR'] = storePoducts.map((e) => {
                            return {
                              store_id: e.store_id,
                            }
                          })
                        else {
                          where['OR'] = [{ store_id: '' }]
                        }
                      }

                      const res = await db.mst_store.findMany({
                        select: {
                          id: true,
                          name: true,
                          lattitude: true,
                          longitude: true,
                        },
                        where,
                        orderBy: {
                          name: 'asc',
                        },
                        distinct: ['name'],
                      })
                      meta.filter.options.toko.loading = false
                      meta.render()
                      return res
                    }}
                  >
                    {(item) => item.name}
                  </SelectForm>
                )
              },
            },
          },
        }}
        layout={[
          'kategori',
          'produk',
          'lokasi',
          'toko',
          () => (
            <div
              css={css`
                padding-bottom: 58px;
              `}
            ></div>
          ),
          () => {
            return (
              <div className="flex self-stretch space-x-2.5 items-start justify-start p-2.5 w-full bg-white absolute bottom-0">
                <div
                  className="flex flex-1 btn-fade self-stretch items-center justify-center px-2.5 py-2.5 bg-white border rounded border-trueGray-500"
                  onClick={() => {
                    meta.selected = null
                    meta.filter.open = false
                    const filter = meta.filter.data as any
                    for (let i of Object.keys(filter)) {
                      ;(meta.filter.options as any)[i].flatten = {}
                      ;(meta.filter.data as any)[i] = {}
                    }
                    meta.render()
                    meta.map.redrawMarker()
                  }}
                >
                  <div className="font-medium leading-none text-trueGray-500">
                    Hapus Filter
                  </div>
                </div>
                <div
                  className="flex flex-1 btn-fade items-center justify-center px-2.5 py-2.5 bg-green-500 shadow rounded avian-green3"
                  onClick={() => {
                    meta.filter.open = false
                    meta.selected = null
                    meta.render()
                    meta.map.redrawMarker(true)
                  }}
                >
                  <div className="font-medium leading-none text-white">
                    Gunakan
                  </div>
                </div>
              </div>
            )
          },
        ]}
      />
    </div>
  )
}

const SelectModalForm: FC<{
  placeholder: string
  meta: typeof globalToko & { render: () => void }
  name: 'kategori' | 'produk' | 'lokasi' | 'toko'
  autoload?: boolean
  query: Parameters<typeof useTree>[0]['query']
  onChange?: () => void
  children: (item: any) => React.ReactElement
}> = ({ children, autoload, meta, name, query, onChange }) => {
  const toko = useGlobal(globalToko)
  const parentRef = useRef()
  const fopt = meta.filter.options[name]

  const tree = useTree({
    autoLoadChildren: !!autoload,
    onChange: () => {
      vrow.measure()
      toko.render()
    },
    onItemInit: (item: any, parent: any) => {
      if (parent) {
        if (val[parent.id]) {
          val[item.id] = item
        }
      }
    },
    onReady: () => {
      if (fopt.tree === null) {
        fopt.tree = tree.root
      }
      vrow.measure()
      meta.render()
    },
    primaryKey: 'id',
    query,
  })
  fopt.reload = tree.reload

  const walk = (tree: any) => {
    let child = 0
    if (tree && tree._tree)
      for (let i of tree._tree.children) {
        child++
        if (i && i._tree.children) {
          child += walk(i)
        }
      }
    return child
  }

  const vrow = useVirtual({
    size: (fopt.tree || []).length,
    estimateSize: useCallback(
      (i) => {
        if (!!fopt.search) return 1 * 50

        if (fopt.tree) {
          const row = fopt.tree[i]._tree
          if (row) {
            const count = walk(fopt.tree[i])
            return (1 + count) * 50
          }
        }
        return 0
      },
      [tree.root]
    ),
    parentRef,
  })

  let canSearch =
    !autoload || (autoload && Object.keys(tree.rowLoadings).length === 0)

  const val = meta.filter.data[name]

  return (
    <>
      <Modal
        animate={'left'}
        show={toko.filter.form === name}
        onClose={() => {
          toko.filter.form = ''
          meta.render()
        }}
      >
        <div
          className="flex flex-col flex-1 w-full h-full bg-white"
          css={css`
            padding: env(safe-area-inset-top) env(safe-area-inset-right)
              env(safe-area-inset-bottom) env(safe-area-inset-left);
          `}
        >
          <div
            className="p-2 border-b border-gray-300 flex items-center justify-between  font-semibold text-sm"
            css={css`
              height: 52px;
            `}
          >
            <div
              className="btn-fade px-2 flex items-center "
              onClick={() => {
                for (let i of Object.keys(val)) {
                  delete val[i]
                }
                meta.render()
              }}
            >
              <span className="p-2 text-gray-600">Hapus</span>
            </div>
            <div className="flex justify-center">
              {(fopt.tree || []).length} {niceCase(name)}
            </div>
            <div
              className="btn-fade flex items-center opacity-70"
              onClick={() => {
                toko.filter.form = ''
                meta.render()
                if (onChange) onChange()
              }}
            >
              <div className="p-2">Simpan</div>
            </div>
          </div>

          <input
            type="search"
            value={fopt.search}
            placeholder={!canSearch ? 'Loading...' : 'Filter'}
            className="outline-none focus:bg-blue-100"
            css={css`
              box-shadow: none !important;
              border: 0 !important;
              border-bottom: 1px solid #ccc !important;
            `}
            onChange={async (e) => {
              if (!canSearch) return
              fopt.search = e.target.value

              let list = tree.root
              if (fopt.search) {
                if (fopt.flatten.length === 0) {
                  fopt.flatten = tree.flatten()
                }
                list = fopt.flatten
              } else {
                fopt.flatten = []
              }

              fopt.tree = list.filter((e: any) => {
                if (fopt.search) {
                  // return fuzzyMatch(fopt.search, e.name)
                  return e.name.toLowerCase().indexOf(fopt.search.toLocaleLowerCase()) >= 0
                }
                return true
              })

              vrow.measure()
              meta.render()
            }}
          />
          {toko.filter.options[name].loading && !fopt.search && vrow.totalSize === 0 && (
            <div className="m-2 flex-1 flex flex-col items-center justify-center">
              Loading
              <div className="text-sm">Mengunduh Data...</div>
            </div>
          )}

          {vrow.totalSize === 0 && !toko.filter.options[name].loading && !fopt.search && (
            <div className="m-2 flex-1 flex flex-col items-center justify-center">
              Tidak ada data
            </div>
          )}

          {vrow.totalSize === 0 && fopt.search && (
            <div className="m-2 flex-1 flex flex-col items-center justify-center">
              Data yang dicari
              <br />
              tidak ditemukan
            </div>
          )}
          <div className={'relative flex-1 overflow-auto '}>
            <tree.Tree
              className="overflow-auto p-3 absolute inset-0"
              ref={parentRef}
              container={({ renderChild }) => {
                return (
                  <div
                    style={{
                      height: `${vrow.totalSize}px`,
                      width: '100%',
                      position: 'relative',
                    }}
                    className="border-b"
                  >
                    {vrow.virtualItems.map((virtualRow) => (
                      <div
                        key={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {renderChild({
                          item: (fopt.tree || [])[virtualRow.index],
                          index: virtualRow.index,
                        })}
                      </div>
                    ))}
                  </div>
                )
              }}
            >
              {({ item, TreeChildren, render }) => {
                const lv = item._tree.level + 1
                return (
                  <>
                    <div className={`flex flex-col`}>
                      <div
                        className={`border p-3 flex items-center`}
                        css={css`
                          padding-left: ${lv * 10}px;
                          border-bottom-color: transparent;
                        `}
                        onClick={() => {
                          const pk = (item as any).id
                          if (val[pk]) {
                            delete val[pk]
                          } else {
                            val[pk] = item
                          }

                          const walk = async (e: typeof item) => {
                            for (let child of e._tree.children) {
                              if (child._tree.status === 'init')
                                await tree.loadChildren(child)
                              const cpk = (child as any).id
                              if (!val[pk]) {
                                delete val[cpk]
                              } else {
                                val[cpk] = child
                              }

                              if (child._tree.children.length > 0) {
                                walk(child)
                              }
                            }
                          }

                          walk(item)

                          render()
                        }}
                      >
                        <div className="pr-2">
                          {!!val[(item as any).id] ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={15}
                              height={15}
                              fill="none"
                            >
                              <path fill="#3EB049" d="M0 0h15v15H0z" />
                              <path
                                d="m3.125 8.125 2.5 2.5 6.25-6.25"
                                stroke="#fff"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <div
                              css={css`
                                width: 15px;
                                height: 15px;
                                border: 1px solid #aaa;
                                background: white;
                              `}
                            ></div>
                          )}
                        </div>
                        {children(item)}
                      </div>
                      {!fopt.search && <TreeChildren />}
                    </div>
                  </>
                )
              }}
            </tree.Tree>
          </div>
        </div>
      </Modal>
    </>
  )
}

const SelectForm: FC<{
  placeholder: string
  meta: typeof globalToko & { render: () => void }
  name: 'kategori' | 'produk' | 'lokasi' | 'toko'
  autoload?: boolean
  query: Parameters<typeof useTree>[0]['query']
  onChange?: () => void
  children: (item: any) => React.ReactElement
}> = (props) => {
  const { placeholder, meta, name } = props
  const toko = useGlobal(globalToko)
  const val = meta.filter.data[name]

  return (
    <>
      <SelectModalForm {...props} />
      <div
        className="btn-fade flex-1 flex justify-between items-center"
        css={css`
          margin: -7px -12px;
          padding: 7px 12px;
        `}
        onClick={() => {
          if (!meta.filter.options[name].loading) {
            toko.filter.form = name
            meta.render()
          }
        }}
      >
        {Object.keys(val).length > 0 ? (
          <div className="flex flex-1 items-center flex-wrap text-xs">
            {Object.values(val).map((e, idx) => {
              if (idx > 3) return null
              if (idx === 3)
                return (
                  <div
                    key={idx}
                    className="border-green-600 text-green-600 border rounded-sm p px-2 mr-1 mb-1 font-bold"
                  >
                    {Object.keys(val).length - 2}+
                  </div>
                )
              return (
                <div
                  key={idx}
                  className="bg-green-200 rounded-sm p-1 px-2 mr-1 mb-1"
                >
                  {e.name}
                </div>
              )
            })}
          </div>
        ) : (
          <span className="opacity-50">
            {(meta.filter.options[name].tree || []).length === 0 &&
            meta.filter.options[name].loading
              ? 'Loading...'
              : placeholder}
          </span>
        )}
        <svg
          css={css`
            width: 16px;
            height: 16px;
            opacity: 0.5;
          `}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 185.343 185.343"
          xmlSpace="preserve"
        >
          <path
            style={{
              fill: '#010002',
            }}
            d="M51.707 185.343a10.692 10.692 0 0 1-7.593-3.149 10.724 10.724 0 0 1 0-15.175l74.352-74.347L44.114 18.32c-4.194-4.194-4.194-10.987 0-15.175 4.194-4.194 10.987-4.194 15.18 0l81.934 81.934c4.194 4.194 4.194 10.987 0 15.175l-81.934 81.939a10.678 10.678 0 0 1-7.587 3.15z"
          />
        </svg>
      </div>
    </>
  )
}
