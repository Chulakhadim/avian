import { AvianVis } from 'src/components/AvianVis'
import { page } from 'web-init'

export default page({
  url: '/vis',
  layout: 'bot-only',
  component: ({ layout }) => {
    return <AvianVis />
  },
})
