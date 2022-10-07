import { BackIcon, MenuIcon, SearchIcon } from './top-icons'
export const AvianTopTitle = ({}: {}) => {
  return (
    <div
      className="flex flex-row"
      css={css`
        background: #fff url('/imgs/bg.png');
        background-position: 10px 0px;
        background-repeat: no-repeat;
        height: 52px;
        border: 1px solid #ececeb;
      `}
    >
      <div
        onClick={() => {
          window.history.back()
        }}
        className=" btn-fade flex flex-1 items-center px-3"
      >
        <BackIcon />

        <div
          className="flex-1 self-stretch my-1"
          css={css`
            background-image: url('/imgs/logo.png');
            background-size: contain;
            background-repeat: no-repeat;
          `}
        />
      </div>
    </div>
  )
}
