import { page } from 'web-init'
import { AvianHomeBanner } from '../../components/AvianHomeBanner'
import { AvianHomeFeedback } from '../../components/AvianHomeFeedback'
import { AvianHomeNews } from '../../components/AvianHomeNews'
import { AvianHomePeduli } from '../../components/AvianHomePeduli'
import { AvianHomeToko } from '../../components/AvianHomeToko'

export default page({
  url: '/',
  component: ({ }) => {
    return (
      <div className="flex flex-col items-stretch">
        <AvianHomeBanner />
        <AvianHomeToko />
        <AvianHomePeduli />
        <AvianHomeNews />
        <AvianHomeFeedback />
      </div>
    )
  },
})
