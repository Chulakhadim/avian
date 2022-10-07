import { page } from 'web-init'
import { AvianWarnaPreview } from '../../components/AvianWarnaPreview'

export default page({
  url: '/warna/preview/:id/:temukanProduk',
  layout: 'top-only',
  component: ({ layout }) => {
    return <AvianWarnaPreview />
  },
})
