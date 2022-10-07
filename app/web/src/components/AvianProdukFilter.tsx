import { FC } from 'react'
import { Sidebar } from 'web-ui'
import { useGlobal } from 'web-utils'
import { globalProduk } from '../base/global/produk'
import orderBy from 'lodash.sortby'

export const AvianProdukFilter = () => {
  const meta = useGlobal(globalProduk)
  const tabFilter = meta.tab === 'solusi' ? meta.solutions : meta.categories

  return (
    <>
      <Sidebar
        className="flex-1 flex flex-col w-4/5 bg-white"
        show={meta.openFilter}
        onClose={() => {
          meta.openFilter = false
          meta.render()
        }}
      >
        <>
          <div className={`flex items-center justify-between  m-4`}>
            <div className="font-bold">Filter</div>
          </div>

          <div className="bg-white flex-1 relative">
            <div className="absolute inset-0 overflow-auto">
              {tabFilter.map((item, id) => {
                return <Item key={id} item={item} lv={0} />
              })}
            </div>
          </div>

          <div className="flex self-stretch space-x-2.5 items-start justify-start p-2.5 w-full bg-white">
            <div
              className="flex flex-1 self-stretch items-center justify-center px-2.5 py-2.5 bg-white border rounded border-trueGray-500"
              onClick={() => {
                for (let i of tabFilter) {
                  i._checked = false
                  checkAll(i, false)
                }

                meta.openFilter = false
                meta.render()
                meta.filterProduct()
              }}
            >
              <div className="font-medium leading-none text-trueGray-500">
                Hapus Filter
              </div>
            </div>
            <div
              className="flex flex-1 items-center justify-center px-2.5 py-2.5 bg-green-500 shadow rounded avian-green3"
              onClick={() => {
                meta.openFilter = false
                meta.render()
                meta.filterProduct()
              }}
            >
              <div className="font-medium leading-none text-white">
                Gunakan Filter
              </div>
            </div>
          </div>
        </>
      </Sidebar>
    </>
  )
}

const Item: FC<{ item: any; lv: number; root?: any }> = ({
  item,
  lv,
  root,
}) => {
  const meta = useGlobal(globalProduk)
  const tabFilter = meta.tab === 'solusi' ? meta.solutions : meta.categories
  return (
    <div
      key={item.id}
      className={`w-full flex flex-1 flex-col ${
        lv === 0
          ? 'pl-0 bg-gray-200'
          : lv === 1
          ? 'pl-3 bg-gray-100'
          : 'pl-4 bg-white'
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
          item._checked = !item._checked
          checkAll(item, item._checked)

          const checkChecked = (obj: any) => {
            if (!!obj.id_parent) {
              let find = false
              for (let i = 0; !find; i++) {
                const t = tabFilter[i]
                const el = searchTree(t, obj.id_parent, 'id')
                if (!!el) {
                  find = true
                  el._checked = false
                  el.children.forEach((c: any) => {
                    if (c._checked) el._checked = true
                  })
                  checkChecked(el)
                }
              }
            }
          }

          checkChecked(item)
          meta.render()
        }}
      >
        {!item._checked ? (
          <span
            css={css`
              width: 15px;
              height: 15px;
              border: 1px solid #aaa;
              background: white;
            `}
          />
        ) : (
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
        )}

        <div className="text-gray-800 ml-2 flex-1">{item.name}</div>
        {item.children.length > 0 && (
          <div
            className="text-gray-800 px-2 z-10"
            onClick={(ev) => {
              item.expand = !item.expand
              meta.render()
              ev.stopPropagation()
            }}
          >
            <img
              src={`/icons/chevron-${item.expand ? 'up' : 'down'}.png`}
              width={16}
            />
          </div>
        )}
      </div>
      <div
        className={`${
          item.expand ? 'transition-all' : 'hidden transition-all'
        }`}
      >
        {orderBy(item.children, ['order'], ['asc']).map(
          (_item: any, _idx: number) => (
            <Item
              key={_idx}
              item={_item}
              lv={lv + 1}
              root={lv === 0 ? item : root}
            />
          )
        )}
      </div>
    </div>
  )
}

const searchTree: any = (e: any, s: string | number, k: string) => {
  if (e[k] == s) {
    return e
  } else if (e.children != null) {
    var i
    var result = null
    for (i = 0; result == null && i < e.children.length; i++) {
      result = searchTree(e.children[i], s, k)
    }
    return result
  }
  return null
}

export const checkAll = (item: any, checked: boolean) => {
  for (let child of item.children) {
    child._checked = checked

    if (child.children && child.children.length > 0) {
      checkAll(child, checked)
    }
  }
}
