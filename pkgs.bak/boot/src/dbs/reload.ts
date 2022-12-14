import { execa } from 'execa'
import { copy, copyFile, move, pathExists, readFile, remove } from 'fs-extra'
import { join } from 'path'
import { dirs } from '..'
import { dbsAdd } from './add'

export const dbsInspect = async (name: string) => {
  const path = join(dirs.app.dbs, name)
  if (!(await pathExists(path))) {
    console.log(`DB does not exists: ${path}`)
    return
  }

  await execa('pnpm', ['prisma', 'db', 'pull'], { stdio: 'inherit', cwd: path })
  await execa('pnpm', ['prisma', 'generate'], { stdio: 'inherit', cwd: path })
}

export const dbsGenerate = async (name: string) => {
  const path = join(dirs.app.dbs, name)
  if (!(await pathExists(path))) {
    console.log(`DB does not exists: ${path}`)
    return
  }

  await execa('pnpm', ['prisma', 'generate'], { stdio: 'inherit', cwd: path })
}

export const dbsRepair = async (name: string) => {
  console.log('Repairing prisma: ' + name)

  if (!(await pathExists(join(dirs.app.dbs, name, '.env')))) {
    if (await pathExists(join(dirs.app.dbs, 'db.env'))) {
      await copyFile(join(dirs.app.dbs, 'db.env'), join(dirs.app.dbs, name, '.env'))
    } else {
      console.log(`\n\n
    
    Database environment not initialized
    Please edit database connection file: 
        ${join(dirs.app.dbs, name, '.env')}`)
      return false
    }
  } else if (
    (await readFile(join(dirs.app.dbs, name, '.env'))).toString() === ''
  ) {
    console.log(`Please edit database connection file: 
        ${join(dirs.app.dbs, name, '.env')}`)
    return false
  }

  if (await pathExists(join(dirs.app.dbs, name, 'prisma', 'schema.prisma'))) {
    await copy(
      join(dirs.app.dbs, name, 'prisma', 'schema.prisma'),
      join(dirs.app.dbs, name + '__schema.prisma')
    )
  }

  if (await pathExists(join(dirs.app.dbs, name, '.env'))) {
    await copy(
      join(dirs.app.dbs, name, '.env'),
      join(dirs.app.dbs, name + '__env')
    )
  }

  await remove(join(dirs.app.dbs, name))
  await dbsAdd('db')
  await move(
    join(dirs.app.dbs, name + '__env'),
    join(dirs.app.dbs, name, '.env'),
    {
      overwrite: true,
    }
  )
  await move(
    join(dirs.app.dbs, name + '__schema.prisma'),
    join(dirs.app.dbs, name, 'prisma', 'schema.prisma'),
    {
      overwrite: true,
    }
  )

  await execa('pnpm', ['prisma', 'generate'], {
    stdio: 'inherit',
    cwd: join(dirs.app.dbs, name),
  })
  return true
}
