import { page } from 'web-init'
import { AvianToko } from '../../components/AvianToko'

export default page({
  url: '/toko/:tid?/:pid?',
  component: ({ layout }) => {
    return <AvianToko />
  },
})
