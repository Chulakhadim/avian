import { SVGProps } from 'react'
import ContentLoader from 'react-content-loader'

export const BackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        d="M12.5 23.75 3.75 15m0 0 8.75-8.75M3.75 15h22.5"
        stroke="#3F3F46"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h30v30H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <img src='/icons/MenuIcon.png'/>
  // <svg
  //   width="30px"
  //   height="30px "
  //   viewBox="0 0 30 30"
  //   fill="none"
  //   xmlns="http://www.w3.org/2000/svg"
  //   {...props}
  // >
  //   <g clipPath="url(#a)">
  //     <path
  //       d="M5 22.5h20M5 7.5h20H5ZM5 15h20H5Z"
  //       stroke="#3F3F46"
  //       strokeWidth={2}
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     />
  //   </g>
  //   <defs>
  //     <clipPath id="a">
  //       <path fill="#fff" d="M0 0h30v30H0z" />
  //     </clipPath>
  //   </defs>
  // </svg>
)

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={26}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        d="m19.375 22.375-6.25-6.25m2.083-5.208a7.293 7.293 0 1 1-14.585 0 7.293 7.293 0 0 1 14.585 0Z"
        stroke="#737373"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" transform="translate(0 .5)" d="M0 0h20v25H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={26}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m3.75 6.75 12.5 12.5m-12.5 0 12.5-12.5-12.5 12.5Z"
      stroke="#737373"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const IconCodeLoad = (props: any) => (
  <ContentLoader
    speed={2}
    width={340}
    height={84}
    viewBox="0 0 340 84"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
    <rect x="76" y="0" rx="3" ry="3" width="140" height="11" />
    <rect x="127" y="48" rx="3" ry="3" width="53" height="11" />
    <rect x="187" y="48" rx="3" ry="3" width="72" height="11" />
    <rect x="18" y="48" rx="3" ry="3" width="100" height="11" />
    <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
    <rect x="18" y="23" rx="3" ry="3" width="140" height="11" />
    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
  </ContentLoader>
)

export const IconFilter = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 rounded-full"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  )
}
