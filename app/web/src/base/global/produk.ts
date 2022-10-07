export const globalProduk = {
  tab: '' as 'solusi' | 'kategori',
  categories: [] as any[],
  solutions: [] as any[],
  filter: [] as any[],
  openFilter: false,
  filterProduct: async () => {},
  product: {
    categories: [] as any[],
    solutions: [] as any[],
    list: [] as any[],
    loading: true,
    scrollTop: 0,
  },
  detailLoading: false,
  detail: {} as any,
}
