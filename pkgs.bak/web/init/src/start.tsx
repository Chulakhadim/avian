import * as ReactDOMClient from 'react-dom/client'
import { App } from './app'
import { init } from './core/init'
export type IBaseUrl = { mode: 'dev' | 'prod'; ips: string[] }
export const start = ({
  registerSW,
  baseUrl,
}: {
  registerSW: any
  baseUrl: (props: IBaseUrl) => string
}) => {
  init(baseUrl)

  const rootNode = document.getElementById('root')
  if (rootNode) {
    const root = ReactDOMClient.createRoot(rootNode)
    root.render(<App />)
  }

  if (false) {
    registerSW({
      onOfflineReady() {},
    })
  }
}
