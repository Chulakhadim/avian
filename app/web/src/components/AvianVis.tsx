import { useLocal, waitUntil } from 'web-utils'
import get from 'lodash.get'
const w = window as any

export const AvianVis = () => {
  const meta = useLocal(
    {
      started: false,
      cam: null as any,
      oldBgs: {} as Record<string, string>,
      p: { x: 0, y: 0 },
    },
    async () => {
      const cap = get(w, 'Capacitor.Plugins', {})
      const cam = cap.CameraPreview
      meta.cam = cam
      const bgs = ['html', 'body', '#root']

      if (!!cam) {
        try {
          await cam.start({
            // position: 'front',
            toBack: true,
            className: 'vis-cam',
            parent: 'root',
            disableAudio: true,
            // height: '100%',
            // width: '100%',
          })
        } catch (e) {}
      }

      meta.started = true
      meta.render()

      for (let bg of bgs) {
        const el = document.querySelector(bg) as any
        if (el) {
          meta.oldBgs[bg] = el.style.background
          el.style.background = 'transparent'
        }
      }

      draw()

      return () => {
        meta.started = false
        if (cam) cam.stop()
        for (let bg of bgs) {
          const el = document.querySelector(bg) as any
          if (el) {
            el.style.background = meta.oldBgs[bg]
          }
        }
      }
    }
  )

  const draw = async () => {
    if (!!meta.cam) {
      try {
        const begin = Date.now()
        const cam = meta.cam
        const result = await cam.captureSample()
        const delay = 1000 / 240 - (Date.now() - begin)
        setTimeout(() => {
          videoCapture(result.value)
          draw()
        })
      } catch (err) {
        alert(err)
      }
    }
  }

  const videoCapture = async (str: string) => {
    const res = await fetch('data:image/jpeg;base64,' + str)
    const blob = await res.blob()
    const video: any = document.getElementById('video')
    video.src = window.URL.createObjectURL(blob)
  }

  return (
    <div className="flex-1 h-screen w-screen">
      {/* <img id="video" className="" /> */}
    </div>
  )
}
