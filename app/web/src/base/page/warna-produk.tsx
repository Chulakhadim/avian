import { page } from 'web-init'
import { AvianWarnaProduk } from '../../components/AvianWarnaProduk'

export default page({
  url: '/warna/produk/:cid',
  layout: 'top-only',
  component: ({ layout }) => {
    return <AvianWarnaProduk/>
  },
})
