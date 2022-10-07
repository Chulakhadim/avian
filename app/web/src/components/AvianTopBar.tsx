import { useLocal } from 'web-utils'
import AvianTopBarSearch from './AvianTopBarSearch'
import { CloseIcon, MenuIcon, SearchIcon } from './top-icons'
export const AvianTopBar = ({
  onShowSidebar,
}: {
  onShowSidebar: () => void
}) => {
  const local = useLocal({
    showSearch: false,
  })
  return (
    <div
      className="flex flex-row justify-between bg-white"
      css={css`
        height: 52px;
        border: 1px solid #ececeb;
        background: #fff url('/imgs/bg.png');
        background-position: -5px 0px;
        background-repeat: no-repeat;
        background-size: cover;
      `}
    >
      <div
        onClick={onShowSidebar}
        className=" btn-fade flex flex-1 items-center px-3"
        css={css``}
      >
        <MenuIcon />

        <div
          className="flex-1 self-stretch my-1"
          css={css`
            background-image: url('/imgs/logo.png');
            background-size: contain;
            background-repeat: no-repeat;
          `}
        />
      </div>
      <div
        className="flex items-center px-5 btn-fade"
        onClick={() => {
          local.showSearch = !local.showSearch
          local.render()
        }}
      >
        {!local.showSearch ? <SearchIcon /> : <CloseIcon />}
      </div>
      {local.showSearch && <AvianTopBarSearch />}
    </div>
  )
}
