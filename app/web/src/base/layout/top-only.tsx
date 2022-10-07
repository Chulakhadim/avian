import { layout } from 'web-init'
import { MobileLayout } from 'web-ui'
import { AvianTopTitle } from '../../components/AvianTopTitle'

export default layout({
  component: ({ children }) => {
    return (
      <div
        css={css`
          .safe-area-top {
            background: #124734;
          }
          .safe-area-bottom {
            background: #f7f7f8;
          }
          .bottom-bar {
            background: #f7f7f8;
            border-top: 1px solid #e2e2e3;

            .is-active {
              color: #60ae56;
            }
          }
        `}
      >
        <MobileLayout>
          <AvianTopTitle />
          <div
            className="flex flex-1 flex-col relative"
            css={css`
              background: #fbfbfb;
            `}
          >
            <div className="absolute inset-0 overflow-auto flex flex-col">
              {children}
            </div>
          </div>
        </MobileLayout>
      </div>
    )
  },
})
