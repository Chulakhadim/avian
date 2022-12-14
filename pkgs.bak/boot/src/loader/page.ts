import { writeFile, readFile } from 'fs-extra'
import { join } from 'path'
import { dirs } from '..'
import { walkDir } from '../utils'
import PrettyError from 'pretty-error'
import { parse } from '@babel/core'
import pluginJsx from '@babel/plugin-syntax-jsx'
import pluginTs from '@babel/plugin-syntax-typescript'
import traverse from '@babel/traverse'

export const pagePath = {
  out: join(dirs.app.web, 'types', 'page.ts'),
  dir: join(dirs.app.web, 'src', 'base', 'page'),
}

export const apiPath = {
  dir: join(dirs.app.web, 'src', 'api'),
}

export const pageOutput = {
  list: {} as any,
}
export const generatePage = async () => {
  const list = await walkDir(pagePath.dir)
  pageOutput.list = {}

  for (let path of list) {
    try {
      let pathNoExt = path.endsWith('.tsx')
        ? path.substring(0, path.length - 4)
        : path

      const name = pathNoExt
        .substring(join(dirs.app.web, 'src', 'base', 'page').length + 1)
        .replace(/[\/\\]/gi, '.')

      const source = await readFile(path, 'utf-8')
      const parsed = parse(source, {
        sourceType: 'module',
        plugins: [pluginJsx, [pluginTs, { isTSX: true }]],
      })

      let layout = 'default'
      let url = ''
      traverse(parsed, {
        CallExpression: (p) => {
          if (url) return

          const c = p.node
          if (c.callee.type === 'Identifier' && c.callee.name === 'page') {
            const arg = c.arguments[0]

            if (arg && arg.type === 'ObjectExpression') {
              for (let prop of arg.properties) {
                if (
                  prop.type === 'ObjectProperty' &&
                  prop.key.type === 'Identifier' &&
                  prop.value.type === 'StringLiteral'
                ) {
                  if (prop.key.name === 'url') {
                    url = prop.value.value
                  } else if (prop.key.name === 'layout') {
                    layout = prop.value.value
                  }
                }
              }
              const prop = arg.properties[0]
            }
          }
        },
      })
      pageOutput.list[name] = `["${url}", "${layout}", () => import('..${path
        .substring(dirs.app.web.length, path.length - 4)
        .replace(/\\/gi, '/')}')]`
    } catch (e) {}
  }

  const output = `export default {
  ${Object.entries(pageOutput.list)
    .map((arg: any) => {
      const [key, value] = arg
      return `'${key}':${value},`
    })
    .join('\n  ')}
}`
  await writeFile(pagePath.out, output)
}

export const generatePageSingle = async (path: string) => {
  delete require.cache[path]
  try {
    const source = await readFile(path, 'utf-8')
    const page = {
      layout: '',
      url: '',
    }

    const parsed = parse(source, {
      sourceType: 'module',
      plugins: [pluginJsx, [pluginTs, { isTSX: true }]],
    })

    traverse(parsed, {
      CallExpression: (p) => {
        if (page.url) return

        const c = p.node
        if (c.callee.type === 'Identifier' && c.callee.name === 'page') {
          const arg = c.arguments[0]

          if (arg && arg.type === 'ObjectExpression') {
            for (let prop of arg.properties) {
              if (
                prop.type === 'ObjectProperty' &&
                prop.key.type === 'Identifier' &&
                prop.value.type === 'StringLiteral'
              ) {
                if (prop.key.name === 'url') {
                  page.url = prop.value.value
                } else if (prop.key.name === 'layout') {
                  page.layout = prop.value.value
                }
              }
            }
          }
        }
      },
    })

    let pathNoExt = path.endsWith('.tsx')
      ? path.substring(0, path.length - 4)
      : path

    const name = pathNoExt
      .substring(join(dirs.app.web, 'src', 'base', 'page').length + 1)
      .replace(/[\/\\]/gi, '.')

    const layout = page.layout || 'default'
    const expected = `["${page.url}", "${layout}", () => import('..${path
      .substring(dirs.app.web.length, path.length - 4)
      .replace(/\\/gi, '/')}')]`

    if (expected !== pageOutput.list[name]) {
      pageOutput.list[name] = expected

      const output = `export default {
  ${Object.entries(pageOutput.list)
    .map((arg: any) => {
      const [key, value] = arg
      return `'${key}':${value},`
    })
    .join('\n  ')}
}`

      await writeFile(pagePath.out, output)
    }
  } catch (e: any) {
    var pe = new PrettyError()
    console.log(
      `Error while saving \n${path.substring(
        dirs.root.length + 1
      )}:\n\n${pe.render(e)} `
    )
  }
}
