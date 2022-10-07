import { AvianTokoCard } from './AvianTokoCard'
import { AvianTokoMap } from './AvianTokoMap'
import { AvianTokoSearch } from './AvianTokoSearch'

export const AvianToko = () => {
  return (
    <div className="flex-1 flex flex-col  relative">
      <AvianTokoMap />
      <AvianTokoSearch />
      <AvianTokoCard />
    </div>
  )
}
