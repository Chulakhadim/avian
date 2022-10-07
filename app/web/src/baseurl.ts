import { IBaseUrl } from 'web-init'

export default (props: IBaseUrl) => {
  return `${props.mode === 'prod' ? 'https://mobile.avianbrands.com/' : `http://${props.ips.pop()}:3200/`}`
}
