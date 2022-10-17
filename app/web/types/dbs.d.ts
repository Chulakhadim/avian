import type * as dbs from 'dbs'

declare global {
  type DBItem<T extends { findFirst: any }> = Exclude<
    Awaited<ReturnType<T['findFirst']>>,
    null
  >
  const db: typeof dbs.db & { query: (sql: string) => Promise<any> }
  const node_modules: typeof dbs.node_modules & { query: (sql: string) => Promise<any> }
}
  