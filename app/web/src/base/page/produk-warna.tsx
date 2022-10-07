import { page } from 'web-init'
import { AvianProdukWarna } from '../../components/AvianProdukWarna'

export default page({
  url: '/produk/warna/:id',
  layout: 'top-only',
  component: ({ layout }) => {
    return <AvianProdukWarna/>
  },
})
