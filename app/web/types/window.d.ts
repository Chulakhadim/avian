import type * as dbs from 'dbs'

export interface BaseWindow extends Window {
  db: typeof dbs.db & { query: (sql: string) => Promise<any> }
  node_modules: typeof dbs.node_modules & { query: (sql: string) => Promise<any> }
  navigate: (url:string) => void
  user: { role: string } & Record<string, any>
}
