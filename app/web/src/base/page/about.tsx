import { page } from 'web-init'
import { AvianAbout } from '../../components/AvianAbout'

export default page({
  url: '/about-avian-brands',
  layout: 'top-only',
  component: ({ layout }) => {
    return <AvianAbout />
  },
})
