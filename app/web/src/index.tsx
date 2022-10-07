import { registerSW } from 'virtual:pwa-register'
import { start } from 'web-init'
import './index.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import baseUrl from './baseurl'

start({
  registerSW,
  baseUrl,
})
