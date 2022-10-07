/** @jsx jsx **/
import { css, jsx } from '@emotion/react'
import orderBy from 'lodash.sortby'
import cloneDeep from 'lodash.clonedeep'
import { nest } from './utils'
import { useEffect } from 'react'
import { useGlobal, useLocal } from 'web-utils'
import { Sidebar } from 'web-ui'
import { globalWarnaProdukFilter } from '../base/global/warna-produk'

interface IProps {
  onUseFilter: (filter: any) => void
  style?: any
  additionalFilter?: any[]
  removeAdditionalFilter?: (e: any) => void
  type?: 'solutions' | 'categories'
  colorId?: number
}

const searchTree: any = (el: any, id: any) => {
  if (el.id == id) {
    return el
  } else if (el.children != null) {
    let i
    let result = null

    for (i = 0; result == null && i < el.children.length; i++) {
      result = searchTree(el.children[i], id)
    }

    return result
  }

  return null
}

export const getFilterList = (data: any, res: any) => {
  if (Array.isArray(data)) {
    data.forEach((_data) => {
      const name = _data.value
      if (_data.checked) res.push(_data.value)
      if (!!name) getFilterList(name, res)
    })
  } else {
    const name = data.value
    if (data.checked) res.push(data.value)
    if (!!name) getFilterList(name, res)
  }

  return res
}
export const checkUncheck = (data: any, checked: any) => {
  data.checked = checked
  data._checked = checked
  return {
    ...data,
  }
}
export default (props: IProps) => {
  const meta = useGlobal(globalWarnaProdukFilter, () => {
    fetchCategory()
  })

  const fetchCategory = async () => {
    try {
      const color = await db.mst_pallete_color.findFirst({
        where: { id: Number(props.colorId) },
      })
      const products = await db.query(`
        SELECT categories, position, pengencer,surface, application_area, end_result, product.id AS product_id, product.pretty_url, product.name AS product_name, product.image_url 
        FROM  dtb_product AS product  
        WHERE product.is_170 = ${!!color?.type} OR product.is_888 = ${!!color?.type} AND product.status = 1
      `)

      let _filterPos = [
        {
          name: 'position',
          value: 'Posisi',
          checked: false,
          _checked: false,
          level: 0,
        },
      ] as any
      let _listPos = [] as any
      const _filterPosition = products
        .reduce((res: any, item: any, i: any) => {
          if (res.length === 0) {
            _listPos = item.position.position ? item.position.position : []
          } else {
            const _diff =
              item.position && item.position.position
                ? item.position.position.filter((i: any) => !res.includes(i))
                : []
            if (_diff.length > 0) {
              _listPos = [...res, ..._diff]
            }
          }

          return _listPos
        }, [])
        .map((item: any) => {
          return {
            name: 'position',
            value: item,
            checked: false,
            _checked: false,
            level: 1,
          }
        })
      _filterPos = [..._filterPos, ..._filterPosition]

      let _filterEncer = [
        {
          name: 'pengencer',
          value: 'Pengencer',
          checked: false,
          _checked: false,
          level: 0,
        },
      ] as any
      let _listEncer = [] as any
      const _filterPengencer = products
        .reduce((res: any, item: any, i: any) => {
          if (res.length === 0) {
            _listEncer = item.pengencer.pengencer
              ? item.pengencer.pengencer
              : []
          } else {
            const _diff =
              item.pengencer && item.pengencer.pengencer
                ? item.pengencer.pengencer.filter((i: any) => !res.includes(i))
                : []
            if (_diff.length > 0) {
              _listEncer = [...res, ..._diff]
            }
          }

          return _listEncer
        }, [])
        .map((item: any) => {
          return {
            name: 'pengencer',
            value: item,
            checked: false,
            _checked: false,
            level: 1,
          }
        })
      _filterEncer = [..._filterEncer, ..._filterPengencer]

      let _filterEnd = [
        {
          name: 'end_result',
          value: 'Hasil Akhir',
          checked: false,
          _checked: false,
          level: 0,
        },
      ] as any
      let _listEnd = [] as any
      const _filterEndResult = products
        .reduce((res: any, item: any, i: any) => {
          if (res.length === 0) {
            _listEnd = item.end_result.end_result
              ? item.end_result.end_result
              : []
          } else {
            const _diff =
              item.end_result && item.end_result.end_result
                ? item.end_result.end_result.filter(
                    (i: any) => !res.includes(i)
                  )
                : []
            if (_diff.length > 0) {
              _listEnd = [...res, ..._diff]
            }
          }

          return _listEnd
        }, [])
        .map((item: any) => {
          return {
            name: 'end_result',
            value: item,
            checked: false,
            _checked: false,
            level: 1,
          }
        })
      _filterEnd = [..._filterEnd, ..._filterEndResult]

      let _filterSurface = [
        {
          name: 'surface',
          value: 'Permukaan',
          checked: false,
          _checked: false,
          level: 0,
        },
      ] as any
      let _listSurface = [] as any
      const _filterPermukaan = products
        .reduce((res: any, item: any, i: any) => {
          if (res.length === 0) {
            _listSurface = item.surface.surface ? item.surface.surface : []
          } else {
            const _diff =
              item.surface && item.surface.surface
                ? item.surface.surface.filter((i: any) => !res.includes(i))
                : []
            if (_diff.length > 0) {
              _listSurface = [...res, ..._diff]
            }
          }

          return _listSurface
        }, [])
        .map((item: any) => {
          return {
            name: 'surface',
            value: item,
            checked: false,
            _checked: false,
            level: 1,
          }
        })
      _filterSurface = [..._filterSurface, ..._filterPermukaan]

      let _filterApp = [
        {
          name: 'aplication_area',
          value: 'Area Aplikasi',
          checked: false,
          _checked: false,
          level: 0,
        },
      ] as any
      let _listApp = [] as any
      const _filterApplication = products
        .reduce((res: any, item: any, i: any) => {
          if (res.length === 0) {
            if (item.application_area !== null)
              _listApp = item.application_area.application_area
                ? item.application_area.application_area
                : []
          } else {
            const _diff =
              item.application_area && item.application_area.application_area
                ? item.application_area.application_area.filter(
                    (i: any) => !res.includes(i.trim())
                  )
                : []

            if (_diff.length > 0) {
              _listApp = [...res, ..._diff]
            }
          }

          return _listApp
        }, [])
        .map((item: any) => {
          return {
            name: 'aplication_area',
            value: item,
            checked: false,
            _checked: false,
            level: 1,
          }
        })
      _filterApp = [..._filterApp, ..._filterApplication]

      meta.filter = [
        ..._filterPos,
        ..._filterEncer,
        ..._filterEnd,
        ..._filterSurface,
        ..._filterApp,
      ]
    } catch (e) {
      console.log(e)
    }
    meta.render()
  }

  useEffect(() => {
    if (!props.type) meta.filter = cloneDeep(meta.categories)
    else meta.filter = cloneDeep(meta[props.type])
  }, [props.type])

  const Item = ({ item, lv }: any) => {
    return (
      <div
        key={item.id}
        className={`w-full flex flex-1 flex-col ${
          lv === 0 ? 'pl-0 mb-2' : lv === 1 ? 'pl-3' : 'pl-4'
        }`}
      >
        <div
          className={`flex flex-1 items-center py-2 ${
            lv === 0
              ? 'font-bold border-t pl-2 border-b'
              : lv === 1
              ? 'text-sm'
              : 'text-sm'
          }`}
          onClick={() => {
            if (lv === 0) {
              return false
            }
            let data = checkUncheck(item, !item._checked)

            const idx = meta.filter.findIndex((x) => x.value === data.value)
            meta.filter[idx] = data
            meta.render()
          }}
        >
          {lv === 1 && (
            <>
              {!item.checked && !item._checked ? (
                <span
                  css={css`
                    width: 15px;
                    height: 15px;
                    background: #ececeb;
                  `}
                />
              ) : (
                <img
                  className={`flex flex-col items-start justify-start`}
                  src="/imgs/1087_16775.x1.svg"
                />
              )}
            </>
          )}

          <div className="text-gray-800 ml-2">{item.value}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={`z-20 w-screen py-2`}
        style={!!props.style ? props.style : {}}
      >
        <>
          <div className="flex space-x-2.5 items-start justify-start px-2.5">
            <div
              className="h-7 flex space-x-1 items-center justify-center px-2.5 py-1.5 bg-white shadow border rounded border-gray-500 btn-fade"
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
              <p className="text-xs font-medium leading-none text-gray-500">
                Filter
              </p>
            </div>
          </div>
        </>
      </div>

      <Sidebar
        className="flex-1 flex flex-col w-4/5 bg-white"
        show={meta.openFilter}
        onClose={() => {
          meta.openFilter = false
          meta.render()
        }}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-end justify-between bg-white m-4`}>
            <div className="font-bold">Filter</div>
          </div>

          <div className="flex flex-1 self-stretch flex-col items-start justify-start overflow-auto relative pt-0 px-5">
            <div className="absolute inset-0">
              {meta.filter.map((item, id) => (
                <Item key={id} item={item} lv={item.level} />
              ))}
            </div>
          </div>

          <div className="flex self-stretch space-x-2.5 items-start justify-start p-2.5 w-full bg-white pb-4">
            <div
              className="flex flex-1 items-start justify-center px-2.5 py-2.5 bg-white border rounded border-trueGray-500 btn-fade"
              onClick={() => {
                meta.filter = meta.filter.map((d) => checkUncheck(d, false))
                meta.render()
              }}
            >
              <div className="font-medium leading-none text-trueGray-500">
                Hapus Filter
              </div>
            </div>
            <div
              className="flex flex-1 items-center justify-center px-2.5 py-2.5 bg-green-500 shadow rounded avian-green3 btn-fade"
              onClick={() => {
                props.onUseFilter(getFilterList([...meta.filter], []))
                meta.openFilter = false
                meta.render()
              }}
            >
              <div className="font-medium leading-none text-white">
                Gunakan Filter
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  )
}
