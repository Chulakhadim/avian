import { page } from 'web-init'
import { AvianWarna } from '../../components/AvianWarna'

export default page({
  url: '/warna',
  component: ({ layout }) => {
    return <AvianWarna/>
  },
})
