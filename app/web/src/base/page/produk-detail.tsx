import { page } from 'web-init'
import { AvianProdukDetail } from '../../components/AvianProdukDetail'

export default page({
  url: '/produk/detail/:tid',
  layout: 'top-only',
  component: ({ layout }) => {
    return <AvianProdukDetail />
  },
})
