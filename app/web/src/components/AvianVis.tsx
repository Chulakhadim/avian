import { useLocal, waitUntil, useGlobal } from 'web-utils'
import React, { useEffect, useRef, useState } from 'react'
import get from 'lodash.get'
import injectScript from '../utils/injectScript'
import "mirada"
import { Modal } from 'web-ui'
import { globalWarna } from '../base/global/warna'
import { CloseIcon, IconCodeLoad } from './top-icons'
import { WebStore } from './utils'
import { Navigation, A11y, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
// import imgSample from '../assets/sample.png'

const w = window as any

export const AvianVis = () => {

const imageCanvas = useRef<HTMLCanvasElement>(null)
const [openCVLoaded, setOpenCVLoaded] = useState(false)
const [imageLoaded, setImageLoaded] = useState(false)
const [file, setFile] = useState<File>()
const [color, setColor] = useState('empty')
const newCanvas = useRef<HTMLCanvasElement>(null)

useEffect(() => {
  if (!openCVLoaded) {
    const promise = injectScript('opencv', 'https://docs.opencv.org/4.6.0/opencv.js')
    promise.then(() => {
      cv['onRuntimeInitialized'] = () => {
        setOpenCVLoaded(true)
        console.log('OpenCV loaded')
      }
    })
      .catch(() => {
        console.log('OpenCV failed to load')
      })
  }
}, [])

useEffect(() => {
  if (imageLoaded && openCVLoaded) {
    const image = cv.imread(imageCanvas.current!)
    cv.imshow('new', image)
    image.delete()
  }
}, [imageLoaded, openCVLoaded])

useEffect(() => {
  if (file != undefined) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image()
        img.src = e.target.result.toString()
        img.onload = () => {
          const canvas = imageCanvas.current!
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0)
          setImageLoaded(true)
          const canvas2 = newCanvas.current!
          canvas2.width = img.width
          canvas2.height = img.height
          const ctx2 = canvas2.getContext('2d')!
          ctx2.drawImage(img, 0, 0)
        }
      }
    }
    reader.readAsDataURL(file)
  }
}, [file])

useEffect(() => {
  console.log(color)
}, [color])

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
  
  const metaColor = useGlobal(globalWarna, async () => {
    const getColorInspiration = async () => {
      metaColor.colorInspiration = await db.mst_color_inspiration.findMany({
        orderBy: {
          order: 'asc',
        },
      })
      metaColor.loadingInspiration = false
      metaColor.render()
    }

    const getColorFavourite = async () => {
      const itemsStr = await WebStore.get('color-favorite')
      const items = JSON.parse(itemsStr || '[]')
      metaColor.favouriteColor = items
      metaColor.render()
    }

    if (metaColor.loadingInspiration) {
      getColorInspiration().then(() => {
        getPallete(metaColor.colorInspiration[0].id)
      })
    }
    getColorFavourite()
  })

  const pSize = (window.innerWidth - 40) / 6

  const getPallete = async (id: number) => {
    metaColor.selectedInspiration = id
    metaColor.tabListColor = 'all'
    metaColor.loadingPallete = true
    metaColor.render()

    const res888 = await db.mst_pallete_color.findMany({
      where: {
        id_color_inspiration: id,
        type: '888',
      },
      orderBy: {
        id: 'asc',
      },
    })

    const res170 = await db.mst_pallete_color.findMany({
      where: {
        id_color_inspiration: id,
        type: '170',
      },
      orderBy: {
        id: 'asc',
      },
    })

    const colors = [...res888, ...res170]
    metaColor.palleteColor = colors
    metaColor.loadingPallete = false
    metaColor.render()
  }

  const getColor = (color: string) => {
    const codes = color.replace("#","").split('')
    const r = parseInt(codes[0] + codes[1], 16)
    const g = parseInt(codes[2] + codes[3], 16)
    const b = parseInt(codes[4] + codes[5], 16)
    return new cv.Scalar(r, g, b)
  }

  newCanvas.current?.addEventListener('mousedown', (e) => {
    const rect = newCanvas.current?.getBoundingClientRect()
    const scaleX = newCanvas.current?.width! / rect?.width!
    const scaleY = newCanvas.current?.height! / rect?.height!
    const x = (e.clientX - rect?.left!) * scaleX
    const y = (e.clientY - rect?.top!) * scaleY

    const image = cv.imread(imageCanvas.current!)
    const rgb = new cv.Mat()
    cv.cvtColor(image, rgb, cv.COLOR_RGBA2RGB)
    const gray = new cv.Mat()
    cv.cvtColor(rgb, gray, cv.COLOR_RGB2GRAY)
    const gblur = new cv.Mat();
    const ksize0 = new cv.Size(1, 1);
    cv.GaussianBlur(gray, gblur, ksize0, 0, 0, cv.BORDER_DEFAULT);
    const cannyGray = new cv.Mat()
    const mask = cv.matFromArray(3, 3, cv.CV_8U, [0, -1, 0, -1, 5, -1, 0, -1, 0])
    cv.Canny(gblur, cannyGray, 30, 60, 3)
    const hsv = new cv.Mat()
    cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV)
    const list = new cv.MatVector()
    cv.split(hsv, list)
    const sChannel = new cv.Mat()
    const sList = new cv.MatVector()
    sList.push_back(list.get(1))
    cv.merge(sList, sChannel)
    cv.medianBlur(sChannel, sChannel, 3)
    const canny = new cv.Mat()
    cv.Canny(sChannel, canny, 30, 30 * 2.5, 3, false)
    cv.addWeighted(canny, 0.5, cannyGray, 0.1, 0, canny)
    cv.dilate(canny, canny, mask, new cv.Point(0, 0), 0.1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue())

    const seedPoint = new cv.Point(x, y)
    cv.resize(canny, canny, new cv.Size(canny.cols + 2, canny.rows + 2))
    cv.floodFill(rgb, canny, seedPoint, getColor(color), new cv.Rect(0, 0, 0, 0), new cv.Scalar(5, 5, 5), new cv.Scalar(5, 5, 5), 8)

    //cv.dilate(rgb, rgb,mask, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue())

    cv.imshow('new', rgb)
    image.delete()

  })

  return (
    <div className="relative flex-1 h-full w-screen">
      
          <>
            <div className='grid mx-2 items-center justify-center'>
              <div className='hidden'>
                <canvas id='imageSrc' ref={imageCanvas} />
              </div>
              <div className='flex flex-col mt-3'>
                {/* <div>Result</div> */}
                <canvas id='new' className='object-contain w-full' ref={newCanvas} />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-x-8 m-2 items-center justify-center'>
              <input type='file' onChange={(e) => {
                setFile(e.target.files![0])
              }} />
              <input className='' type='color' value={color} onChange={(e) => {
                setColor(e.target.value)
              }} />
            </div>
          </>
        
      <>
      <div
        className={`flex flex-1 flex-col h-full overflow-auto pb-12`}
        ref={(e) => {
          if (e) {
            e.scrollTop = metaColor.scrollTop
          }
        }}
        onScroll={(e: any) => {
          metaColor.scrollTop = e.target.scrollTop
        }}
      >
        <div
          className={`flex self-stretch flex-col items-start justify-start p-5 space-y-5`}
        >
          <div
            className={`flex self-stretch justify-center text-lg font-bold leading-relaxed text-green-900`}
          >
            {/* Pilih Inspirasi Warna */}
          </div>
          <div className={`flex self-stretch justify-between p-1 items-center`}>
            {metaColor.loadingInspiration ? (
              <>
                <IconCodeLoad />
              </>
            ) : (
              <>
                {metaColor.colorInspiration.map((item, i) => (
                  <div
                    key={i}
                    className={`btn-fade bg-black rounded-full`}
                    css={css`
                      width: 40px;
                      min-width: 40px;
                      max-width: 40px;
                      height: 40px;
                      min-height: 40px;
                      max-height: 40px;
                      background: ${item.hex};
                      ${item.id === metaColor.selectedInspiration &&
                      `min-width: 60px; min-height: 60px;`}
                    `}
                    onClick={() => getPallete(item.id)}
                  />
                ))}
              </>
            )}
          </div>
          <div
            className={`flex self-stretch items-center justify-start bg-white shadow rounded overflow-hidden`}
          >
            {/* <div
              className={`flex flex-1 items-start justify-center p-2 bg-white rounded btn-fade text-sm leading-tight text-trueGray-500 ${
                metaColor.tabListColor === 'all' && 'avian-green3'
              }`}
              onClick={() => {
                metaColor.tabListColor = 'all'
                metaColor.render()
              }}
            >
              Semua Warna
            </div>
            <div
              className={`flex flex-1 items-start justify-center p-2 bg-white rounded btn-fade text-sm leading-tight text-trueGray-500 ${
                metaColor.tabListColor === 'favourite' && 'avian-green3'
              }`}
              onClick={() => {
                metaColor.tabListColor = 'favourite'
                metaColor.render()
              }}
            >
              Warna Favorit Saya
            </div> */}
          </div>
          <div className="flex self-stretch flex-col items-start justify-start">
            {metaColor.loadingPallete ? (
              <>
                <IconCodeLoad />
                <IconCodeLoad />
              </>
            ) : (
              <>
                {metaColor.tabListColor === 'all' && (
                  <div
                    className={`flex self-stretch items-start justify-start flex-wrap`}
                  >
                    <Swiper
                      modules={[Navigation, Pagination, A11y]}
                      // spaceBetween={50}
                      breakpoints={{
                        0: {
                            slidesPerView:6
                        },
                        768: {
                            slidesPerView:8
                        },
                        1024: {
                            slidesPerView:11
                        }
                      }}
                    >
                      {metaColor.palleteColor.map((item, i) => (
                        <SwiperSlide>
                          <div
                            key={i}
                            className={`p-0.5`}
                            css={css`
                              width: ${pSize}px;
                              height: ${pSize}px;
                            `}
                          >
                            <div
                              className={`bg-warmGray-200 w-full h-full`}
                              css={css`
                                background: ${item.hex};
                              `}
                              onClick={() => setColor(item.hex)}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
                {metaColor.tabListColor === 'favourite' && (
                  <div
                    className={`flex self-stretch items-start justify-start flex-wrap`}
                  >
                    {metaColor.favouriteColor.map((item, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-start justify-start p-0.5`}
                        css={css`
                          width: ${pSize}px;
                          height: ${pSize}px;
                        `}
                      >
                        <a
                          className={`bg-warmGray-200 w-full h-full`}
                          css={css`
                            background: ${item.hex};
                          `}
                          href={`/warna/preview/${item.id}/true`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        show={metaColor.modal}
        onClose={() => {
          metaColor.modal = false
          metaColor.render()
        }}
      >
        <div className={`flex bg-white shadow rounded-lg p-6 w-4/5 relative`}>
          <button
            onClick={() => {
              metaColor.modal = false
              metaColor.render()
            }}
            className="border-none outline-none cursor-pointer group py-1 px-2 absolute top-0 right-1"
          >
            <>
              <CloseIcon/>
            </>
          </button>
          <div className="flex self-stretch flex-col items-center justify-center overflow-y-auto mt-3">
            <div className="text-red-500 text-lg font-semibold">
              Akurasi Warna
            </div>

            <div className="flex flex-col items-start justify-start p-5 bg-white rounded">
              <div className="flex flex-col space-y-6 items-center justify-start bg-white rounded-tl rounded-tr">
                <div className="flex flex-col space-y-1 items-center justify-start mt-4">
                  <div className="text-xs text-gray-800 break-normal text-center leading-normal">
                    Warna-warna digital pada layar ini dibuat mendekati kartu
                    warna sesungguhnya. Perbedaan warna mungkin terjadi
                    dikarenakan perbedaan dan pengaturan resolusi layar, maka
                    warna yang Anda lihat tidak dapat menjadi acuan utama. Untuk
                    referensi warna sebenarnya gunakan Kartu Warna yang tersedia
                    di toko.
                  </div>
                </div>
                <div
                  className="flex self-stretch items-center justify-center p-2 bg-white shadow border border-green-700 rounded text-xs leading-none text-green-700 btn-fade"
                  onClick={() => {
                    metaColor.modal = false
                    metaColor.render()
                  }}
                >
                  OK
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      </>
    </div>
  )
}
