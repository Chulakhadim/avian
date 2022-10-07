import formatFNS from 'date-fns/format'
import { enUS, id } from 'date-fns/locale'
import parseISO from 'date-fns/parseISO'
import kebabCase from 'lodash.kebabcase'
import orderBy from 'lodash.sortby'

export const dateFormat = (
  value: any,
  format?: string,
  locale: string = 'id'
) => {
  const inputFormat = format ? format : 'dd MMM yyyy - HH:mm'
  try {
    if (typeof value === 'string') {
      return formatFNS(parseISO(value), inputFormat, {
        locale: locale === 'id' ? id : enUS,
      })
    } else {
      return formatFNS(value, inputFormat, {
        locale: locale === 'id' ? id : enUS,
      })
    }
  } catch (e) {
    return ''
  }
}

export const urlMedia = (link: string) => {
  if (typeof link !== 'string') return ''
  return `https://avianbrands.com${
    link[0] === '/' ? link : `/${encodeURI(link)}`
  }`
}

export const nest = (
  items: any[],
  id = null,
  link = 'id_parent',
  level = 1,
  id_parent = null
): any[] =>
  items
    .filter((item) => item[link] === id)
    .map((item) => {
      let _id = null

      if (level == 1) {
        _id = item.id
      }

      if (id_parent !== null && id_parent === item.id_parent) {
        _id = item.id
      }

      return {
        ...{
          ...item,
          children: orderBy(
            nest(items, item.id, link, level + 1, _id),
            ['name'],
            'asc'
          ),
        },
        level,
        checked: false,
        _checked: false,
        expand: false,
        value: kebabCase(item.name),
      }
    })

export const uriLink = (link: string) => {
  if (typeof link !== 'string') return ''
  return `${link[0] === '/' ? link : `/${link}`}`
}

export const WebStore = {
  async get(key: string) {
    const capacitor = (window as any).Capacitor
    if (capacitor && !!capacitor.Plugins.Storage) {
      const { value } = await capacitor.Plugins.Storage.get({
        key,
      })
      return value
    } else {
      const value: any = localStorage.getItem(key)
      return JSON.parse(value)
    }
  },
  async set(key: string, value: any) {
    const capacitor = (window as any).Capacitor
    if (capacitor && !!capacitor.Plugins.Storage) {
      await capacitor.Storage.set({
        key,
        value: JSON.stringify(value),
      })
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },
  remove(key: string) {
    const capacitor = (window as any).Capacitor
    if (capacitor && !!capacitor.Plugins.Storage) {
      capacitor.Plugins.Storage.remove({
        key,
      })
    } else {
      localStorage.removeItem(key)
    }
  },
  clear() {
    const capacitor = (window as any).Capacitor
    if (capacitor && !!capacitor.Plugins.Storage) {
      capacitor.Plugins.Storage.clear()
    } else {
      localStorage.clear()
    }
  },
}

export const lightOrDark = (color: any) => {
  if (color === undefined) return false
  let r, g, b, hsp
  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    )

    r = color[1]
    g = color[2]
    b = color[3]
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

    r = color >> 16
    g = (color >> 8) & 255
    b = color & 255
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return 'light'
  } else {
    return 'dark'
  }
}

export const getDeviceId = async () => {
  const capacitor = (window as any).Capacitor
  if (!!capacitor && !!capacitor.Plugins.Device) {
    const { uuid } = await capacitor.Plugins.Device.getId()
    return uuid
  }
  const ipapi = await fetch('https://ipapi.co/json/')
  const ipapiContent = await ipapi.json()
  return ipapiContent.ip
}