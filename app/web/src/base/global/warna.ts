type mst_color_inspiration = {
  id: number
  label: string
  hex: string
  status: string
  created_at: Date
  order: number | null
}

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

export const globalWarna = {
    modal: true,
    colorInspiration: [] as mst_color_inspiration[],
    selectedInspiration: null as number | null,
    tabListColor: 'all' as 'all' | 'favourite',
    palleteColor: [] as mst_pallete_color[],
    favouriteColor: [] as mst_pallete_color[],
    loadingInspiration: true,
    loadingPallete: true,
    scrollTop: 0,
}
