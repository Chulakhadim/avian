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

export const globalWarnaProduk = {
  products: [],
  productsOrigin: [],
  color: {} as mst_pallete_color | null,
  isFavourit: false,
  loading: true,
  scrollTop: 0,
}

export const globalWarnaProdukFilter = {
  categories: [] as any[],
  solutions: [] as any[],
  filter: [] as any[],
  openFilter: false,
}
