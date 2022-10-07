import { Modal } from 'web-ui'
import { useGlobal, useLocal } from 'web-utils'
import { globalProduk } from '../base/global/produk'
import { CloseIcon } from './top-icons'

export const AvianProdukDetailAction = () => {
  const meta = useGlobal(globalProduk)
  const local = useLocal({
    modalCalculator: false,
    modeCalculator: 'hitung' as 'hitung' | 'result',
    errorCalculator: '',
    loadingCalculator: false,
    formCalculator: {
      bidang: 'lantai',
      alat: 'kuas',
      panjangBidang: '',
      lebarBidang: '',
      jumlahBidang: '',
      bukanPanjangBidang: '',
      bukanLebarBidang: '',
      bukanJumlahBidang: '',
    },
    formValidator: {
      panjangBidang: '',
      lebarBidang: '',
      jumlahBidang: '',
    },
    resultCalculator: {
      area: 0,
      dayaSebar: 0,
      lapisan: 0,
      lossFactor: 0,
      cat: [] as any[],
      kebutuhanCatTeoritical: 0,
      kebutuhanCatPractical: 0,
    },
    bidangs: [
      {
        value: 'lantai',
        label: 'Lantai',
        persen: 5,
      },
      {
        value: 'dinding',
        label: 'Dinding',
        persen: 15,
      },
      {
        value: 'plafon',
        label: 'Plafon',
        persen: 25,
      },
    ],
    alats: [
      {
        value: 'kuas',
        label: 'Kuas',
        persen: 5,
      },
      {
        value: 'roller',
        label: 'Roller',
        persen: 10,
      },
      {
        value: 'air_spray',
        label: 'Air Spray',
        persen: 15,
      },
      {
        value: 'airless_spray',
        label: 'Airless Spray',
        persen: 20,
      },
    ],
  })

  const onChangeCalculator = (e: any) => {
    local.formCalculator = {
      ...local.formCalculator,
      [e.target.name]: e.target.value,
    }

    if (!(local.formCalculator as any)[e.target.name])
      (local.formValidator as any)[e.target.name] = 'Tidak boleh kosong!'
    else (local.formValidator as any)[e.target.name] = ''
    local.render()
  }

  const humanize = (str: string) => {
    let i,
      frags = str.split('_')

    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
    }

    return frags.join(' ')
  }

  const checkLihatWarna = () => {
    return (
      !!meta.detail.is_888 ||
      !!meta.detail.is_170 ||
      (!!meta.detail.ready_mix_url &&
        meta.detail.ready_mix_url.url.length > 0 &&
        !!meta.detail.ready_mix_url.url[0]) ||
      meta.detail.name === 'Avitex One Coat'
    )
  }

  return (
    <>
      <div className="flex self-stretch flex-col space-y-2.5 items-start justify-start px-5 py-2.5">
        <a
          href={`/toko/0/${meta.detail.id}`}
          className="flex self-stretch items-center justify-center px-2.5 py-3 bg-white shadow border rounded border-emerald-700 btn-fade"
        >
          <div className="text-sm font-medium leading-none text-emerald-700">
            Cari Toko
          </div>
        </a>
        {checkLihatWarna() && (
          <a
            href={`/produk/warna/${meta.detail.id}`}
            className={`flex self-stretch items-center justify-center px-2.5 py-3 bg-white shadow border rounded border-emerald-700 btn-fade`}
          >
            <div className="text-sm font-medium leading-none text-emerald-700">
              Lihat Warna
            </div>
          </a>
        )}
        {!!meta.detail.is_calculator && (
          <div
            className={`flex self-stretch items-center justify-center px-2.5 py-3 bg-white shadow border rounded border-emerald-700 btn-fade`}
            onClick={() => {
              local.modalCalculator = true
              local.render()
            }}
          >
            <div className="text-sm font-medium leading-none text-emerald-700">
              Kalkulator
            </div>
          </div>
        )}
      </div>

      <Modal
        show={local.modalCalculator}
        onClose={() => {
          local.modalCalculator = false
          local.render()
        }}
      >
        <div className="flex flex-col bg-white p-6 w-4/5 rounded shadow text-gray-800 relative">
                    <button
            onClick={() => {
              local.modalCalculator = false
              local.render()
            }}
            className="border-none outline-none cursor-pointer group py-1 px-2 absolute top-0 right-1"
          >
            <>
              <CloseIcon/>
            </>
          </button>
          <div className="text-base font-bold text-center mt-3">
            Hitung jumlah cat
            <br />
            yang Anda butuhkan
          </div>
          {local.modeCalculator === 'hitung' ? (
            <>
              <div className="flex flex-col my-6 space-y-8">
                <div className="flex flex-col space-y-3">
                  <SelectField
                    onChange={onChangeCalculator}
                    label="Bidang yang di cat"
                    name="bidang"
                    value={local.formCalculator.bidang}
                    items={local.bidangs}
                  />
                  <SelectField
                    onChange={onChangeCalculator}
                    label="Alat aplikasi"
                    name="alat"
                    value={local.formCalculator.alat}
                    items={local.alats}
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <div className="text-sm font-bold leading-none text-gray-800">
                    Area Pengecatan
                  </div>
                  <TextField
                    onChange={onChangeCalculator}
                    label="Panjang Bidang"
                    name="panjangBidang"
                    value={local.formCalculator.panjangBidang}
                    prefix="m"
                    err={local.formValidator.panjangBidang}
                  />
                  <TextField
                    onChange={onChangeCalculator}
                    label="Lebar Bidang"
                    name="lebarBidang"
                    value={local.formCalculator.lebarBidang}
                    prefix="m"
                    err={local.formValidator.lebarBidang}
                  />
                  <TextField
                    onChange={onChangeCalculator}
                    label="Jumlah Bidang"
                    name="jumlahBidang"
                    value={local.formCalculator.jumlahBidang}
                    err={local.formValidator.jumlahBidang}
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <div className="text-sm font-bold leading-none text-gray-800">
                    Area yang tidak dicat
                  </div>
                  <TextField
                    onChange={onChangeCalculator}
                    label="Panjang Bidang"
                    name="bukanPanjangBidang"
                    value={local.formCalculator.bukanPanjangBidang}
                    prefix="m"
                  />
                  <TextField
                    onChange={onChangeCalculator}
                    label="Lebar Bidang"
                    name="bukanLebarBidang"
                    value={local.formCalculator.bukanLebarBidang}
                    prefix="m"
                  />
                  <TextField
                    onChange={onChangeCalculator}
                    label="Jumlah Bidang"
                    name="bukanJumlahBidang"
                    value={local.formCalculator.bukanJumlahBidang}
                  />
                </div>
              </div>

              <div
                className={`flex self-stretch items-center justify-center p-2.5 bg-green-500 shadow rounded w-full text-sm font-medium leading-none text-white btn-fade ${
                  local.loadingCalculator ? 'opacity-30' : ''
                }`}
                css={css`
                  z-index: 20001;
                `}
                onClick={(ev) => {
                  let valid = true
                  Object.keys(local.formValidator).forEach((e) => {
                    if (!(local.formCalculator as any)[e]) {
                      valid = false
                      ;(local.formValidator as any)[e] = 'Tidak boleh kosong!'
                    } else (local.formValidator as any)[e] = ''
                  })

                  if (!valid) {
                    local.render()
                    return
                  }

                  local.loadingCalculator = true
                  local.render()

                  const bidang = local.bidangs.find(
                    (val) => val.value === local.formCalculator.bidang
                  )
                  const alat = local.alats.find(
                    (val) => val.value === local.formCalculator.alat
                  )
                  const panjangBidang = (local.formCalculator.panjangBidang ||
                    0) as number
                  const lebarBidang = (local.formCalculator.lebarBidang ||
                    0) as number
                  const jumlahBidang = (local.formCalculator.jumlahBidang ||
                    0) as number
                  const bukanPanjangBidang = (local.formCalculator
                    .bukanPanjangBidang || 0) as number
                  const bukanLebarBidang = (local.formCalculator
                    .bukanLebarBidang || 0) as number
                  const bukanJumlahBidang = (local.formCalculator
                    .bukanJumlahBidang || 0) as number
                  let totalBidang = 0
                  let kebutuhanCatTeoritical = 0
                  let kebutuhanCatPractical = 0
                  let lossFactor = 0
                  let kebutuhanKemasan = []

                  if (!meta.detail.packaging) {
                    local.errorCalculator = 'belum di set'
                  }

                  if (meta.detail.min_spread == 0) {
                    local.errorCalculator = 'tidak boleh kosong'
                  }

                  const luasBidang = panjangBidang * lebarBidang * jumlahBidang
                  const bukanLuasBidang =
                    bukanPanjangBidang * bukanLebarBidang * bukanJumlahBidang
                  totalBidang = luasBidang - bukanLuasBidang
                  kebutuhanCatTeoritical =
                    (totalBidang / meta.detail.min_spread) *
                    meta.detail.layers_max
                  if (bidang && alat)
                    lossFactor = (bidang?.persen + alat?.persen) / 100
                  kebutuhanCatPractical = Math.ceil(
                    lossFactor * kebutuhanCatTeoritical + kebutuhanCatTeoritical
                  )
                  const packaging = meta.detail.packaging.packaging
                    .sort()
                    .reverse()

                  let pembagi = 0
                  kebutuhanKemasan = packaging.reduce(
                    (results: any, pack: any, i: any) => {
                      let kebutuhan = ''
                      let hitung = 0

                      if (i === packaging.length - 1) {
                        pembagi = kebutuhanCatPractical - hitung * pack
                        if (pembagi <= 0) {
                          return packaging
                        } else {
                          hitung = Math.ceil(pembagi / pack)
                          kebutuhan = pack + ' Lt x ' + hitung
                          return results.length === 0
                            ? [kebutuhan]
                            : [...results, kebutuhan]
                        }
                      } else {
                        if (i === 0) {
                          if (kebutuhanCatPractical >= pack) {
                            hitung = Math.floor(kebutuhanCatPractical / pack)
                            pembagi = kebutuhanCatPractical - hitung * pack
                            kebutuhan = pack + ' Lt x ' + hitung
                            return results.length === 0
                              ? [kebutuhan]
                              : [...results, kebutuhan]
                          } else {
                            pembagi = kebutuhanCatPractical
                            return results
                          }
                        } else {
                          if (pembagi >= pack) {
                            hitung = Math.floor(pembagi / pack)
                            pembagi = pembagi - hitung * pack
                            kebutuhan = pack + ' Lt x ' + hitung
                            return results.length === 0
                              ? [kebutuhan]
                              : [...results, kebutuhan]
                          } else {
                            return results
                          }
                        }
                      }
                    },
                    []
                  )

                  local.resultCalculator = {
                    area: totalBidang,
                    lossFactor: lossFactor,
                    dayaSebar: meta.detail.min_spread,
                    lapisan: meta.detail.layers_max,
                    kebutuhanCatTeoritical: kebutuhanCatTeoritical,
                    kebutuhanCatPractical: kebutuhanCatPractical,
                    cat:
                      kebutuhanKemasan.length === 0 ? ['-'] : kebutuhanKemasan,
                  }

                  local.modeCalculator = 'result'
                  local.loadingCalculator = false
                  local.render()
                  ev.stopPropagation()
                }}
              >
                {local.loadingCalculator ? 'Loading...' : 'Hitung'}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col my-6 space-y-8">
                <div className="flex flex-col space-y-3">
                  <div className="text-sm font-bold leading-none text-gray-800">
                    Luas Area
                  </div>
                  <LabelField
                    value={
                      local.formCalculator.bidang.charAt(0).toUpperCase() +
                      local.formCalculator.bidang.slice(1)
                    }
                    label="Bidang"
                  />
                  <LabelField
                    value={local.resultCalculator.area}
                    label="Luas Bidang"
                    prefix="m&#178;"
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <div className="text-sm font-bold leading-none text-gray-800">
                    Tentang Produk
                  </div>
                  <LabelField
                    value={local.resultCalculator.dayaSebar}
                    label="Daya Sebar"
                    prefix={meta.detail.spread_unit}
                  />
                  <LabelField
                    value={local.resultCalculator.lapisan}
                    label="Lapisan yang dibutuhkan"
                    prefix={meta.detail.layers_unit}
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <div className="text-sm font-bold leading-none text-gray-800">
                    Pemakaian
                  </div>
                  <LabelField
                    value={humanize(local.formCalculator.alat)}
                    label="Alat"
                  />
                  <LabelField
                    value={local.resultCalculator.lossFactor * 100}
                    label="Loss Factor"
                    prefix="%"
                  />
                </div>

                <div className="text-base font-bold leading-tight text-center text-gray-800">
                  Jumlah cat yang <br /> dibutuhkan
                </div>

                <div
                  className="text-base leading-tight text-center text-gray-800"
                  css={css`
                    margin-top: 7px !important;
                  `}
                >
                  <div className="text-base font-bold leading-tight text-center text-green-500">
                    {local.resultCalculator.cat.map((item, i) => (
                      <h4 key={i}>Ukuran {item}</h4>
                    ))}
                  </div>
                  <div className="flex-1 flex text-xs leading-none text-center pt-2">
                    Perkiraan ini berdasarkan cat. Derajat penutupan sebenarnya
                    akan tergantung pada kondisi permukaan. Jika perubahan
                    warnanya kontras, mungkin akan diperlukan lapisan tambahan.
                  </div>
                </div>
              </div>

              <div
                className={`flex self-stretch items-center justify-center px-2.5 py-2.5 bg-green-500 shadow rounded w-full text-sm font-medium leading-none text-white btn-fade`}
                css={css`
                  z-index: 20001;
                `}
                onClick={(ev) => {
                  local.modeCalculator = 'hitung'
                  ;(local.formCalculator = {
                    bidang: 'lantai',
                    alat: 'kuas',
                    panjangBidang: '',
                    lebarBidang: '',
                    jumlahBidang: '',
                    bukanPanjangBidang: '',
                    bukanLebarBidang: '',
                    bukanJumlahBidang: '',
                  }),
                    local.render()
                  ev.stopPropagation()
                }}
              >
                Hitung Ulang
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}

interface ISelectField {
  onChange: (e: any) => void
  value: string | number
  items: { label: string; value: string }[]
  label: string
  name: string
}
const SelectField = ({ onChange, value, items, label, name }: ISelectField) => {
  return (
    <div className="flex justify-between">
      <div className="text-sm font-medium leading-none text-gray-800">
        {label}
      </div>
      <select
        className="focus:outline-none text-sm border-b py-0 text-right"
        css={css`
          border: none;
        `}
        name={name}
        onChange={onChange}
        value={value}
      >
        {items.map((item, i) => {
          return (
            <option key={i} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

interface ITextField {
  onChange: (e: any) => void
  value: string | number
  label: string
  name: string
  prefix?: string
  err?: string
}
const TextField = ({
  onChange,
  value,
  label,
  name,
  prefix,
  err,
}: ITextField) => {
  return (
    <>
      <div className="flex justify-between">
        <div className="text-sm font-medium leading-none text-gray-800">
          {label}
        </div>
        <div className="flex border-b">
          <input
            className="focus:outline-none text-sm border-b py-0 text-right"
            css={css`
              border: none;
              width: 70px;
            `}
            type="number"
            name={name}
            onChange={onChange}
            value={value}
          />
          {!!prefix && <span className="text-sm">&nbsp;{prefix}</span>}
        </div>
      </div>
      {!!err && <span className="text-right text-xs text-red-400">{err}</span>}
    </>
  )
}

interface ILabelField {
  value: string | number
  label: string
  prefix?: string
}
const LabelField = ({ value, label, prefix }: ILabelField) => {
  return (
    <div className="flex justify-between">
      <div className="text-sm font-medium leading-none text-gray-800">
        {label}
      </div>
      <div
        className="flex justify-end border-b text-sm text-right"
        css={css`
          width: 100px;
        `}
      >
        <div>{value}</div>
        {!!prefix && <span>&nbsp;{prefix}</span>}
      </div>
    </div>
  )
}
